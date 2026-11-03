"use client";

import { useParams } from "next/navigation";
import { useGetUserByIdQuery } from "@/app/services/team-members-api";
import { useDashboardLayout } from "@/app/components/DashboardLayout";
import { UserRound, BriefcaseBusiness, ShieldCheck, CalendarDays, RefreshCw, AlertCircle, CircleCheck, CircleX } from "lucide-react";
import type { ReactNode } from "react";


interface UserDetailsProps {
  userId?: string;
}

export default function UserDetails({ userId: userIdProp }: UserDetailsProps) {
  const params = useParams<{ id?: string }>();
  const userId = userIdProp?.trim() || params?.id || "";

  const { lang, isArabic, darkMode } = useDashboardLayout();

  const isRTL = isArabic;
  const isDark = darkMode;
  const language = lang === "ar" ? "ar" : "en";

const {
    data: userResponse,
    isLoading,
    isFetching,
    isError,
    error,
    isUninitialized,
    refetch,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  const user = userResponse 

  const errorMessage = (() => {
    if (!error) return "No additional error details available.";

    if ("status" in error) {
      if (typeof error.status === "number") {
        const details =
          error.data !== undefined
            ? JSON.stringify(error.data, null, 2)
            : "";
        return [`HTTP ${error.status}`, details].filter(Boolean).join("\n");
      }

      return [
        String(error.status),
        "error" in error ? error.error : "",
      ]
        .filter(Boolean)
        .join(": ");
    }

    return error.message || JSON.stringify(error);
  })();

  const t =
    language === "ar"
      ? {
          eyebrow: "إدارة المستخدمين",
          title: "بيانات المستخدم",
          description: "عرض التفاصيل الأساسية ومعلومات الحساب.",
          back: "العودة",
          personal: "المعلومات الشخصية",
          fullName: "الاسم الكامل",
          email: "البريد الإلكتروني",
          account: "معلومات الحساب",
          status: "حالة الحساب",
          active: "نشط",
          inactive: "غير نشط",
          role: "الدور الوظيفي",
          jobTitle: "المسمى الوظيفي",
          created: "تاريخ الإنشاء",
          updated: "آخر تحديث",
          deactivated: "تاريخ إلغاء التفعيل",
          never: "لم يتم إلغاء التفعيل",
          loading: "جارٍ تحميل بيانات المستخدم...",
          error: "تعذر تحميل بيانات المستخدم.",
          retry: "إعادة المحاولة",
          refreshing: "جارٍ تحديث البيانات...",
          unknown: "غير محدد",
          memberships: "العضويات",
          membershipCount: "عدد العضويات",
          count: "عضوية",
          id: "معرّف المستخدم",
        }
      : {
          eyebrow: "User Management",
          title: "User Details",
          description: "View the user's profile and account information.",
          back: "Back",
          personal: "Personal Information",
          fullName: "Full Name",
          email: "Email Address",
          account: "Account Information",
          status: "Account Status",
          active: "Active",
          inactive: "Inactive",
          role: "Role",
          jobTitle: "Job Title",
          created: "Created At",
          updated: "Last Updated",
          deactivated: "Deactivated At",
          never: "Never deactivated",
          loading: "Loading user details...",
          error: "Unable to load user details.",
          retry: "Retry",
          refreshing: "Refreshing data...",
          unknown: "Not specified",
          memberships: "Memberships",
          membershipCount: "Membership count",
          count: "memberships",
          id: "User ID",
        };

  const pageBg = isDark ? "bg-[#111827]" : "bg-[#f7f8fc]";
  const cardBg = isDark ? "bg-[#1f2937]" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const mutedColor = isDark ? "text-gray-400" : "text-gray-500";

  const formatDate = (value: string | null) => {
    if (!value) return t.unknown;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return t.unknown;

    return new Intl.DateTimeFormat(
      language === "ar" ? "ar-EG" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(date);
  };

  const initials =
    user?.fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("") || "?";

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      lang={language}
      className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8 lg:py-10 ${pageBg} ${textColor}`}
    >
      <div className="mx-auto space-y-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-400">
              <UserRound size={16} />
              {t.eyebrow}
            </span>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t.title}
            </h1>

            <p className={`mt-2 text-sm leading-6 ${mutedColor}`}>
              {t.description}
            </p>
          </div>

          {isFetching && !isLoading && (
            <span className={`flex items-center gap-2 text-sm ${mutedColor}`}>
              <RefreshCw size={15} className="animate-spin" />
              {t.refreshing}
            </span>
          )}
        </header>

        {isLoading ? (
          <section
            className={`rounded-2xl border p-12 text-center ${cardBg} ${borderColor}`}
          >
            <RefreshCw
              size={25}
              className="mx-auto mb-4 animate-spin text-teal-500"
            />
            <p className={`text-sm ${mutedColor}`}>{t.loading}</p>
          </section>
        ) : isError || !user ? (
          <section
            className={`rounded-2xl border p-10 text-center ${cardBg} ${borderColor}`}
          >
            <AlertCircle
              size={30}
              className="mx-auto mb-4 text-red-500"
            />
            <p role="alert" className="text-sm text-red-500">
              {t.error}
            </p>

            {error && (
              <pre
                dir="ltr"
                className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap wrap-break-word rounded-lg bg-red-500/10 p-3 text-left text-xs text-red-500"
              >
                {errorMessage}
              </pre>
            )}

            <button
              type="button"
              onClick={() => {
                if (userId && !isUninitialized) {
                  void refetch();
                }
              }}
              disabled={!userId || isUninitialized || isFetching}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-500 px-5 text-sm font-semibold text-white transition hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={16} />
              {t.retry}
            </button>
          </section>
        ) : (
          <>
            <section
              className={`overflow-hidden rounded-2xl border shadow-sm ${cardBg} ${borderColor}`}
            >
              <div className="bg-linear-to-l from-teal-500/10 via-teal-500/5 to-transparent p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-2xl font-bold text-teal-600 ring-1 ring-teal-500/20 dark:text-teal-400">
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold sm:text-2xl">
                        {user.fullName}
                      </h2>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {user.isActive ? (
                          <CircleCheck size={14} />
                        ) : (
                          <CircleX size={14} />
                        )}
                        {user.isActive ? t.active : t.inactive}
                      </span>
                    </div>

                    <p
                      dir="ltr"
                      className={`mt-2 break-all text-sm ${mutedColor} ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {user.email}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-teal-500/20 bg-teal-500/5 px-3 py-2 text-xs font-medium text-teal-700 dark:text-teal-300">
                        <ShieldCheck size={15} />
                        {user.role?.name || t.unknown}
                      </span>

                      <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${borderColor} ${mutedColor}`}>
                        <BriefcaseBusiness size={15} />
                        {user.jobTitle?.name || t.unknown}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <InfoCard
                title={t.personal}
                icon={<UserRound size={19} />}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
                mutedColor={mutedColor}
              >
                <Detail
                  label={t.fullName}
                  value={user.fullName}
                  mutedColor={mutedColor}
                />
                <Detail
                  label={t.email}
                  value={user.email}
                  mutedColor={mutedColor}
                  ltr
                />
                <Detail
                  label={t.id}
                  value={user.id}
                  mutedColor={mutedColor}
                  ltr
                />
              </InfoCard>

              <InfoCard
                title={t.account}
                icon={<ShieldCheck size={19} />}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
                mutedColor={mutedColor}
              >
                <Detail
                  label={t.role}
                  value={user.role?.name || t.unknown}
                  mutedColor={mutedColor}
                />
                <Detail
                  label={t.jobTitle}
                  value={user.jobTitle?.name || t.unknown}
                  mutedColor={mutedColor}
                />
                <Detail
                  label={t.status}
                  value={user.isActive ? t.active : t.inactive}
                  mutedColor={mutedColor}
                  status={user.isActive}
                />
                <Detail
                  label={t.membershipCount}
                  value={`${user.memberships?.length ?? 0} ${t.count}`}
                  mutedColor={mutedColor}
                />
              </InfoCard>
            </div>

            <InfoCard
              title={t.memberships}
              icon={<UsersIcon />}
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              mutedColor={mutedColor}
            >
              {(user.memberships?.length ?? 0) === 0 ? (
                <p className={`py-3 text-sm ${mutedColor}`}>
                  {language === "ar"
                    ? "لا توجد عضويات مرتبطة بهذا المستخدم."
                    : "This user has no associated memberships."}
                </p>
              ) : (
                <p className="text-sm font-medium">
                  {user.memberships.length} {t.count}
                </p>
              )}
            </InfoCard>

            <InfoCard
              title={t.created}
              icon={<CalendarDays size={19} />}
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              mutedColor={mutedColor}
            >
              <Detail
                label={t.created}
                value={formatDate(user.createdAt)}
                mutedColor={mutedColor}
              />
              <Detail
                label={t.updated}
                value={formatDate(user.updatedAt)}
                mutedColor={mutedColor}
              />
              <Detail
                label={t.deactivated}
                value={
                  user.deactivatedAt
                    ? formatDate(user.deactivatedAt)
                    : t.never
                }
                mutedColor={mutedColor}
              />
            </InfoCard>
          </>
        )}
      </div>
    </main>
  );
}

function UsersIcon() {
  return <UserRound size={19} />;
}

function InfoCard({
  title,
  icon,
  cardBg,
  borderColor,
  textColor,
  children,
}: {
  title: string;
  icon: ReactNode;
  cardBg: string;
  borderColor: string;
  textColor: string;
  mutedColor: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm transition-colors sm:p-6 ${cardBg} ${borderColor}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
          {icon}
        </span>
        <h2 className={`font-bold ${textColor}`}>{title}</h2>
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Detail({
  label,
  value,
  mutedColor,
  ltr = false,
  status,
}: {
  label: string;
  value: string;
  mutedColor: string;
  ltr?: boolean;
  status?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className={`text-xs font-medium ${mutedColor}`}>{label}</dt>
      <dd
        dir={ltr ? "ltr" : undefined}
        className={`wrap-break-word text-sm font-semibold ${
          ltr ? "text-left" : ""
        } ${
          status === true
            ? "text-emerald-600 dark:text-emerald-400"
            : status === false
              ? "text-gray-500"
              : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}