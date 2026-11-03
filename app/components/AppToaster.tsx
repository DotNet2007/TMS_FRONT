"use client";

import { Toaster } from "sonner";
import { useDashboardLayout } from "@/app/components/DashboardLayout";

export default function AppToaster() {
  const { isArabic, darkMode } = useDashboardLayout();

  return (
    <Toaster
      position={isArabic ? "top-left" : "top-right"}
      dir={isArabic ? "rtl" : "ltr"}
      theme={darkMode ? "dark" : "light"}
      richColors
      closeButton
      duration={2500}
      offset={16}
      gap={8}
      toastOptions={{
        classNames: {
          toast: `
            !rounded-xl
            !border
            !shadow-md
            !backdrop-blur-sm
            !transition-all
            !duration-300
            ${darkMode
              ? "!border-white/10 !bg-slate-900/95 !text-slate-100"
              : "!border-slate-200/80 !bg-white/95 !text-slate-800"}
          `,
          title: "!text-sm !font-medium",
          description: "!text-xs !opacity-75",
          closeButton: "!rounded-lg",
        },
      }}
    />
  );
}