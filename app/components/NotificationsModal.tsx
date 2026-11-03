
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Clock,
  ArrowLeft,
  ArrowRight,
  Trash2,
  X,
} from "lucide-react";

export type NotificationItem = {
  id: string | number;
  title: string;
  text: string;
  time: string;
  tone?: "success" | "warning" | "info";
  isRead: boolean;
  resourceId?: string | number | null;
};

type NotificationsModalProps = {
  open: boolean;
  onClose: () => void;
  lang: "ar" | "en";
  darkMode: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading?: boolean;
  onMarkAsRead: (id: string | number) => Promise<void>;
  onMarkAllAsRead: () => void;
  onDelete: (id: string | number) => void;
};

export default function NotificationsModal({
  open,
  onClose,
  lang,
  darkMode,
  notifications,
  unreadCount,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationsModalProps) {
  const router = useRouter();

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const isArabic = lang === "ar";

  const translations = {
    ar: {
      title: "الإشعارات",
      unread: "إشعارات غير مقروءة",
      markAll: "تحديد الكل كمقروء",
      all: "الكل",
      unreadTab: "غير مقروء",
      emptyTitle: "أنت على اطلاع بكل شيء",
      emptyText: "لا توجد إشعارات لعرضها الآن.",
      close: "إغلاق الإشعارات",
      loading: "جاري تحميل الإشعارات...",
      delete: "حذف الإشعار",
    },
    en: {
      title: "Notifications",
      unread: "unread notifications",
      markAll: "Mark all as read",
      all: "All",
      unreadTab: "Unread",
      emptyTitle: "You're all caught up!",
      emptyText: "There are no notifications to show right now.",
      close: "Close notifications",
      loading: "Loading notifications...",
      delete: "Delete notification",
    },
  } as const;

  const t = translations[lang];

  const visibleNotifications = notifications.filter((item) =>
    filter === "unread" ? !item.isRead : true
  );

  // Close modal with Escape and prevent background scrolling.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Navigate to task details when the notification is clicked.
  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await onMarkAsRead(item.id);
      } catch (error) {
        // Keep navigation available even if the read-status request fails.
        console.error("Failed to mark notification as read:", error);
      }
    }

    if (item.resourceId) {
      onClose();
      router.push(`/tasks/${item.resourceId}`);
    } else {
      console.error("Task resourceId is missing:", item);
    }
  };


  //   const handleNotificationClick = (item: NotificationItem) => {
//     if (!item.isRead) {
//       onMarkAsRead(item.id);
//     }

