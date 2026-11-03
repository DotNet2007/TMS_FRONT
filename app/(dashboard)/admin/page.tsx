"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Archive, Check, ChevronLeft, CircleUserRound, Folder, Plus, Search,
  Shield, Sparkles, Users, UserRound, X, LoaderCircle,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { adminManagementTranslations } from "@/app/translations/dashboard/admin/admin-trans";


import {
  useGetTeamsQuery,
  useGetAdminUsersQuery,
  useGetTeamMembershipsQuery,
  useAddTeamMemberMutation,
  useEndTeamMembershipMutation,
  useUpdateTeamMutation,
  useChangeTeamSupervisorMutation,
  useUpdateAdminUserMutation,
  useDeactivateAdminUserMutation,
  useReactivateAdminUserMutation,
  useGetRolesQuery,
  useGetJobTitlesQuery,
  useCreateTeamMutation,
} from "@/app/services/team-members-api";
import type { ITeam, IAdminUser, IRole, IJobTitle, ITeamMembership } from "@/app/services/team-members-api";

type AdminPage = "teams" | "members" | "employees" | "teamMembers";
type Tone = "teal" | "blue" | "cyan" | "sand" | "navy" | "rose";
type LooseRecord = Record<string, unknown>;

function listFrom<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && Array.isArray((value as { data?: unknown }).data)) {
    return (value as { data: T[] }).data;
  }
  return [];
}
function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase() || "?";
}
function toneFor(index: number): Tone {
  return (["teal", "sand", "blue", "navy", "rose", "cyan"] as Tone[])[index % 6];
}
function errorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const data = (error as { data?: { message?: unknown; detail?: unknown } }).data;
    if (data && typeof data.message === "string") return data.message;
    if (data && typeof data.detail === "string") return data.detail;
  }
  return fallback;
}

type TeamView = {
  id: string; name: string; code: string; count: number; tone: Tone;
  description: string; managerId: string; managerName: string;
  active: boolean;
};
type EmployeeView = {
  id: string; name: string; email: string; roleId: string;
  roleName: string; jobTitleId: string; jobTitleName: string;
  active: boolean; tone: Tone;
};

export default function AdminManagementPage() {
  const { isArabic, darkMode } = useDashboardLayout();
  const t = adminManagementTranslations[isArabic ? "ar" : "en"];
  const [page, setPage] = useState<AdminPage>("teams");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamManagerId, setTeamManagerId] = useState("");
  const [membershipTeamId, setMembershipTeamId] = useState("");
  const [pendingRemoval, setPendingRemoval] = useState<{ employeeName: string; teamId: string; membershipId: string } | null>(null);
  const [employeeName, setEmployeeName] = useState<string | null>(null);
  const [employeeEmail, setEmployeeEmail] = useState<string | null>(null);
  const [employeeRoleId, setEmployeeRoleId] = useState<string | null>(null);
  const [employeeJobTitleId, setEmployeeJobTitleId] = useState<string | null>(null);

  const teamsQuery = useGetTeamsQuery({ page: 1, limit: 100 });
  const usersQuery = useGetAdminUsersQuery({ page: 1, limit: 100, search: employeeSearch || undefined });
  const rolesQuery = useGetRolesQuery({ page: 1, limit: 100 });
  const jobTitlesQuery = useGetJobTitlesQuery({ page: 1, limit: 100, activeOnly: true });
  const [updateTeam, updateTeamState] = useUpdateTeamMutation();
  const [changeSupervisor, supervisorState] = useChangeTeamSupervisorMutation();
  const [createTeam, createTeamState] = useCreateTeamMutation();
  const [addTeamMember, addMemberState] = useAddTeamMemberMutation();
  const [endTeamMembership, endMembershipState] = useEndTeamMembershipMutation();
  const [updateAdminUser, updateUserState] = useUpdateAdminUserMutation();
  const [deactivateUser, deactivateState] = useDeactivateAdminUserMutation();
  const [reactivateUser, reactivateState] = useReactivateAdminUserMutation();

  const teamsRaw = listFrom<ITeam>(teamsQuery.data);
  const usersRaw = listFrom<IAdminUser>(usersQuery.data);
  const roles = listFrom<IRole>(rolesQuery.data);
  const jobTitles = listFrom<IJobTitle>(jobTitlesQuery.data);

  const employees: EmployeeView[] = usersRaw.map((user, index) => {
    // The API may return role/job title as an ID, a name, or a nested object.
    const rawUser = user as IAdminUser & LooseRecord;
    const roleValue = rawUser.role;
    const jobValue = rawUser.jobTitle;
    const nestedRole = roleValue && typeof roleValue === "object"
      ? roleValue as LooseRecord
      : undefined;
    const nestedJob = jobValue && typeof jobValue === "object"
      ? jobValue as LooseRecord
      : undefined;
    const rawRoleString = typeof roleValue === "string" ? roleValue : "";
    const roleIdFromApi = str(rawUser.roleId) || str(nestedRole?.id);
    const roleLabelFromApi = str(nestedRole?.name) || rawRoleString || str(rawUser.roleName) || str(rawUser.accountType) || str(rawUser.roleTitle);
    const roleById = roles.find((item) =>
      String(item.id).toLowerCase() === (roleIdFromApi || rawRoleString).toLowerCase()
    );
    const roleByName = roles.find((item) =>
      String(item.name).trim().toLowerCase() === roleLabelFromApi.trim().toLowerCase()
    );
    const role = roleById || roleByName;
    const roleId = roleIdFromApi || (role ? String(role.id) : "");
    const jobTitleId = str(rawUser.jobTitleId) || str(nestedJob?.id);
    const job = jobTitles.find((item) => String(item.id).toLowerCase() === jobTitleId.toLowerCase());
    const roleName = role?.name
      || str(nestedRole?.name)
      || rawRoleString
      || str(rawUser.roleName)
      || str(rawUser.accountType)
      || str(rawUser.roleTitle);
    const jobTitleName = job?.name
      || str(nestedJob?.name)
      || (typeof jobValue === "string" ? jobValue : "")
      || str(rawUser.jobTitleName);

    return {
      id: user.id,
      name: str(rawUser.fullName, str(rawUser.name, "Unnamed employee")),
      email: str(rawUser.email),
      roleId,
      roleName,
      jobTitleId,
      jobTitleName,
      active: user.isActive !== false,
      tone: toneFor(index),
    };
  });

