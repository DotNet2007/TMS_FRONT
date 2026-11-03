"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Search, X, CheckCircle2, Circle, RefreshCw } from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { useAuth } from "@/app/context/AuthContext";
import { useGetUsersQuery, useGetTeamByIdQuery } from "@/app/services/team-members-api";
import type { ITeamMember } from "@/app/interfaces/team-interface";
import { translations } from "@/app/translations/dashboard/team/team-page-trans";

type Language = "ar" | "en";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatJoinedDate(value: unknown, language: Language): string {
  if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Date)) {
    return "—";
  }

  if (value === "") return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US");
}

export default function TeamPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { lang, isArabic, darkMode } = useDashboardLayout();
  const language: Language = lang === "ar" ? "ar" : "en";
  const t = translations[language];
  const isRTL = isArabic;
  const isDark = darkMode;

  // Admins and Super Supervisors can manage the full user directory.
  // Employees must only see members of their own team.
  const roleValue: unknown = user?.role;
  const roleFromObject = isRecord(roleValue) ? [roleValue.name, roleValue.code].find((value): value is string => typeof value === "string" && value.trim().length > 0) ?? "": "";

  const userRole = (typeof roleValue === "string" ? roleValue : roleFromObject)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");

  // Explicit employee roles must never use the global /users endpoint,
  // even if a stale or inconsistent isAdmin flag is present in the profile.
  const isEmployeeRole = ["employee", "member", "user", "staff"].includes(userRole);
  const canManageTeam = !isEmployeeRole && (user?.isAdmin === true || ["admin", "administrator", "super supervisor"].includes(userRole));

  // Normalize the teams assigned to this employee for the team selector.
  const employeeTeams = useMemo(() => {
    const memberships = user?.memberships ?? [];

    return memberships
      .map((membership, index) => {
        const record = membership as unknown as Record<string, unknown>;
        const nestedTeam = isRecord(record.team) ? record.team : {};
        const teamId =
          typeof record.teamId === "string" && record.teamId.trim()
            ? record.teamId
            : typeof nestedTeam.id === "string"
              ? nestedTeam.id
              : "";

        const teamNameCandidates = [
          nestedTeam.name,
          record.teamName,
          record.name,
        ];
        const teamName =
          teamNameCandidates.find(
            (value): value is string =>
              typeof value === "string" && value.trim().length > 0
          ) ?? (language === "ar" ? `فريق ${index + 1}` : `Team ${index + 1}`);

        return { teamId, teamName };
      })
      .filter((team) => team.teamId.length > 0)
      .filter((team, index, all) =>
        all.findIndex((candidate) => candidate.teamId === team.teamId) === index
      );
  }, [user?.memberships, language]);

  const [selectedTeamId, setSelectedTeamId] = useState("");

  // Derive a valid selected team instead of synchronizing state in an effect.
  // This also selects the first team automatically when memberships load async.
  const activeSelectedTeamId = employeeTeams.some(
    (team) => team.teamId === selectedTeamId
  )
    ? selectedTeamId
    : employeeTeams[0]?.teamId ?? "";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Debounce API search so we do not send a request for every keystroke.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const { data: adminResponse, isLoading: adminLoading, isFetching: adminFetching, isError: adminError, refetch: refetchAdmin } = useGetUsersQuery({ search: debouncedSearch || undefined, page: currentPage, limit: pageSize }, { skip: authLoading || !canManageTeam });
  const { data: teamResponse, isLoading: employeeLoading, isFetching: employeeFetching, isError: employeeError, refetch: refetchEmployee } = useGetTeamByIdQuery(activeSelectedTeamId, { skip: authLoading || canManageTeam || !activeSelectedTeamId });

  const isLoading = authLoading || (canManageTeam ? adminLoading : employeeLoading);
  const isFetching = canManageTeam ? adminFetching : employeeFetching;
  const isError = !authLoading && (canManageTeam ? adminError : employeeError || employeeTeams.length === 0 || !activeSelectedTeamId);
  const refetch = canManageTeam ? refetchAdmin : refetchEmployee;

  const teamMembers: ITeamMember[] = useMemo(() => {
    if (canManageTeam) {
      return adminResponse?.data ?? [];
    }

    // GET /teams/:id returns one team object, not a list of teams.
    // Some API responses wrap the team in { data: team }.
    const teamRecord = (
      isRecord(teamResponse) && isRecord(teamResponse.data)
        ? teamResponse.data
        : teamResponse
    );

    if (!isRecord(teamRecord)) return [];

    const rawMembers = [
      teamRecord.members,
      teamRecord.users,
      teamRecord.teamMembers,
      teamRecord.memberships,
    ].find(Array.isArray);

    if (!Array.isArray(rawMembers)) return [];

    return rawMembers
      .map((item) => {
        if (!isRecord(item)) return null;

        // Membership responses commonly nest the actual user under `user`.
        const nestedUser = isRecord(item.user) ? item.user : item;

        if (
          !isRecord(nestedUser) ||
          typeof nestedUser.id !== "string" ||
          typeof nestedUser.fullName !== "string" ||
          typeof nestedUser.email !== "string"
        ) {
          return null;
        }

        // The team endpoint may expose the membership's join date separately
        // from the user's account creation date.
        return {
          ...nestedUser,
          createdAt:
            item.joinedAt ??
            item.createdAt ??
            nestedUser.createdAt ??
            null,
        } as unknown as ITeamMember;
      })
      .filter((member): member is ITeamMember => member !== null);
  }, [canManageTeam, adminResponse, teamResponse]);

  const pageBg = isDark ? "bg-[#111827]" : "bg-[#f7f8fc]";
  const cardBg = isDark ? "bg-[#1f2937]" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const mutedColor = isDark ? "text-gray-400" : "text-gray-500";
  const inputBg = isDark ? "border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-500" : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400";

  const activeCount = teamMembers.filter((member) => member.isActive).length;
  const inactiveCount = teamMembers.length - activeCount;

  // Admin search is sent to /users. Employee results are filtered locally
  // because the team-by-id endpoint does not accept a search parameter.
  const filteredMembers = useMemo(() => {
    if (!debouncedSearch) return teamMembers;

    const query = debouncedSearch.toLocaleLowerCase();
    return teamMembers.filter((member) =>
      [member.fullName, member.email, member.role?.name, member.jobTitle?.name]
        .some((value) =>
          typeof value === "string" && value.toLocaleLowerCase().includes(query)
        )
    );
  }, [debouncedSearch, teamMembers]);

  // Admins use API pagination; employees paginate the selected team's members locally.
  const adminPagination = useMemo(() => {
    const pagination =
      isRecord(adminResponse) && isRecord(adminResponse.pagination)
        ? adminResponse.pagination
        : {};

    const total = typeof pagination.total === "number" ? pagination.total : (adminResponse?.data?.length ?? 0);
    const responseTotalPages = typeof pagination.totalPages === "number" ? pagination.totalPages : Math.max(1, Math.ceil(total / pageSize));

    return { total, totalPages: responseTotalPages };
  }, [adminResponse, pageSize]);

  const totalCount = canManageTeam ? adminPagination.total : filteredMembers.length;
  const totalPages = canManageTeam ? adminPagination.totalPages : Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedMembers = useMemo(() => {
    if (canManageTeam) return filteredMembers;

    const startIndex = (activePage - 1) * pageSize;
    return filteredMembers.slice(startIndex, startIndex + pageSize);
  }, [canManageTeam, filteredMembers, activePage, pageSize]);

 

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      lang={language}
      className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8 lg:py-10 ${pageBg} ${textColor}`}
    >
      <div className="mx-auto space-y-7">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-400">
              <Users size={15} />
              {t.workspace}
            </span>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h1>
            <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedColor}`}>{t.description}</p>
          </div>

          {canManageTeam && (
            <button
              type="button"
              onClick={() => router.push("/team/new")}
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#2eb5bc] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#269fa6] focus:outline-none focus:ring-4 focus:ring-teal-500/20 sm:self-auto"
            >
              <Plus size={17} />
              {t.invite}
            </button>
          )}
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title={t.total}
            value={totalCount}
            icon={<Users size={20} />}
            iconClass="bg-teal-500/10 text-teal-600 dark:text-teal-400"
            cardBg={cardBg}
            borderColor={borderColor}
            mutedColor={mutedColor}
          />
          <StatCard
            title={t.active}
            value={activeCount}
            icon={<CheckCircle2 size={20} />}
            iconClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            cardBg={cardBg}
            borderColor={borderColor}
            mutedColor={mutedColor}
          />
          <StatCard
            title={t.inactive}
            value={inactiveCount}
            icon={<Circle size={20} />}
            iconClass="bg-gray-500/10 text-gray-600 dark:text-gray-300"
            cardBg={cardBg}
            borderColor={borderColor}
            mutedColor={mutedColor}
          />
        </div>

        <section className={`overflow-hidden rounded-2xl border shadow-sm ${cardBg} ${borderColor}`}>
          <div className={`flex flex-col gap-4 border-b p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between ${borderColor}`}>
            <div>
              <h2 className="text-lg font-bold">{t.directory}</h2>
              <p className={`mt-1 text-sm ${mutedColor}`}>
                {teamMembers.length} {t.visible}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {!canManageTeam && employeeTeams.length > 1 && (
                <label className="block min-w-48">
                  <span className="sr-only">
                    {language === "ar" ? "اختر الفريق" : "Choose team"}
                  </span>

                  <div className="relative">
                    <select
                      value={activeSelectedTeamId}
                      onChange={(event) => { setSelectedTeamId(event.target.value); setCurrentPage(1); }}
                      className={`min-h-11 w-full appearance-none rounded-xl border py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 ${
                        isRTL ? "ps-3 pe-10" : "ps-3 pe-10"
                      } ${inputBg}`}
                    >
                      {employeeTeams.map((team) => (
                        <option key={team.teamId} value={team.teamId}>
                          {team.teamName}
                        </option>
                      ))}
                    </select>

                    {/* Custom SVG arrow */}
                    <svg
                      className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 ${
                        isRTL ? "left-3" : "right-3"
                      } ${mutedColor}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </label>
              )}
              <label className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 ${inputBg}`}>
                <Search size={17} className={mutedColor} />
                <input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }}
                  placeholder={t.search}
                  className="w-full min-w-0 bg-transparent text-sm outline-none sm:w-64"
                />
                {search && (
                  <button type="button" onClick={() => { setSearch(""); setCurrentPage(1); }} aria-label={t.resetSearch} className={mutedColor}>
                    <X size={15} />
                  </button>
                )}
              </label>
              {isFetching && !isLoading && (
                <span className={`inline-flex items-center gap-2 text-xs ${mutedColor}`}>
                  <RefreshCw size={14} className="animate-spin" />
                  {t.refreshing}
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className={`p-12 text-center text-sm ${mutedColor}`}>{t.loading}</div>
          ) : isError ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <p role="alert" className="text-sm text-red-500">
                {!canManageTeam && employeeTeams.length === 0
                  ? language === "ar"
                    ? "حسابك غير مرتبط بفريق. تواصل مع المسؤول."
                    : "Your account is not assigned to a team. Please contact your administrator."
                  : t.loadError}
              </p>
              {(canManageTeam || selectedTeamId) && (
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600"
                >
                  <RefreshCw size={15} />
                  {t.retry}
                </button>
              )}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className={`flex flex-col items-center justify-center px-6 py-16 text-center ${mutedColor}`}>
              <span className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <Search size={24} />
              </span>
              <h3 className={`font-semibold ${textColor}`}>{t.noMembers}</h3>
              <p className="mt-2 text-sm">{t.noMembersDescription}</p>
              {search && (
                <button type="button" onClick={() => { setSearch(""); setCurrentPage(1); }} className="mt-4 text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {t.resetSearch}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-200 text-start">
                  <thead className={isDark ? "bg-gray-900/50" : "bg-gray-50"}>
                    <tr className={`border-b text-xs font-semibold ${mutedColor} ${borderColor}`}>
                      <th className="px-6 py-4 text-start">{t.member}</th>
                      <th className="px-4 py-4 text-start">{t.role}</th>
                      <th className="px-4 py-4 text-start">{t.jobTitle}</th>
                      <th className="px-4 py-4 text-start">{t.status}</th>
                      <th className="px-4 py-4 text-start">{t.joined}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-100"}`}>
                    {paginatedMembers.map((member) => (
                      <tr
                        key={member.id}
                        onClick={
                          canManageTeam
                            ? () => router.push(`/team/${member.id}`)
                            : undefined
                        }
                        onKeyDown={
                          canManageTeam
                            ? (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  router.push(`/team/${member.id}`);
                                }
                              }
                            : undefined
                        }
                        tabIndex={canManageTeam ? 0 : undefined}
                        role={canManageTeam ? "link" : undefined}
                        aria-label={
                          canManageTeam
                            ? `${language === "ar" ? "عرض تفاصيل" : "View details"}: ${member.fullName}`
                            : undefined
                        }
                        className={`transition-colors ${
                          canManageTeam ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500" : ""
                        } ${isDark ? "hover:bg-gray-800/60" : "hover:bg-gray-50"}`}
                      >
                        <td className="px-6 py-4">
                          <MemberIdentity member={member} mutedColor={mutedColor} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium">{member.role.name}</div>
                          <div className={`mt-1 text-xs ${mutedColor}`}>{member.role.id}</div>
                        </td>
                        <td className="max-w-xs px-4 py-4 text-sm">{member.jobTitle?.name || t.unknown}</td>
                        <td className="px-4 py-4">
                          <MemberStatus active={member.isActive} language={language} />
                        </td>
                        <td className={`whitespace-nowrap px-4 py-4 text-xs ${mutedColor}`}>
                          {formatJoinedDate(member.createdAt, language)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {paginatedMembers.map((member) => (
                  <article
                    key={member.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      isDark ? "hover:bg-gray-800/60" : "hover:bg-gray-50"
                    } ${borderColor}`}
                  >
                    
                    <div className={`mt-4 grid grid-cols-2 gap-4 border-t pt-4 ${borderColor}`}>
                      <div>
                        <p className={`mb-1 text-xs ${mutedColor}`}>{t.role}</p>
                        <p className="text-sm font-medium">{member.role.name}</p>
                      </div>
                      <div>
                        <p className={`mb-1 text-xs ${mutedColor}`}>{t.status}</p>
                        <MemberStatus active={member.isActive} language={language} />
                      </div>
                      <div className="col-span-2">
                        <p className={`mb-1 text-xs ${mutedColor}`}>{t.jobTitle}</p>
                        <p className="text-sm font-medium">{member.jobTitle?.name || t.unknown}</p>
                      </div>
                      <div>
                        <p className={`mb-1 text-xs ${mutedColor}`}>{t.joined}</p>
                        <p className="text-sm">{formatJoinedDate(member.createdAt, language)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {totalCount > pageSize && totalPages > 1 && (
            <div
              className={`flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${borderColor}`}
              aria-label={language === "ar" ? "ترقيم الصفحات" : "Pagination"}
            >
              <p className={`text-sm ${mutedColor}`}>
                {language === "ar"
                  ? `عرض ${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, totalCount)} من ${totalCount}`
                  : `Showing ${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, totalCount)} of ${totalCount}`}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))}
                  disabled={activePage === 1}
                  className={`min-h-9 rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${borderColor} ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  {language === "ar" ? "السابق" : "Previous"}
                </button>

                <span className={`min-w-20 text-center text-sm ${mutedColor}`} aria-live="polite">
                  {language === "ar"
                    ? `صفحة ${activePage} من ${totalPages}`
                    : `Page ${activePage} of ${totalPages}`}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, Math.min(page, totalPages) + 1))}
                  disabled={activePage === totalPages}
                  className={`min-h-9 rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${borderColor} ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  {language === "ar" ? "التالي" : "Next"}
                </button>
              </div>
            </div>
          )}

        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconClass,
  cardBg,
  borderColor,
  mutedColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  cardBg: string;
  borderColor: string;
  mutedColor: string;
}) {
  return (
    <article className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${cardBg} ${borderColor}`}>
      <div className="flex items-start justify-between gap-4">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>{icon}</span>
        <span className={`text-xs font-medium ${mutedColor}`}>{title}</span>
      </div>
      <strong className="mt-5 block text-3xl font-bold tracking-tight">{value}</strong>
    </article>
  );
}

function MemberIdentity({
  member,
  mutedColor,
}: {
  member: ITeamMember;
  mutedColor: string;
}) {
  const initials = member.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("") || "?";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-xs font-bold text-teal-700 dark:text-teal-300">
        {initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{member.fullName}</p>
        <p dir="ltr" className={`mt-1 truncate text-xs ${mutedColor}`}>{member.email}</p>
      </div>
    </div>
  );
}

function MemberStatus({
  active,
  language,
}: {
  active: boolean;
  language: Language;
}) {
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium ${active ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}`}>
      {active ? <CheckCircle2 size={14} /> : <Circle size={12} />}
      {active
        ? language === "ar" ? "نشط" : "Active"
        : language === "ar" ? "غير نشط" : "Inactive"}
    </span>
  );
}










