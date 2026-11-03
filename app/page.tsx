
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

export default function HomePage() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <main
      dir="rtl"
      className="flex min-h-[calc(100vh-74px)] items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="
            h-10 w-10 animate-spin rounded-full
            border-4 border-slate-200 border-t-blue-600
          "
        />

        <p className="text-sm text-slate-500">
          {isLoading
            ? "جاري التحقق من تسجيل الدخول..."
            : "جاري تحويلك إلى الصفحة المناسبة..."}
        </p>
      </div>
    </main>
  );
}