const teams: TeamView[] = teamsRaw.map((team, index) => {
  const raw = team as ITeam & LooseRecord;
  const rawCount = raw._count as
    | { memberships?: number; tasks?: number }
    | undefined;

  const manager = employees.find(
    (employee) => employee.id === team.supervisorId
  );

  return {
    id: team.id,
    name: team.name,
    code: str(raw.code, team.name.slice(0, 3).toUpperCase()),
    count: Number(
      rawCount?.memberships ??
      raw.memberCount ??
      raw.membersCount ??
      0
    ),
    tone: toneFor(index),
    description: team.description ?? "",
    managerId: team.supervisorId ?? "",
    managerName:
      manager?.name ??
      str((raw.supervisor as LooseRecord | undefined)?.fullName),
    active: team.isActive !== false,
  };
});

  // Derive defaults from the query data instead of synchronizing state in effects.
  const selectedTeam = teams.find((team) => team.id === selectedTeamId);
  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId) ?? employees[0];
  const employeeFormName = employeeName ?? selectedEmployee?.name ?? "";
  const employeeFormEmail = employeeEmail ?? selectedEmployee?.email ?? "";
  const employeeFormRoleId = employeeRoleId ?? selectedEmployee?.roleId ?? "";
  const employeeFormJobTitleId = employeeJobTitleId ?? selectedEmployee?.jobTitleId ?? "";
  const teamFormName = teamName || selectedTeam?.name || "";
  const teamFormDescription = teamDescription || selectedTeam?.description || "";
  const teamFormManagerId = teamManagerId || selectedTeam?.managerId || "";
  const teamHasChanges = Boolean(selectedTeam) && (
    teamFormName.trim() !== selectedTeam!.name.trim() ||
    teamFormDescription.trim() !== selectedTeam!.description.trim() ||
    teamFormManagerId !== selectedTeam!.managerId
  );
  const employeeHasChanges = Boolean(selectedEmployee) && (
    employeeFormName.trim() !== selectedEmployee!.name.trim() ||
    employeeFormEmail.trim().toLowerCase() !== selectedEmployee!.email.trim().toLowerCase() ||
    employeeFormRoleId !== selectedEmployee!.roleId ||
    employeeFormJobTitleId !== selectedEmployee!.jobTitleId
  );
  const membershipsQuery = useGetTeamMembershipsQuery(
    selectedTeam?.id ? { teamId: selectedTeam.id } : skipToken
  );
  const memberships = listFrom<ITeamMembership>(membershipsQuery.data);

  // employees is derived from RTK Query data on each render, so useMemo would
  // depend on a newly-created array and cannot preserve useful memoization here.
  const employeeQuery = employeeSearch.trim().toLowerCase();
  const filteredEmployees = employeeQuery
    ? employees.filter((employee) => `${employee.name} ${employee.email}`.toLowerCase().includes(employeeQuery))
    : employees;

  const isDark = Boolean(darkMode);
  const panelClass = isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900";
  const softPanelClass = isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const fieldClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`;
  const secondaryButtonClass = `inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`;
  const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-500/40";
  const busy = updateTeamState.isLoading || supervisorState.isLoading || createTeamState.isLoading ||
    addMemberState.isLoading || endMembershipState.isLoading || updateUserState.isLoading || deactivateState.isLoading || reactivateState.isLoading;

  const notify = (message: string, isError = false) => {
    if (isError) toast.error(message);
    else toast.success(message);
  };
  const handleError = (error: unknown) => toast.error(
    errorMessage(error, isArabic ? "حدث خطأ، حاول مرة أخرى." : "Something went wrong. Please try again.")
  );

  const chooseTeam = (team: TeamView) => {
    setSelectedTeamId(team.id);
    setTeamName(team.name);
    setTeamDescription(team.description);
    setTeamManagerId(team.managerId);
    setMembershipTeamId(team.id);
  };
  const chooseEmployee = (employee: EmployeeView) => {
    setSelectedEmployeeId(employee.id);
    setEmployeeName(employee.name);
    setEmployeeEmail(employee.email);
    setEmployeeRoleId(employee.roleId);
    setEmployeeJobTitleId(employee.jobTitleId);
  };

  const handleCreateTeam = async () => {
    const name = teamName.trim();
    if (!name) {
      notify(isArabic ? "اكتب اسم الفريق أولًا." : "Enter a team name first.", true);
      return;
    }
    if (!teamManagerId) {
      notify(isArabic ? "اختر مسؤول الفريق." : "Select a team manager.", true);
      return;
    }

    try {
      const created = await createTeam({
        name,
        description: teamDescription.trim() || undefined,
        supervisorId: teamManagerId,
      }).unwrap();
      setSelectedTeamId(created.id);
      notify(isArabic ? "تم إنشاء الفريق بنجاح." : "Team created successfully.");
    } catch (error) {
      handleError(error);
    }
  };

  const saveTeam = async () => {
    if (!selectedTeam) return;
    try {
      await updateTeam({
        id: selectedTeam.id,
        name: (teamName || selectedTeam.name).trim(),
        description: teamDescription || selectedTeam.description,
        isActive: selectedTeam.active,
      }).unwrap();
      const nextManagerId = teamManagerId || selectedTeam.managerId;
      if (nextManagerId) {
        await changeSupervisor({ teamId: selectedTeam.id, supervisorId: nextManagerId }).unwrap();
      }
      notify(isArabic ? "تم حفظ بيانات الفريق بنجاح." : "Team details saved successfully.");
    } catch (error) { handleError(error); }
  };

  const saveEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      await updateAdminUser({
        id: selectedEmployee.id,
        fullName: employeeFormName.trim(),
        email: employeeFormEmail.trim(),
        roleId: employeeFormRoleId || undefined,
        jobTitleId: employeeFormJobTitleId || null,
      }).unwrap();
      notify(isArabic ? "تم حفظ بيانات الموظف بنجاح." : "Employee details saved successfully.");
    } catch (error) { handleError(error); }
  };

  const handleAddMember = async () => {
    if (!membershipTeamId || !selectedEmployee) return;
    try {
      await addTeamMember({ teamId: membershipTeamId, userId: selectedEmployee.id }).unwrap();
      notify(isArabic ? "تمت إضافة الموظف إلى الفريق بنجاح." : "Employee added to the team successfully.");
    } catch (error) { handleError(error); }
  };

  const handleToggleUserStatus = async () => {
    if (!selectedEmployee) return;
    try {
      if (selectedEmployee.active) await deactivateUser(selectedEmployee.id).unwrap();
      else await reactivateUser(selectedEmployee.id).unwrap();
      notify(selectedEmployee.active
        ? (isArabic ? "تم إيقاف حساب الموظف." : "Employee account deactivated.")
        : (isArabic ? "تم تفعيل حساب الموظف." : "Employee account reactivated."));
    } catch (error) { handleError(error); }
  };

  const tabItems: { id: AdminPage; icon: typeof Folder; title: string; description: string }[] = [
    { id: "teams", icon: Folder, title: t.teamsTab, description: t.teamsTabDescription },
    { id: "members", icon: Users, title: t.membersTab, description: t.membersTabDescription },
    { id: "employees", icon: UserRound, title: t.employeesTab, description: t.employeesTabDescription },
  ];

  const loading = teamsQuery.isLoading || usersQuery.isLoading || rolesQuery.isLoading || jobTitlesQuery.isLoading;
  const queryError = teamsQuery.error || usersQuery.error || rolesQuery.error || jobTitlesQuery.error;

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className={`mx-auto w-full space-y-6 p-4 sm:p-6 lg:p-8 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-teal-600"><Shield size={15} /> {t.adminPanel}</span>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.pageTitle}</h1>
          <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedClass}`}>{t.pageDescription}</p>
        </div>
        {busy && <span className={`inline-flex items-center gap-2 text-sm ${mutedClass}`}><LoaderCircle className="animate-spin" size={15} />{isArabic ? "جارٍ الحفظ..." : "Saving..."}</span>}
      </header>

      {loading && <div className={`flex items-center justify-center gap-2 rounded-2xl border p-8 text-sm ${panelClass}`}><LoaderCircle className="animate-spin" size={18} />{isArabic ? "جارٍ تحميل البيانات..." : "Loading data..."}</div>}
      {!loading && queryError && <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">{errorMessage(queryError, isArabic ? "تعذر تحميل البيانات من الخادم." : "Could not load data from the server.")}</div>}

      <nav aria-label={t.adminPages} className={`grid grid-cols-1 gap-2 rounded-2xl border p-2 sm:grid-cols-3 ${panelClass}`}>
        {tabItems.map(({ id, icon: Icon, title, description }) => (
          <button key={id} type="button" onClick={() => setPage(id)} aria-pressed={page === id} className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 text-start transition sm:p-4 ${page === id ? "border-teal-500/40 bg-teal-500/10 text-teal-600" : `border-transparent ${mutedClass} ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}`}>
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${page === id ? "bg-teal-500 text-white" : isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}><Icon size={18} /></span>
            <span className="min-w-0"><strong className="block text-sm font-bold">{title}</strong><small className={`mt-1 block text-xs ${mutedClass}`}>{description}</small></span>
          </button>
        ))}
      </nav>

      {page === "teams" && (
        <div className="grid min-w-0 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className={`h-fit rounded-2xl border p-4 ${panelClass}`}>
            <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-bold">{t.currentTeams}</h2><p className={`mt-1 text-xs ${mutedClass}`}>{teams.length} {t.teamsCount}</p></div>
              <button type="button" aria-label={t.createTeam} onClick={() => {
                setSelectedTeamId("");
                setTeamName("");
                setTeamDescription("");
                setTeamManagerId(employees[0]?.id ?? "");
              }} className={secondaryButtonClass}><Plus size={16} /></button>
            </div>
            <div className="space-y-1.5">
              {teams.map((team) => <button key={team.id} type="button" onClick={() => chooseTeam(team)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start transition ${selectedTeam?.id === team.id ? "border-teal-500/40 bg-teal-500/10" : `border-transparent ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}`}>
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${toneClasses(team.tone, isDark)}`}><Users size={16} /></span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{team.name}</strong><small className={`mt-1 block text-xs ${mutedClass}`}>{team.count} {t.membersCount}</small></span><ChevronLeft size={15} className={mutedClass} />
              </button>)}
              {!teams.length && <p className={`p-4 text-sm ${mutedClass}`}>{isArabic ? "لا توجد فرق." : "No teams found."}</p>}
            </div>
          </aside>

          {!selectedTeam && <div className={`min-w-0 rounded-2xl border p-4 sm:p-6 ${panelClass}`}>
            <div className="mb-6 border-b pb-5" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}>
              <h2 className="text-lg font-bold">{isArabic ? "إضافة فريق جديد" : "Add a team"}</h2>
              <p className={`mt-1 text-sm ${mutedClass}`}>{isArabic ? "أدخل بيانات الفريق وحدد المسؤول عنه." : "Enter the team details and choose its manager."}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.teamName} dark={isDark} full>
                <input className={fieldClass} value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder={isArabic ? "اسم الفريق" : "Team name"} />
              </Field>
              <Field label={t.teamDescription} dark={isDark}>
                <input className={fieldClass} value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} placeholder={isArabic ? "وصف الفريق (اختياري)" : "Team description (optional)"} />
              </Field>
              <Field label={t.teamManager} dark={isDark} full>
                <div className="relative"><select className={`${fieldClass} appearance-none ${isArabic ? "pl-10" : "pr-10"}`} value={teamManagerId} onChange={(e) => setTeamManagerId(e.target.value)}>
                  <option value="">{isArabic ? "اختر المسؤول" : "Select team manager"}</option>
                  {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
                </select><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-slate-500 ${isArabic ? "left-3" : "right-3"}`}><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              </Field>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" disabled={busy || !teamName.trim() || !teamManagerId} onClick={handleCreateTeam} className={primaryButtonClass}>
                <Plus size={15} />{isArabic ? "إنشاء الفريق" : "Create team"}
              </button>
              {teams.length > 0 && <button type="button" onClick={() => chooseTeam(teams[0])} className={secondaryButtonClass}>{isArabic ? "إلغاء" : "Cancel"}</button>}
            </div>
          </div>}

          {selectedTeam && <div className={`min-w-0 rounded-2xl border p-4 sm:p-6 ${panelClass}`}>
            <div className="mb-6 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}>
              <div><h2 className="text-lg font-bold">{t.teamData} {selectedTeam.name}</h2><p className={`mt-1 text-sm ${mutedClass}`}>{t.teamDataDescription}</p></div>
              <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${selectedTeam.active ? (isDark ? "bg-emerald-950 text-emerald-300" : "bg-emerald-50 text-emerald-700") : "bg-rose-50 text-rose-700"}`}><i className={`size-1.5 rounded-full ${selectedTeam.active ? "bg-emerald-500" : "bg-rose-500"}`} />{selectedTeam.active ? t.activeTeam : (isArabic ? "غير نشط" : "Inactive")}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.teamName} dark={isDark} full><input className={fieldClass} value={teamName || selectedTeam.name} onChange={(e) => setTeamName(e.target.value)} /></Field>
              <Field label={t.teamDescription} dark={isDark} full><textarea rows={4} className={`${fieldClass} resize-y`} value={teamDescription || selectedTeam.description} onChange={(e) => setTeamDescription(e.target.value)} /></Field>
              <Field label={t.teamManager} dark={isDark} full><div className="relative"><select className={`${fieldClass} appearance-none ${isArabic ? "pl-10" : "pr-10"}`} value={teamManagerId || selectedTeam.managerId} onChange={(e) => setTeamManagerId(e.target.value)}><option value="">{isArabic ? "اختر المسؤول" : "Select supervisor"}</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-slate-500 ${isArabic ? "left-3" : "right-3"}`}><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Field>
            </div>
            <button type="button" onClick={() => setPage("teamMembers")} className={`mt-6 flex w-full flex-col gap-3 rounded-xl border p-4 text-start transition hover:border-teal-500/50 hover:bg-teal-500/5 sm:flex-row sm:items-center sm:justify-between ${softPanelClass}`} aria-label={isArabic ? "عرض أعضاء الفريق" : "View team members"}>
              <div><strong className="text-sm">{t.teamMembers}</strong><p className={`mt-1 text-xs ${mutedClass}`}>{memberships.length} {t.employeesCount}</p><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-600">{isArabic ? "عرض الأعضاء" : "View members"}<ChevronLeft size={14} /></span></div>
              <div className="flex items-center -space-x-2 rtl:space-x-reverse">{employees.filter((employee) => memberships.some((membership) => membership.userId === employee.id)).slice(0, 4).map((employee) => <span key={employee.id} title={employee.name} className={`grid size-9 place-items-center rounded-full border-2 text-xs font-bold ${toneClasses(employee.tone, isDark)} ${isDark ? "border-slate-800" : "border-white"}`}>{initials(employee.name)}</span>)}<span className={`grid size-9 place-items-center rounded-full border-2 text-xs font-bold ${isDark ? "border-slate-800 bg-slate-700 text-slate-200" : "border-white bg-slate-200 text-slate-600"}`}>+{Math.max(memberships.length - 4, 0)}</span></div>
            </button>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button type="button" disabled={busy || !teamHasChanges || !teamFormName.trim()} onClick={saveTeam} className={primaryButtonClass}><Check size={15} />{t.saveChanges}</button>
              <button type="button" onClick={() => chooseTeam(selectedTeam)} className={secondaryButtonClass}>{t.cancel}</button>
              <button type="button" disabled={busy} onClick={async () => { try { await updateTeam({ id: selectedTeam.id, isActive: !selectedTeam.active }).unwrap(); notify(selectedTeam.active ? (isArabic ? "تم إيقاف الفريق." : "Team deactivated.") : (isArabic ? "تم تفعيل الفريق." : "Team activated.")); } catch (error) { handleError(error); } }} className={`ms-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-500 transition ${isDark ? "hover:bg-rose-950/40" : "hover:bg-rose-50"}`}><Archive size={15} />{selectedTeam.active ? t.archiveTeam : (isArabic ? "تفعيل الفريق" : "Activate team")}</button>
            </div>
          </div>}
        </div>
      )}

      {page === "teamMembers" && selectedTeam && <div className={`min-w-0 rounded-2xl border p-4 sm:p-6 ${panelClass}`}>
        <div className="mb-6 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}>
          <div><h2 className="text-lg font-bold">{isArabic ? "أعضاء فريق" : "Team members"}: {selectedTeam.name}</h2><p className={`mt-1 text-sm ${mutedClass}`}>{isArabic ? "الأعضاء المنضمون إلى هذا الفريق فقط." : "Only employees assigned to this team are shown here."}</p></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => { setMembershipTeamId(selectedTeam.id); setPage("members"); }} className={primaryButtonClass}><Plus size={15} />{isArabic ? "إضافة عضو" : "Add member"}</button>
            <button type="button" onClick={() => setPage("teams")} className={secondaryButtonClass}><ChevronLeft size={16} className={isArabic ? "rotate-180" : ""} />{isArabic ? "العودة إلى الفرق" : "Back to teams"}</button>
          </div>
        </div>
        {membershipsQuery.isLoading ? <div className={`p-6 text-sm ${mutedClass}`}>{isArabic ? "جارٍ تحميل أعضاء الفريق..." : "Loading team members..."}</div> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {employees.filter((employee) => memberships.some((membership) => membership.userId === employee.id && !membership.endedAt)).map((employee) => {
            const membership = memberships.find((item) => item.userId === employee.id && !item.endedAt);
            return <div key={employee.id} className={`flex min-w-0 items-center gap-3 rounded-xl border p-4 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <button type="button" onClick={() => { chooseEmployee(employee); setPage("employees"); }} className="flex min-w-0 flex-1 items-center gap-3 text-start">
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl text-xs font-bold ${toneClasses(employee.tone, isDark)}`}>{initials(employee.name)}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{employee.name}</strong><small className={`mt-1 block truncate text-xs ${mutedClass}`} dir={isArabic ? "rtl" : "ltr"}>{employee.email}</small><small className={`mt-1 block truncate text-xs ${mutedClass}`}>{employee.roleName || (isArabic ? "بدون دور" : "No role")}</small></span><CircleUserRound size={17} className={mutedClass} />
              </button>
              <button type="button" disabled={busy || !membership?.id} title={isArabic ? "إزالة من الفريق" : "Remove from team"} aria-label={isArabic ? `إزالة ${employee.name} من الفريق` : `Remove ${employee.name} from team`} onClick={() => {
                if (!membership?.id) return;
                setPendingRemoval({ employeeName: employee.name, teamId: selectedTeam.id, membershipId: membership.id });
              }} className={`inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-rose-500 transition disabled:cursor-not-allowed disabled:opacity-40 ${isDark ? "hover:bg-rose-950/40" : "hover:bg-rose-50"}`}><X size={16} /></button>
            </div>;
          })}
          {!employees.some((employee) => memberships.some((membership) => membership.userId === employee.id && !membership.endedAt)) && <p className={`col-span-full rounded-xl border border-dashed p-8 text-center text-sm ${mutedClass}`}>{isArabic ? "لا يوجد أعضاء في هذا الفريق حتى الآن." : "This team has no members yet."}</p>}
        </div>}
      </div>}

      {page === "members" && <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className={`min-w-0 rounded-2xl border p-4 sm:p-6 ${panelClass}`}>
          <div className="mb-6 flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{t.addEmployeeToTeam}</h2><p className={`mt-1 text-sm ${mutedClass}`}>{t.addEmployeeDescription}</p></div><span className={`grid size-10 shrink-0 place-items-center rounded-xl ${isDark ? "bg-slate-800 text-teal-300" : "bg-teal-50 text-teal-600"}`}><Users size={18} /></span></div>
          <label className="mb-3 block text-sm font-semibold">{t.searchEmployee}</label>
          <div className={`mb-4 flex items-center gap-2 rounded-xl border px-3 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}><Search size={16} className={mutedClass} /><input className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" value={employeeSearch} onChange={(e) => setEmployeeSearch(e.target.value)} placeholder={t.searchEmployeePlaceholder} /></div>
          <div className="space-y-2">{filteredEmployees.map((employee) => <button key={employee.id} type="button" onClick={() => { setSelectedEmployeeId(employee.id); setMembershipTeamId(selectedTeam?.id ?? membershipTeamId); }} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start transition ${(selectedEmployeeId || selectedEmployee?.id) === employee.id ? "border-teal-500/50 bg-teal-500/10" : isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}><span className={`grid size-10 shrink-0 place-items-center rounded-xl text-xs font-bold ${toneClasses(employee.tone, isDark)}`}>{initials(employee.name)}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{employee.name}</strong><small className={`mt-1 block truncate text-xs ${mutedClass}`} dir={isArabic ? "rtl" : "ltr"}>{employee.email}</small><small className={`mt-1 block truncate text-xs ${mutedClass}`}>{employee.roleName || (isArabic ? "بدون دور" : "No role assigned")}</small></span></button>)}</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label={t.team} dark={isDark}><div className="relative"><select className={`${fieldClass} appearance-none ${isArabic ? "pl-10" : "pr-10"}`} value={membershipTeamId} onChange={(e) => setMembershipTeamId(e.target.value)}><option value="">{isArabic ? "اختر الفريق" : "Select team"}</option>{teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-slate-500 ${isArabic ? "left-3" : "right-3"}`}><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Field>
          </div>
          <div className="mt-6 flex flex-wrap gap-2"><button type="button" disabled={busy || !selectedEmployee || !membershipTeamId} onClick={handleAddMember} className={primaryButtonClass}><Plus size={15} />{t.addToTeam}</button></div>
        </div>
        <aside className={`h-fit rounded-2xl border p-5 ${panelClass}`}>
          <span className={`mb-4 grid size-11 place-items-center rounded-xl ${isDark ? "bg-teal-950 text-teal-300" : "bg-teal-50 text-teal-600"}`}><Sparkles size={21} /></span>
          <h3 className="font-bold">{t.membershipSummary}</h3>
          <div className={`mt-4 space-y-4 border-y py-4 ${isDark ? "border-slate-700" : "border-slate-100"}`}>
            <SummaryRow label={t.employee} value={selectedEmployee?.name ?? "—"} dark={isDark} />
            <SummaryRow label={t.team} value={teams.find((team) => team.id === membershipTeamId)?.name ?? "—"} dark={isDark} />
          </div>
          <p className={`mt-4 flex items-start gap-2 text-xs leading-5 ${mutedClass}`}><Shield size={15} className="mt-0.5 shrink-0 text-teal-500" />{t.membershipAccessNote}</p>
        </aside>
      </div>}

      {page === "employees" && <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className={`h-fit rounded-2xl border p-4 ${panelClass}`}>
          <div className="mb-4"><h2 className="font-bold">{t.employees}</h2><p className={`mt-1 text-xs ${mutedClass}`}>{employees.length} {t.employeesCount}</p></div>
          <div className="mb-3 flex items-center gap-2 rounded-xl border px-3"><Search size={15} className={mutedClass} /><input className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" value={employeeSearch} onChange={(e) => setEmployeeSearch(e.target.value)} placeholder={t.searchEmployeePlaceholder} /></div>
          <div className="space-y-1.5">{filteredEmployees.map((employee) => <button key={employee.id} type="button" onClick={() => chooseEmployee(employee)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start transition ${(selectedEmployeeId || selectedEmployee?.id) === employee.id ? "border-teal-500/40 bg-teal-500/10" : `border-transparent ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}`}><span className={`grid size-9 shrink-0 place-items-center rounded-xl text-xs font-bold ${toneClasses(employee.tone, isDark)}`}>{initials(employee.name)}</span><span className="min-w-0"><strong className="block truncate text-sm">{employee.name}</strong><small className={`mt-1 block text-xs ${mutedClass}`}>{employee.roleName || (isArabic ? "بدون دور" : "No role assigned")}</small></span></button>)}</div>
        </aside>
        {selectedEmployee && <div className={`min-w-0 h-fit self-start rounded-2xl border p-4 sm:p-6 ${panelClass}`}>
          <div className="mb-6 flex items-center justify-between gap-3 border-b pb-5" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}><div><h2 className="text-lg font-bold">{t.employeeData}</h2><p className={`mt-1 text-sm ${mutedClass}`}>{t.employeeDataDescription}</p></div><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${selectedEmployee.active ? (isDark ? "bg-emerald-950 text-emerald-300" : "bg-emerald-50 text-emerald-700") : "bg-rose-50 text-rose-700"}`}><i className={`size-1.5 rounded-full ${selectedEmployee.active ? "bg-emerald-500" : "bg-rose-500"}`} />{selectedEmployee.active ? t.active : t.suspended}</span></div>
          <div className={`mb-5 flex flex-wrap items-center gap-3 rounded-xl border p-3 ${softPanelClass}`}><span className={`grid size-12 place-items-center rounded-xl text-sm font-bold ${toneClasses(selectedEmployee.tone, isDark)}`}>{initials(selectedEmployee.name)}</span><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{selectedEmployee.name}</strong><small className={`mt-1 block text-xs ${mutedClass}`}>{selectedEmployee.email}</small></div><CircleUserRound size={20} className={mutedClass} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.fullName} dark={isDark}><input className={fieldClass} value={employeeFormName} onChange={(e) => setEmployeeName(e.target.value)} /></Field>
            <Field label={t.email} dark={isDark}><input dir="ltr" type="email" className={fieldClass} value={employeeFormEmail} onChange={(e) => setEmployeeEmail(e.target.value)} /></Field>
            <Field label={t.jobTitle} dark={isDark}><div className="relative"><select className={`${fieldClass} appearance-none ${isArabic ? "pl-10" : "pr-10"}`} value={employeeFormJobTitleId} onChange={(e) => setEmployeeJobTitleId(e.target.value)}><option value="">{isArabic ? "بدون مسمى وظيفي" : "No job title"}</option>{jobTitles.map((job) => <option key={job.id} value={job.id}>{job.name}</option>)}</select><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-slate-500 ${isArabic ? "left-3" : "right-3"}`}><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Field>
            <Field label={t.accountType} dark={isDark}><div className="relative"><select className={`${fieldClass} appearance-none ${isArabic ? "pl-10" : "pr-10"}`} value={employeeFormRoleId} onChange={(e) => setEmployeeRoleId(e.target.value)}><option value="">{isArabic ? "اختر الدور" : "Select role"}</option>{employeeFormRoleId && !roles.some((role) => String(role.id) === employeeFormRoleId) && <option value={employeeFormRoleId}>{selectedEmployee.roleName || (isArabic ? "الدور الحالي" : "Current role")}</option>}{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-slate-500 ${isArabic ? "left-3" : "right-3"}`}><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Field>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2"><button type="button" disabled={busy || !employeeHasChanges || !employeeFormName.trim() || !employeeFormEmail.trim()} onClick={saveEmployee} className={primaryButtonClass}><Check size={15} />{t.saveChanges}</button><button type="button" onClick={() => chooseEmployee(selectedEmployee)} className={secondaryButtonClass}>{t.cancel}</button><button type="button" disabled={busy} onClick={handleToggleUserStatus} className={`ms-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-500 transition disabled:opacity-50 ${isDark ? "hover:bg-rose-950/40" : "hover:bg-rose-50"}`}><X size={15} />{selectedEmployee.active ? t.suspendAccount : (isArabic ? "إعادة تفعيل الحساب" : "Reactivate account")}</button></div>
        </div>}
      </div>}

      {pendingRemoval && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPendingRemoval(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-member-title"
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${panelClass}`}
          >
            <div className="mb-4 flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
                <Archive size={20} />
              </span>
              <div className="min-w-0">
                <h2 id="remove-member-title" className="text-lg font-bold">
                  {isArabic ? "إزالة عضو من الفريق؟" : "Remove team member?"}
                </h2>
                <p className={`mt-2 text-sm leading-6 ${mutedClass}`}>
                  {isArabic
                    ? `هل أنت متأكد من إزالة ${pendingRemoval.employeeName} من هذا الفريق؟ لن يتم حذف حساب الموظف.`
                    : `Are you sure you want to remove ${pendingRemoval.employeeName} from this team? The employee account will not be deleted.`}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={endMembershipState.isLoading}
                onClick={() => setPendingRemoval(null)}
                className={secondaryButtonClass}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={endMembershipState.isLoading}
                onClick={async () => {
                  try {
                    await endTeamMembership({
                      teamId: pendingRemoval.teamId,
                      membershipId: pendingRemoval.membershipId,
                    }).unwrap();
                    setPendingRemoval(null);
                    toast.success(isArabic ? "تمت إزالة العضو من الفريق." : "Member removed from the team.");
                  } catch (error) {
                    handleError(error);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {endMembershipState.isLoading && <LoaderCircle size={15} className="animate-spin" />}
                {isArabic ? "إزالة العضو" : "Remove member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, children, full = false, dark }: { label: string; children: ReactNode; full?: boolean; dark: boolean }) {
  return <label className={`block min-w-0 ${full ? "sm:col-span-2" : ""}`}><span className={`mb-2 block text-sm font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{label}</span>{children}</label>;
}
function SummaryRow({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  return <div className="flex items-start justify-between gap-4 text-sm"><span className={dark ? "text-slate-400" : "text-slate-500"}>{label}</span><strong className="max-w-[65%] text-end font-semibold">{value}</strong></div>;
}
function toneClasses(tone: Tone, dark: boolean) {
  const classes: Record<Tone, string> = {
    teal: dark ? "bg-teal-950 text-teal-300" : "bg-teal-100 text-teal-800",
    blue: dark ? "bg-blue-950 text-blue-300" : "bg-blue-100 text-blue-800",
    cyan: dark ? "bg-cyan-950 text-cyan-300" : "bg-cyan-100 text-cyan-800",
    sand: dark ? "bg-amber-950 text-amber-300" : "bg-amber-100 text-amber-800",
    navy: dark ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-700",
    rose: dark ? "bg-rose-950 text-rose-300" : "bg-rose-100 text-rose-800",
  };
  return classes[tone];
}
