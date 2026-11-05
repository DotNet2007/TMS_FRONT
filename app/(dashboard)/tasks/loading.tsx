// type LoadingPageProps = {
//   lang?: "ar" | "en";
//   message?: string;
//   fullScreen?: boolean;
// };

// export default function LoadingPage({
//   lang = "ar",
//   message,
//   fullScreen = false,
// }: LoadingPageProps) {
//   const isArabic = lang === "ar";
//   const loadingMessage =
//     message ?? (isArabic ? "جاري تحميل الصفحة..." : "Loading page...");

//   return (
//     <div
//       dir={isArabic ? "rtl" : "ltr"}
//       lang={lang}
//       role="status"
//       aria-live="polite"
//       aria-label={loadingMessage}
//       className={`flex w-full items-center justify-center bg-[#f7f7f9] px-4 dark:bg-[#111827] ${
//         fullScreen ? "min-h-screen" : "min-h-[60vh]"
//       }`}
//     >
//       <div className="flex flex-col items-center gap-4 text-center">
//         <div className="relative grid size-16 place-items-center">
//           <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-[#dcebed] border-t-[#2eb5bc] dark:border-slate-700 dark:border-t-[#2eb5bc]" />
//           <div className="size-3 rounded-full bg-[#2eb5bc]" />
//         </div>

//         <div className="space-y-1">
//           <p className="text-sm font-bold text-slate-700 dark:text-slate-100">
//             {loadingMessage}
//           </p>
//           <p className="text-xs text-slate-400 dark:text-slate-500">
//             {isArabic ? "يرجى الانتظار قليلًا" : "Please wait a moment"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }




type LoadingPageProps = {
  lang?: "ar" | "en";
  message?: string;
  fullScreen?: boolean;
  isDark: boolean;
};

export default function LoadingPage({
  lang = "ar",
  message,
  fullScreen = false,
  isDark,
}: LoadingPageProps) {
  const isArabic = lang === "ar";

  const loadingMessage =
    message ?? (isArabic ? "جاري تحميل الصفحة..." : "Loading page...");

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      lang={lang}
      role="status"
      aria-live="polite"
      aria-label={loadingMessage}
      className={`flex w-full items-center justify-center px-4 ${
        isDark ? "bg-[#111827]" : "bg-[#f7f7f9]"
      } ${fullScreen ? "min-h-screen" : "min-h-[60vh]"}`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative grid size-16 place-items-center">
          <div
            className={`absolute inset-0 animate-spin rounded-full border-[5px] border-t-[#2eb5bc] ${
              isDark
                ? "border-slate-700"
                : "border-[#dcebed]"
            }`}
          />

          <div className="size-3 rounded-full bg-[#2eb5bc]" />
        </div>

        <div className="space-y-1">
          <p
            className={`text-sm font-bold ${
              isDark ? "text-slate-100" : "text-slate-700"
            }`}
          >
            {loadingMessage}
          </p>

          <p
            className={`text-xs ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {isArabic
              ? "يرجى الانتظار قليلًا"
              : "Please wait a moment"}
          </p>
        </div>
      </div>
    </div>
  );
}
