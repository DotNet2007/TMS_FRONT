import { House } from "lucide-react";

export type DashboardLang = "ar" | "en";

export type TranslationKey = "home" | "dashboard" | "analytics" | "reports" | "ai_assistant" | "operations" | "correspondence" | "events" | "memos" | "archive" | "objectives" | "meetings" | "media" | "newspapers" | "campaigns" | "invoices" | "newspaperInvoices" | "mediaInvoices" | "mediaReports" | "issuedStatements" | "tasks" | "contacts" | "governmentEntities" | "security" | "cyberSecurity" | "other" | "organization" | "dailyCalendar" | "system" | "attachments" | "userManagement" | "team" | "workspace" | "search" | "notifications" | "newItem" | "language" | "languageAria" | "logout" | "logoutAria" | "darkMode" | "lightMode" | "themeAria" | "expandSidebar" | "collapseSidebar" | "openMenu" | "closeMenu" | "account" | "accountSettings";


export interface INavigationItem {
  id: string;
  href: string;
  label: TranslationKey;
  icon: typeof House;
  allowedRoles?: string[];
  adminOnly?: boolean;
  employeeOnly?: boolean;
};

export interface INavigationGroup {
  id: string;
  label: TranslationKey;
  icon: typeof House;
  items: INavigationItem[];
};


export interface IDashboardContextValue {
  lang: DashboardLang;
  isArabic: boolean;
  darkMode: boolean;
  setLang: (lang: DashboardLang) => void;
  toggleTheme: () => void;
  t: (key: TranslationKey) => string;
};