//     if (item.taskId) {
//       onClose();
//       router.push(`/task/${item.taskId}`);
//     }
//   };

  const getToneClasses = (tone?: NotificationItem["tone"]) => {
    switch (tone) {
      case "success":
        return darkMode
          ? "bg-green-500/15 text-green-400"
          : "bg-green-50 text-green-600";

      case "warning":
        return darkMode
          ? "bg-amber-500/15 text-amber-400"
          : "bg-amber-50 text-amber-600";

      default:
        return darkMode
          ? "bg-[#2eb5bc]/15 text-[#55cbd0]"
          : "bg-[#e8f8f8] text-[#238e94]";
    }
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-0 z-100"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t.close}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/30 backdrop-blur-[2px]"
      />

      {/* Notifications Modal */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        className={`
          absolute
          inset-x-2 bottom-2
          flex max-h-[85dvh] w-auto flex-col
          overflow-hidden rounded-2xl border shadow-2xl
          animate-in fade-in slide-in-from-bottom-3 duration-200

          sm:inset-x-auto sm:bottom-auto sm:top-19
          sm:w-[min(23rem,calc(100vw-2rem))]
          sm:max-h-[min(590px,calc(100dvh-90px))]
          ${
            isArabic
              ? "sm:right-auto sm:left-8"
              : "sm:left-auto sm:right-8"
          }

          ${
            darkMode
              ? "border-slate-700 bg-[#20242d] text-gray-100 shadow-black/40"
              : "border-gray-200 bg-white text-gray-800 shadow-gray-900/15"
          }
        `}
      >
        {/* Header */}
        <div
          className={`
            flex shrink-0 items-center justify-between gap-3
            border-b p-4
            ${darkMode ? "border-slate-700" : "border-gray-100"}
          `}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`
                flex size-10 shrink-0 items-center justify-center rounded-xl
                ${
                  darkMode
                    ? "bg-[#2eb5bc]/15 text-[#55cbd0]"
                    : "bg-[#e8f8f8] text-[#238e94]"
                }
              `}
            >
              <Bell size={19} />
            </span>

            <div className="min-w-0">
              <h2 className="text-base font-bold">
                {t.title}
              </h2>

              <span
                className={`
                  mt-1 block text-xs
                  ${darkMode ? "text-gray-400" : "text-gray-500"}
                `}
              >
                {unreadCount} {t.unread}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0 || isLoading}
              className={`
                flex items-center gap-1.5 rounded-lg px-2 py-2
                text-[11px] font-semibold transition
                disabled:cursor-not-allowed disabled:opacity-40
                ${
                  darkMode
                    ? "text-[#55cbd0] hover:bg-[#2eb5bc]/10"
                    : "text-[#238e94] hover:bg-[#e8f8f8]"
                }
              `}
            >
              <Check size={14} />
              <span className="hidden xs:inline">
                {t.markAll}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className={`
                grid size-8 place-items-center rounded-lg transition
                ${
                  darkMode
                    ? "text-gray-400 hover:bg-slate-700 hover:text-white"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                }
              `}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`
            flex shrink-0 gap-5 border-b px-4
            ${darkMode ? "border-slate-700" : "border-gray-100"}
          `}
        >
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`
                relative flex items-center gap-2 py-3
                text-xs font-semibold transition
                ${
                  filter === tab
                    ? darkMode
                      ? "text-[#55cbd0]"
                      : "text-[#238e94]"
                    : darkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-800"
                }
              `}
            >
              {tab === "all" ? t.all : t.unreadTab}

              <span
                className={`
                  rounded-full px-1.5 py-0.5 text-[10px]
                  ${
                    darkMode
                      ? "bg-slate-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
              >
                {tab === "all"
                  ? notifications.length
                  : unreadCount}
              </span>

              {filter === tab && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#2eb5bc]" />
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 p-10">
              <span className="size-6 animate-spin rounded-full border-2 border-[#2eb5bc] border-t-transparent" />

              <p
                className={`
                  text-center text-xs
                  ${darkMode ? "text-gray-400" : "text-gray-500"}
                `}
              >
                {t.loading}
              </p>
            </div>
          ) : visibleNotifications.length > 0 ? (
            visibleNotifications.map((item) => (
              <div
                key={item.id}
                className={`
                  flex items-start gap-2 border-b p-3 transition
                  ${
                    darkMode
                      ? `border-slate-700 ${
                          item.isRead ? "" : "bg-[#2eb5bc]/5"
                        } hover:bg-slate-700/40`
                      : `border-gray-100 ${
                          item.isRead ? "bg-white" : "bg-[#f3fbfb]"
                        } hover:bg-gray-50`
                  }
                `}
              >
                {/* Notification Content */}
                <button
                  type="button"
                  onClick={() => handleNotificationClick(item)}
                  className="flex min-w-0 flex-1 items-start gap-3 text-start"
                >
                  {/* Icon */}
                  <span
                    className={`
                      flex size-10 shrink-0 items-center justify-center
                      rounded-xl
                      ${getToneClasses(item.tone)}
                    `}
                  >
                    <Bell size={17} />
                  </span>

                  {/* Text */}
                  <span className="min-w-0 flex-1">
                    <strong
                      className={`
                        block text-xs font-bold
                        ${
                          darkMode
                            ? "text-gray-100"
                            : "text-gray-800"
                        }
                      `}
                    >
                      {item.title}
                    </strong>

                    <span
                      className={`
                        mt-1 block text-xs leading-5
                        ${
                          darkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        }
                      `}
                    >
                      {item.text}
                    </span>

                    <span
                      className={`
                        mt-2 flex items-center gap-1.5 text-[10px]
                        ${
                          darkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                        }
                      `}
                    >
                      <Clock size={11} />
                      {item.time}
                    </span>
                  </span>

                  {/* Unread Indicator */}
                  {!item.isRead && (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#2eb5bc]" />
                  )}
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  title={t.delete}
                  aria-label={t.delete}
                  onClick={() => onDelete(item.id)}
                  className={`
                    grid size-8 shrink-0 place-items-center rounded-lg
                    text-slate-400 transition
                    ${
                      darkMode
                        ? "hover:bg-red-500/10 hover:text-red-400"
                        : "hover:bg-red-50 hover:text-red-500"
                    }
                  `}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
              <span
                className={`
                  mb-3 flex size-14 items-center justify-center rounded-full
                  ${
                    darkMode
                      ? "bg-slate-700 text-gray-400"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                <Bell size={23} />
              </span>

              <strong className="text-sm font-bold">
                {t.emptyTitle}
              </strong>

              <p
                className={`
                  mt-2 text-xs
                  ${darkMode ? "text-gray-400" : "text-gray-500"}
                `}
              >
                {t.emptyText}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          type="button"
          onClick={onClose}
          className={`
            flex w-full shrink-0 items-center justify-center gap-2
            border-t p-3 text-xs font-bold transition
            ${
              darkMode
                ? "border-slate-700 text-[#55cbd0] hover:bg-slate-700"
                : "border-gray-100 text-[#238e94] hover:bg-[#f3fbfb]"
            }
          `}
        >
          {t.close}

          {isArabic ? (
            <ArrowLeft size={14} />
          ) : (
            <ArrowRight size={14} />
          )}
        </button>
      </section>
    </div>
  );
}
