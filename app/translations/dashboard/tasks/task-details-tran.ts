export type TaskDetailTranslations = {
  back: string;
  priority: string;
  updated: string;
  markDone: string;
  done: string;
  description: string;
  descriptionText: string;
  suggestion: string;
  tip: string;
  subtasks: string;
  activity: string;
  details: string;
  owner: string;
  due: string;
  status: string;
  project: string;
  attachments: string;
  addSubtask: string;
  add: string;
  cancel: string;
  completed: string;
  inProgress: string;
  today: string;
  updatedBy: string;
  completedActivity: string;
  minutes: string;
  hours: string;
  of: string;
  pageKicker: string;
  pageTitle: string;
  pageDescription: string;
  reviewModalTitle: string;
  reviewModalDescription: string;
  completionNoteLabel: string;
  completionNotePlaceholder: string;
  completionNoteRequired: string;
  reviewCancel: string;
  reviewConfirm: string;
  sending: string;
  sendSuccess: string;
  sendError: string;
};

const translations: Record<"ar" | "en", TaskDetailTranslations> = {
  ar: {
    back: "العودة إلى مهامي",
    priority: "الأولوية",
    updated: "تم التحديث منذ 12 دقيقة",
    markDone: "إرسال إلى المراجعة",
    done: "تم الإرسال للمراجعة",
    description: "وصف المهمة",
    descriptionText: "إكمال المخططات التفصيلية للصفحة الرئيسية بما يشمل قسم البداية، عرض المزايا، قصص العملاء والدعوة لاتخاذ إجراء. يجب أن تتوافق جميع الشاشات مع نظام التصميم وتجربة الاستخدام المعتمدة.",
    suggestion: "اقتراح موشنلي AI",
    tip: "ركّزي أولاً على نسخة الهاتف، فهي تمثل 68% من زيارات الموقع الحالية.",
    subtasks: "المهام الفرعية",
    activity: "النشاط",
    details: "تفاصيل المهمة",
    owner: "المسؤول",
    due: "الاستحقاق",
    status: "الحالة",
    project: "القطاع المسؤول",
    attachments: "المرفقات",
    addSubtask: "إضافة مهمة فرعية",
    add: "إضافة",
    cancel: "إلغاء",
    completed: "مكتملة",
    inProgress: "قيد التنفيذ",
    today: "اليوم",
    updatedBy: "حدّثت موعد الاستحقاق إلى",
    completedActivity: "أكمل مهمة «تطبيق ملاحظات جلسة المراجعة»",
    minutes: "منذ 12 دقيقة",
    hours: "منذ ساعتين",
    of: "من",
    pageKicker: "تفاصيل المهمة",
    pageTitle: "تفاصيل المهمة",
    pageDescription: "تابع تفاصيل المهمة وحالتها وسجل النشاط المرتبط بها.",
    reviewModalTitle: "إرسال المهمة إلى المراجعة",
    reviewModalDescription: "اكتب ملخصًا مختصرًا لما تم إنجازه قبل إرسال المهمة للمراجعة.",
    completionNoteLabel: "ملخص الإنجاز",
    completionNotePlaceholder: "اكتب ما تم إنجازه...",
    completionNoteRequired: "يرجى كتابة ملخص الإنجاز.",
    reviewCancel: "إلغاء",
    reviewConfirm: "إرسال للمراجعة",
    sending: "جارٍ الإرسال...",
    sendSuccess: "تم إرسال المهمة إلى المراجعة بنجاح.",
    sendError: "تعذر إرسال المهمة للمراجعة. حاول مرة أخرى.",
  },
  en: {
    back: "Back to My Tasks",
    priority: "Priority",
    updated: "Updated 12 minutes ago",
    markDone: "Send for review",
    done: "Sent for review",
    description: "Task description",
    descriptionText: "Complete the detailed homepage wireframes, including the hero section, feature showcase, customer stories, and call to action. All screens should follow the approved design system and user experience.",
    suggestion: "Motionly AI suggestion",
    tip: "Start with the mobile version, which accounts for 68% of current website visits.",
    subtasks: "Subtasks",
    activity: "Activity",
    details: "Task details",
    owner: "Assignee",
    due: "Due date",
    status: "Status",
    project: "Responsible Department",
    attachments: "Attachments",
    addSubtask: "Add subtask",
    add: "Add",
    cancel: "Cancel",
    completed: "Completed",
    inProgress: "In progress",
    today: "Today",
    updatedBy: "Updated the due date to",
    completedActivity: "Completed “Apply feedback from the last review”",
    minutes: "12 minutes ago",
    hours: "2 hours ago",
    of: "of",
    pageKicker: "TASK DETAILS",
    pageTitle: "Task details",
    pageDescription: "Review task information, status, and its activity history.",
    reviewModalTitle: "Send task for review",
    reviewModalDescription: "Briefly describe the work completed before sending this task for review.",
    completionNoteLabel: "Completion note",
    completionNotePlaceholder: "Describe the work completed...",
    completionNoteRequired: "Please enter a completion note.",
    reviewCancel: "Cancel",
    reviewConfirm: "Send for review",
    sending: "Sending...",
    sendSuccess: "Task sent for review successfully.",
    sendError: "Could not send the task for review. Please try again.",
  },
};

export function getTaskDetailTranslations(isArabic: boolean): TaskDetailTranslations {
  return translations[isArabic ? "ar" : "en"];
}
