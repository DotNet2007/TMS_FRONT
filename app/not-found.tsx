"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Home, SearchX } from "lucide-react";
import { useDashboardLayout } from "@/app/components/DashboardLayout";

export default function NotFound() {
  const router = useRouter();
  const { lang, isArabic, darkMode } = useDashboardLayout();

  const isRTL = isArabic || lang === "ar";
  const isDark = darkMode;

  const copy =
    lang === "ar"
    ? {
        eyebrow: "404 — الصفحة غير موجودة",
        title: "عذرًا، الصفحة غير موجودة",
        description:
            "قد تكون الصفحة قد نُقلت أو أن الرابط غير صحيح. يُرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.",
        home: "الصفحة الرئيسية",
        back: "العودة",
        hint: "إذا كنت تعتقد أن هذا خطأ، يُرجى التحقق من الرابط والمحاولة مرة أخرى.",
        }
      : {
          eyebrow: "404 — PAGE NOT FOUND",
          title: "Page not found",
          description:
            "This page may have moved, or the link may be incorrect. Check the URL or return home.",
          home: "Go home",
          back: "Go back",
          hint: "If you think this is a mistake, check the URL and try again.",
        };

  const pageBackground = isDark ? "bg-[#111827]" : "bg-[#f7f8fc]";
  const cardBackground = isDark ? "bg-[#1f2937]" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const headingColor = isDark ? "text-gray-100" : "text-gray-900";
  const mutedColor = isDark ? "text-gray-400" : "text-gray-500";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      lang={lang === "ar" ? "ar" : "en"}
      className={`flex min-h-[70vh] items-center justify-center px-4 py-8 transition-colors duration-300 sm:px-6 ${pageBackground} ${headingColor}`}
    >
      <section
        aria-labelledby="not-found-title"
        className={`w-full max-w-xl overflow-hidden rounded-2xl border shadow-sm ${cardBackground} ${borderColor}`}
      >
        <div className="h-1 w-full bg-[#238e94]" />

        <div className="px-5 py-8 text-center sm:px-8 sm:py-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#238e94]/10 text-[#238e94]">
            <SearchX size={28} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-[#238e94] sm:text-xs">
            {copy.eyebrow}
          </p>

          <h1
            id="not-found-title"
            className="text-xl font-bold tracking-tight sm:text-2xl"
          >
            {copy.title}
          </h1>

          <p className={`mx-auto mt-3 max-w-md text-xs leading-6 sm:text-sm sm:leading-7 ${mutedColor}`}>
            {copy.description}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#238e94] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1d777c] focus:outline-none focus:ring-4 focus:ring-[#238e94]/25 sm:text-sm"
            >
              <Home size={15} aria-hidden="true" />
              {copy.home}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#238e94]/20 sm:text-sm ${borderColor} ${mutedColor} ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
            >
              <BackIcon size={15} aria-hidden="true" />
              {copy.back}
            </button>
          </div>

          <p className={`mt-5 text-[11px] leading-5 ${mutedColor}`}>{copy.hint}</p>
        </div>
      </section>
    </main>
  );
}
