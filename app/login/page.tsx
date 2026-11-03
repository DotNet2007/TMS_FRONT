"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth, User } from "../context/AuthContext";


type IconName =
  | "check"
  | "spark"
  | "arrow"
  | "sun"
  | "moon"
  | "globe";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    check: <path d="m5 12 4 4L19 6" />,
    spark: <path d="m12 3-1.2 4.1a5.4 5.4 0 0 1-3.7 3.7L3 12l4.1 1.2a5.4 5.4 0 0 1 3.7 3.7L12 21l1.2-4.1a5.4 5.4 0 0 1 3.7-3.7L21 12l-4.1-1.2a5.4 5.4 0 0 1-3.7-3.7Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  className = "",
  onClick,
  ariaLabel,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} aria-label={ariaLabel} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

const translations = {
  ar: {
    welcome: "مرحباً بعودتك",
    title: "سجّل الدخول إلى حسابك",
    description: "أدر مشاريعك وفريقك بذكاء من مكان واحد.",
    email: "البريد الإلكتروني",
    emailPlaceholder: "name@company.com",
    password: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور",
    show: "إظهار",
    hide: "إخفاء",
    remember: "تذكرني",
    forgot: "نسيت كلمة المرور؟",
    login: "تسجيل الدخول",
    or: "أو المتابعة باستخدام",
    google: "Google",
    noAccount: "ليس لديك حساب؟",
    create: "أنشئ حساباً مجاناً",
    copyright: "© NTRA 2026. جميع الحقوق محفوظة.",
    ai: "مدعوم بالذكاء الاصطناعي",
    heroTitle: <>حوّل أفكارك إلى<br />إنجازات حقيقية</>,
    heroDescription: "خطط بذكاء، تعاون بسهولة، وأنجز مشاريعك في وقت أقل.",
    language: "English",
    theme: "تغيير المظهر",
    ntraAlt: "شعار الجهاز القومي لتنظيم الاتصالات NTRA",
    loginError: "تعذر تسجيل الدخول. حاول مرة أخرى.",
  },
  en: {
    welcome: "Welcome back",
    title: "Sign in to your account",
    description: "Manage your projects and team intelligently from one place.",
    email: "Email address",
    emailPlaceholder: "name@company.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    show: "Show",
    hide: "Hide",
    remember: "Remember me",
    forgot: "Forgot password?",
    login: "Sign in",
    or: "Or continue with",
    google: "Google",
    noAccount: "Don't have an account?",
    create: "Create a free account",
    copyright: "© NTRA 2026. All rights reserved.",
    ai: "AI-powered",
    heroTitle: <>Turn your ideas into<br />real achievements</>,
    heroDescription: "Plan smarter, collaborate easily, and finish projects in less time.",
    language: "العربية",
    theme: "Toggle theme",
    ntraAlt: "National Telecom Regulatory Authority (NTRA) logo",
    loginError: "Unable to sign in. Please try again.",
  },
} as const;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const isArabic = language === "ar";
  const t = translations[language];

  const fieldLabelClass = `mb-2 block text-xs font-semibold ${darkMode ? "text-slate-200" : "text-[#4f5056]"}`;
  const inputClass = `h-11.5 w-full rounded-[10px] border px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2eb5bc] focus:ring-2 focus:ring-[#2eb5bc]/20 ${
    darkMode
      ? "border-slate-600 bg-slate-900 text-white"
      : "border-[#dedfe4] bg-white text-[#202126]"
  }`;
  const secondaryText = darkMode ? "text-slate-400" : "text-[#92939a]";
  const panelClass = darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-[#202126]";

    useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api").replace(/\/$/, "");
      const loginEndpoint = process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT ?? "/auth/login";

      const response = await axios.post<{
        accessToken: string;
        tokenType?: string;
        user: User & { fullName?: string; name?: string };
      }>(`${apiUrl}${loginEndpoint}`, {
        email: email.trim(),
        password,
      });

      const { accessToken, user: apiUser } = response.data;

      if (!accessToken || !apiUser) {
        throw new Error("The login response did not include accessToken and user.");
      }

      // Context 2 reads the token from localStorage under this exact key.
      // Its current implementation always persists the token between browser sessions.
      localStorage.setItem("userToken", accessToken);

      // Keep JWT claims while using the backend's user object as the primary profile.
      const decoded = jwtDecode<User>(accessToken);
      const authenticatedUser: User = {
        ...decoded,
        ...apiUser,
        fullName: apiUser.fullName ?? apiUser.name ?? decoded.name,
      };

      login(authenticatedUser);
      router.replace("/dashboard");
    } catch (error) {
        const responseData = axios.isAxiosError(error)
          ? error.response?.data
          : null;

        const apiMessage =
          responseData &&
          typeof responseData === "object" &&
          "message" in responseData &&
          typeof responseData.message === "string"
            ? responseData.message
            : responseData &&
                typeof responseData === "object" &&
                "error" in responseData &&
                typeof responseData.error === "string"
              ? responseData.error
              : null;

        const rawMessage =
          apiMessage ??
          (error instanceof Error ? error.message : t.loginError);

        const normalizedMessage = rawMessage.toLowerCase();

        const invalidCredentials =
          normalizedMessage.includes("invalid email or password") ||
          normalizedMessage.includes("invalid credentials") ||
          normalizedMessage.includes("incorrect password") ||
          normalizedMessage.includes("user not found");

        if (invalidCredentials) {
          setFormError(
            language === "ar"
              ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
              : "Invalid email or password"
          );
        } else if (axios.isAxiosError(error) && !error.response) {
          setFormError(
            language === "ar"
              ? "تعذّر الاتصال بالخادم. تأكد من اتصال الشبكة وحاول مرة أخرى."
              : "Unable to connect to the server. Check your connection and try again."
          );
        } else {
          setFormError(
            language === "ar"
              ? "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى."
              : "An error occurred while signing in. Please try again."
          );
        }
      } finally {
        setIsSubmitting(false);
      }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      className={`grid min-h-screen grid-cols-[minmax(430px,44%)_1fr] font-[Tajawal,sans-serif] transition-colors max-[980px]:grid-cols-[minmax(400px,52%)_1fr] max-[760px]:block ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-[#202126]"
      }`}
    >
      <section className={`relative flex min-h-screen flex-col px-[clamp(28px,5vw,76px)] pb-5 pt-7 max-[760px]:min-h-screen max-[760px]:px-6 ${panelClass}`}>
        {/* Login page controls are independent of DashboardLayout because users may not be authenticated yet. */}
        <div className={`absolute left-5 right-5 top-5 z-10 flex items-center gap-2 ${isArabic ? "justify-start" : "justify-end"}`}>
          <Button
            ariaLabel={t.language}
            onClick={() => setLanguage(isArabic ? "en" : "ar")}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
              darkMode ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Icon name="globe" size={15} />
            {t.language}
          </Button>
          <Button
            ariaLabel={t.theme}
            onClick={() => setDarkMode((current) => !current)}
            className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
              darkMode ? "border-slate-700 bg-slate-900 text-amber-300 hover:bg-slate-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Icon name={darkMode ? "sun" : "moon"} size={16} />
          </Button>
        </div>

        <div className="mt-12 flex items-center gap-3">
          {/* Put the official NTRA logo file at public/ntra-logo.png. */}

            <Link
                href="/"
                aria-label="NTRA Home"
                className="flex w-full items-center justify-center px-2"
            >
                <Image
                src={darkMode ? "/ntra-white.png" : "/ntra-black.png"}
                alt="NTRA - National Telecom Regulatory Authority"
                width={808}
                height={332}
                priority
                className="h-auto w-full max-w-55 object-contain"
                />
          </Link>

        </div>

        <form
          className="my-auto w-full max-w-97.5 self-center py-9 max-[760px]:py-11"
          onSubmit={handleSubmit}
        >
          <div className="mb-7">
            <span className="mb-2 inline-flex text-[11px] font-bold text-[#2eb5bc]">{t.welcome}</span>
            <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{t.title}</h1>
            <p className={`mt-2 text-sm leading-6 ${secondaryText}`}>{t.description}</p>
          </div>

          <label className="mb-4 block">
            <span className={fieldLabelClass}>{t.email}</span>
            <input
              className={inputClass} type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)}
              placeholder={t.emailPlaceholder}
            />
          </label>

          <label className="mb-4 block">
            <span className={fieldLabelClass}>{t.password}</span>
            <div className={`flex h-11.5 w-full items-center rounded-[10px] border pe-1.5 transition focus-within:border-[#2eb5bc] focus-within:ring-2 focus-within:ring-[#2eb5bc]/20 ${
              darkMode ? "border-slate-600 bg-slate-900" : "border-[#dedfe4] bg-white"
            }`}>
              <input
               className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t.passwordPlaceholder}
              />
              <Button
                onClick={() => setShowPassword((current) => !current)}
                className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${
                  darkMode ? "bg-teal-500/15 text-teal-300" : "bg-[#eff9fa] text-[#258d93]"
                }`}
              >
                {showPassword ? t.hide : t.show}
              </Button>
            </div>
          </label>

          <div className="mb-5 mt-1 flex items-center justify-between gap-3">
            <Button
              onClick={() => setRemember((current) => !current)}
              className={`flex items-center gap-2 text-[11px] ${darkMode ? "text-slate-300" : "text-[#686970]"}`}
            >
              <span className={`grid h-4 w-4 place-items-center rounded-[5px] border-[1.5px] ${
                remember ? "border-[#2eb5bc] bg-[#2eb5bc] text-white" : darkMode ? "border-slate-500" : "border-[#cacbd1]"
              }`}>
                {remember && <Icon name="check" size={12} />}
              </span>
              {t.remember}
            </Button>
            <Button className="text-[11px] font-semibold text-[#47759c] hover:underline">
              {t.forgot}
            </Button>
          </div>


          {formError && <p role="alert" className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-500">{formError}</p>}

            <Button type="submit" disabled={isSubmitting || authLoading} className="flex h-11.5 w-full items-center justify-center gap-2 rounded-[10px] border-0 bg-[#2eb5bc] text-[13px] font-bold text-white shadow-[0_8px_18px_#2eb5bc2b] transition hover:-translate-y-px hover:shadow-[0_11px_22px_#2eb5bc38]">
                {isSubmitting ? (isArabic ? "جارٍ تسجيل الدخول..." : "Signing in...") : t.login}
                <Icon name="arrow" size={17} />
          </Button>

        </form>

        <p className={`m-0 text-center text-[9px] ${secondaryText}`}>{t.copyright}</p>
      </section>

      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[linear-gradient(145deg,#345f82_0%,#47759c_52%,#2eb5bc_145%)] p-[clamp(36px,5vw,76px)] text-white max-[980px]:px-7 max-[980px]:py-11 max-[760px]:hidden">
        <div className="pointer-events-none absolute -left-24 -top-44 h-102.5 w-102.5 rounded-full border border-white/10 shadow-[inset_0_0_90px_#2eb5bc38] blur-[5px]" />
        <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-[#2eb5bc22] blur-3xl" />

        <div className="relative z-10 max-w-137.5">
          <span className="mb-5 inline-flex items-center gap-2 rounded-[20px] border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-semibold text-[#d9ffff]">
            <Icon name="spark" size={14} />
            {t.ai}
          </span>
          <h2 className="text-4xl font-bold leading-tight">{t.heroTitle}</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/80">{t.heroDescription}</p>
        </div>

        <div
          className={`relative z-10 mt-9 h-71.25 w-[min(570px,100%)] overflow-hidden rounded-2xl border shadow-[0_35px_60px_#16384c59] transition-colors duration-300 ${
            darkMode
              ? "border-slate-600 bg-slate-900"
              : "border-white/20 bg-[#f8f8fa]"
          }`}
        >
          <div className={`flex h-7 items-center gap-1.5 border-b px-3 transition-colors duration-300 ${
            darkMode ? "border-slate-700 bg-slate-800" : "border-[#ededf0] bg-white"
          }`}>
            <span className="h-2 w-2 rounded-full bg-[#e99086]" />
            <span className="h-2 w-2 rounded-full bg-[#f3c66b]" />
            <span className="h-2 w-2 rounded-full bg-[#2eb5bc]" />
          </div>

          <div className={`grid h-[calc(100%-28px)] grid-cols-[52px_1fr] transition-colors duration-300 ${
            darkMode ? "bg-slate-900" : "bg-[#f8f8fa]"
          }`}>
            <div className={`flex flex-col items-center gap-4 border-l pt-4 transition-colors duration-300 ${
              darkMode ? "border-slate-700 bg-slate-800" : "border-[#ebebef] bg-white"
            }`}>
              <span className="mb-2 grid h-5 w-5 place-items-center rounded-md bg-[#2eb5bc] text-white">
                <Icon name="spark" size={11} />
              </span>
              <i className="h-4 w-4 rounded bg-[#2eb5bc]/20" />
              <i className={`h-4 w-4 rounded ${darkMode ? "bg-slate-600" : "bg-[#eeeeF2]"}`} />
              <i className={`h-4 w-4 rounded ${darkMode ? "bg-slate-600" : "bg-[#eeeeF2]"}`} />
              <i className={`h-4 w-4 rounded ${darkMode ? "bg-slate-600" : "bg-[#eeeeF2]"}`} />
            </div>

            <div className="p-5">
              <div className={`h-2.5 w-24 rounded ${darkMode ? "bg-slate-600" : "bg-[#dedfe4]"}`} />
              <div className={`mt-2 h-1.5 w-36 rounded ${darkMode ? "bg-slate-700" : "bg-[#e9e9ed]"}`} />

              <div className="mt-4 flex h-16 items-center gap-3 rounded-lg bg-[linear-gradient(110deg,#47759c,#2eb5bc)] p-3">
                <span className="text-white"><Icon name="spark" size={14} /></span>
                <div className="space-y-2">
                  <i className="block h-2 w-24 rounded bg-white/80" />
                  <i className="block h-1.5 w-16 rounded bg-white/50" />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className={`h-12 rounded-lg border p-2 ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e9e9ed] bg-white"}`}>
                  <i className="block h-2 w-7 rounded bg-[#d9f3f3]" />
                  <i className={`mt-2 block h-2 w-10 rounded ${darkMode ? "bg-slate-600" : "bg-[#e9e9ed]"}`} />
                </div>
                <div className={`h-12 rounded-lg border p-2 ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e9e9ed] bg-white"}`}>
                  <i className="block h-2 w-7 rounded bg-[#dce8f2]" />
                  <i className={`mt-2 block h-2 w-10 rounded ${darkMode ? "bg-slate-600" : "bg-[#e9e9ed]"}`} />
                </div>
                <div className={`h-12 rounded-lg border p-2 ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e9e9ed] bg-white"}`}>
                  <i className="block h-2 w-7 rounded bg-[#f7e9c9]" />
                  <i className={`mt-2 block h-2 w-10 rounded ${darkMode ? "bg-slate-600" : "bg-[#e9e9ed]"}`} />
                </div>
              </div>

              <div className={`mt-2 h-7 rounded-md border ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e9e9ed] bg-white"}`} />
              <div className={`mt-2 h-7 rounded-md border ${darkMode ? "border-slate-700 bg-slate-800" : "border-[#e9e9ed] bg-white"}`} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
