// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { FormEvent, KeyboardEvent, useMemo, useState, useEffect } from "react";
// import {
//   Bot,
//   CalendarDays,
//   ChartNoAxesColumnIncreasing,
//   CheckCheck,
//   Ellipsis,
//   LoaderCircle,
//   MessageCircle,
//   Plus,
//   Pencil,
//   Send,
//   Sparkles,
//   Trash2,
//   X,
// } from "lucide-react";
// import {getConversations,getConversationMessages,createConversation,renameConversation,deleteConversation,sendChatMessage,} from "@/app/services/chatbotApi";
// import { useDashboardLayout } from "@/app/components/DashboardLayout";

// type ChatRole = "assistant" | "user";
// type ChatMessage = { role: ChatRole; text: string; id: string };
// type ChatThread = { id: string; title: string; time: string; group: "today" | "week" };

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const welcomeMessage = (isArabic: boolean) =>
//   isArabic
//     ? "مرحباً! أنا مساعد NTRA الذكي. يمكنني مساعدتك في تنظيم مهامك، وتلخيص تقدم المشاريع، أو تخطيط يومك. كيف يمكنني مساعدتك اليوم؟"
//     : "Hi! I’m your NTRA AI assistant. I can help organize your tasks, summarize project progress, or plan your day. How can I help you today?";

// export default function AiChatPage() {
//   const { isArabic, darkMode } = useDashboardLayout();
//   const [draft, setDraft] = useState("");
//   const [activeThread, setActiveThread] = useState("");
//   const [threads, setThreads] = useState<ChatThread[]>([]);
//   const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>({});
//   const [historyLoading, setHistoryLoading] = useState(true);
//   const [messagesLoading, setMessagesLoading] = useState(false);
//   const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
//   const [showOptions, setShowOptions] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [conversationIds, setConversationIds] = useState<Record<string, string>>({});
//   const currentMessages = messagesByThread[activeThread] ?? [];
//   const t = useMemo(
//     () =>
//       isArabic
//         ? {
//             kicker: "مدعوم بالذكاء الاصطناعي", title: "مساعد NTRA", description: "اسأل عن مهامك ومشاريعك، أو اطلب المساعدة في تخطيط يومك.", online: "متصل الآن", newChat: "محادثة جديدة", today: "اليوم", thisWeek: "هذا الأسبوع", tip: "نصيحة سريعة", tipText: "اطلب من المساعد إنشاء مهام قابلة للتنفيذ من أي فكرة.", assistant: "مساعد NTRA", subtitle: "مساعدك الذكي للعمل والإنتاجية", date: "اليوم", you: "أنت", placeholder: "اكتب رسالتك هنا...", disclaimer: "قد يقدّم الذكاء الاصطناعي معلومات غير دقيقة.", send: "إرسال", priorities: "رتّب أولوياتي اليوم", progress: "لخّص تقدم مشاريعي", weekPlan: "خطط أسبوعي", search: "ابحث في المحادثات...", empty: "ابدأ محادثة جديدة واسألني أي شيء.", newTitle: "محادثة جديدة", close: "إغلاق سجل المحادثات", options: "خيارات المحادثة", deleteChat: "حذف المحادثة", renameChat: "إعادة تسمية ", renamePrompt: "اكتب الاسم الجديد للمحادثة:", renameFailed: "تعذر تغيير اسم المحادثة. حاول مرة أخرى.", confirmDelete: "هل أنت متأكد من حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.", deleteFailed: "تعذر حذف المحادثة. حاول مرة أخرى.", demo: "تحقق من المعلومات المهمة قبل الاعتماد عليها.",
//           }
//         : {
//             kicker: "AI POWERED", title: "NTRA Assistant", description: "Ask about tasks and projects, or get help planning your day.", online: "Online now", newChat: "New chat", today: "Today", thisWeek: "This week", tip: "Quick tip", tipText: "Ask the assistant to turn any idea into actionable tasks.", assistant: "NTRA Assistant", subtitle: "Your intelligent work & productivity assistant", date: "Today", you: "You", placeholder: "Write your message...", disclaimer: "AI can make mistakes. Check important information.", send: "Send", priorities: "Help prioritize my day", progress: "Summarize project progress", weekPlan: "Plan my week", search: "Search conversations...", empty: "Start a new conversation and ask me anything.", newTitle: "New conversation", close: "Close chat history", options: "Conversation options", deleteChat: "Delete chat", renameChat: "Rename chat", renamePrompt: "Enter a new chat name:", renameFailed: "Could not rename the chat. Please try again.", confirmDelete: "Are you sure you want to delete this chat? This action cannot be undone.", deleteFailed: "Could not delete the chat. Please try again.", demo: "Check important information before relying on it.",
//           },
//     [isArabic],
//   );

//   const createNewChat = async () => {
//     try {
//       const created: any = await createConversation(t.newTitle);
//       const id = String(created?.conversation_id ?? created?.id ?? "");
//       if (!id) throw new Error("Create conversation response did not include an id");

//       const thread: ChatThread = {
//         id,
//         title: created?.title ?? t.newTitle,
//         time: isArabic ? "الآن" : "Just now",
//         group: "today",
//       };
//       setThreads((current) => [thread, ...current.filter((item) => item.id !== id)]);
//       setConversationIds((current) => ({ ...current, [id]: id }));
//       setMessagesByThread((current) => ({ ...current, [id]: [] }));
//       setActiveThread(id);
//       setDraft("");
//       setMobileHistoryOpen(false);
//     } catch (error) {
//       console.error("Failed to create conversation:", error);
//       window.alert(isArabic ? "تعذر إنشاء محادثة جديدة. راجع اتصال الـ API." : "Could not create a conversation. Check the API connection.");
//     }
//   };


// const renameActiveChat = async () => {
//   if (!activeThread) return;

//   const currentThread = threads.find((thread) => thread.id === activeThread);
//   if (!currentThread) return;

//   const nextTitle = window.prompt(t.renamePrompt, currentThread.title)?.trim();
//   if (!nextTitle || nextTitle === currentThread.title) return;

//   try {
//     await renameConversation(activeThread, nextTitle);
//     setThreads((current) =>
//       current.map((thread) =>
//         thread.id === activeThread ? { ...thread, title: nextTitle } : thread
//       )
//     );
//     setShowOptions(false);
//   } catch (error) {
//     console.error("Failed to rename conversation:", error);
//     window.alert(t.renameFailed);
//   }
// };

// const deleteActiveChat = async () => {
//   if (!activeThread) return;

//   const confirmed = window.confirm(t.confirmDelete);
//   if (!confirmed) return;

//   const deletingId = activeThread;
//   try {
//     await deleteConversation(deletingId);

//     const remainingThreads = threads.filter((thread) => thread.id !== deletingId);
//     setThreads(remainingThreads);
//     setMessagesByThread((current) => {
//       const next = { ...current };
//       delete next[deletingId];
//       return next;
//     });
//     setConversationIds((current) => {
//       const next = { ...current };
//       delete next[deletingId];
//       return next;
//     });
//     setActiveThread(remainingThreads[0]?.id ?? "");
//     setShowOptions(false);
//   } catch (error) {
//     console.error("Failed to delete conversation:", error);
//     window.alert(t.deleteFailed);
//   }
// };

// const sendMessage = async (text = draft) => {
//   const value = text.trim();

//   if (!value || loading) return;

//   let threadId = activeThread;
//   if (!threadId) {
//     try {
//       const created: any = await createConversation(t.newTitle);
//       threadId = String(created?.conversation_id ?? created?.id ?? "");
//       if (!threadId) throw new Error("Create conversation response did not include an id");
//       setThreads((current) => [{ id: threadId, title: t.newTitle, time: isArabic ? "الآن" : "Just now", group: "today" }, ...current]);
//       setConversationIds((current) => ({ ...current, [threadId]: threadId }));
//       setActiveThread(threadId);
//       setMessagesByThread((current) => ({ ...current, [threadId]: [] }));
//     } catch (error) {
//       console.error("Failed to create conversation before sending:", error);
//       setLoading(false);
//       return;
//     }
//   }

//   const userMessage: ChatMessage = {
//     id: `${Date.now()}-user`,
//     role: "user",
//     text: value,
//   };

//   setMessagesByThread((current) => ({
//     ...current,
//     [threadId]: [
//       ...(current[threadId] ?? []),
//       userMessage,
//     ],
//   }));

//   setDraft("");
//   setLoading(true);

//   try {
//     const result = await sendChatMessage({
//       message: value,
//       conversation_id: conversationIds[threadId] ?? threadId,
//     });

//     if (!result.reply?.trim()) {
//       throw new Error("The chatbot returned an empty reply");
//     }

//     if (result.conversation_id) {
//       setConversationIds((current) => ({
//         ...current,
//         [threadId]: result.conversation_id,
//       }));
//     }

//     setMessagesByThread((current) => ({
//       ...current,
//       [threadId]: [
//         ...(current[threadId] ?? []),
//         {
//           id: `${Date.now()}-assistant`,
//           role: "assistant",
//           text: result.reply,
//         },
//       ],
//     }));

//     setThreads((current) =>
//       current.map((thread) =>
//         thread.id === threadId
//           ? {
//               ...thread,
//               title:
//                 thread.title === t.newTitle ||
//                 thread.id === "today-plan"
//                   ? value.length > 28
//                     ? `${value.slice(0, 28)}…`
//                     : value
//                   : thread.title,
//               time: isArabic ? "الآن" : "Just now",
//             }
//           : thread
//       )
//     );
//   } catch (error) {
//     console.error("Chatbot API error:", error);

//     setMessagesByThread((current) => ({
//       ...current,
//       [threadId]: [
//         ...(current[threadId] ?? []),
//         {
//           id: `${Date.now()}-error`,
//           role: "assistant",
//           text: isArabic
//             ? "تعذر الاتصال بالمساعد الذكي. تأكد من تشغيل الخادم وإعدادات الاتصال."
//             : "Unable to connect to the AI assistant. Check the server and connection settings.",
//         },
//       ],
//     }));
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   let cancelled = false;

//   async function loadHistory() {
//     setHistoryLoading(true);

//     try {
//       const response: any = await getConversations();
//       const conversations = Array.isArray(response) ? response : (response?.conversations ?? []);

//       if (cancelled) return;

//       const normalizedConversations = conversations
   
//         .map((conversation: any) => ({
//           id: String(conversation.id ?? conversation.conversation_id ?? ""),
//           title: conversation.title ?? (isArabic ? "محادثة جديدة" : "New conversation"),
//           time: conversation.updated_at
//             ? new Date(conversation.updated_at).toLocaleString(isArabic ? "ar-EG" : "en-US")
//             : (isArabic ? "الآن" : "Just now"),
//           group: "today" as const,
//         }))
//         .filter((conversation: ChatThread) => conversation.id.length > 0);

//       setThreads(normalizedConversations);

//       if (normalizedConversations.length > 0) {
//         setActiveThread((current) =>
//           normalizedConversations.some((item: ChatThread) => item.id === current)
//             ? current
//             : normalizedConversations[0].id
//         );
//       } else {
//         setActiveThread("");
//       }
//     } catch (error) {
//       console.error("Failed to load chat history:", error);
//     } finally {
//       if (!cancelled) setHistoryLoading(false);
//     }
//   }

//   void loadHistory();

//   return () => {
//     cancelled = true;
//   };
// }, [isArabic]);

// useEffect(() => {
//   if (!activeThread) return;
//   if (Object.prototype.hasOwnProperty.call(messagesByThread, activeThread)) return;

//   let cancelled = false;
//   async function loadMessages() {
//     setMessagesLoading(true);
//     try {
//       const response: any = await getConversationMessages(activeThread);
//       const rows = Array.isArray(response) ? response : (response?.messages ?? []);
//       const mapped: ChatMessage[] = rows.map((message: any, index: number) => ({
//         id: String(message.id ?? `${activeThread}-${index}`),
//         role: message.role === "user" ? "user" : "assistant",
//         text: String(message.content ?? message.text ?? ""),
//       })).filter((message: ChatMessage) => message.text.trim().length > 0);
//       if (!cancelled) {
//         setMessagesByThread((current) => ({ ...current, [activeThread]: mapped }));
//         setConversationIds((current) => ({ ...current, [activeThread]: activeThread }));
//       }
//     } catch (error) {
//       console.error("Failed to load conversation messages:", error);
//       if (!cancelled) setMessagesByThread((current) => ({ ...current, [activeThread]: [] }));
//     } finally {
//       if (!cancelled) setMessagesLoading(false);
//     }
//   }
//   void loadMessages();
//   return () => { cancelled = true; };
// }, [activeThread, messagesByThread]);

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     sendMessage();
//   };
//   const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       sendMessage();
//     }
//   };

//   const threadButton = (thread: ChatThread) => (
//     <button
//       key={thread.id}
//       type="button"
//       onClick={() => { setActiveThread(thread.id); setMobileHistoryOpen(false); }}
//       className={`group flex w-full min-w-0 items-start gap-3 rounded-xl px-3 py-3 text-start transition ${activeThread === thread.id ? (darkMode ? "bg-teal-400/10 text-teal-200 ring-1 ring-teal-400/20" : "bg-teal-50 text-teal-800 ring-1 ring-teal-100") : (darkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100")}`}
//     >
//       <MessageCircle size={17} className="mt-0.5 shrink-0 opacity-80" />
//       <span className="min-w-0 flex-1">
//         <span className="block truncate text-sm font-medium">{thread.title}</span>
//         <span className={`mt-1 block text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{thread.time}</span>
//       </span>
//     </button>
//   );

//   return (
//     <main dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"} className={`min-h-[calc(100vh-2rem)] transition-colors duration-200 ${darkMode ? "bg-transparent text-slate-100" : "bg-slate-50 text-slate-900"}`}>
//       <div className="flex w-full max-w-380 flex-col gap-6 p-3 sm:p-5 lg:p-7">
//         <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div className="min-w-0">
//             <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-teal-500  sm:text-sm"><Sparkles size={15} />{t.kicker}</span>
//             <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h1>
//             <p className={`mt-2 max-w-2xl text-sm leading-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{t.description}</p>
//           </div>
//         </header>

//         <div className="grid min-h-155 grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:min-h-175 xl:grid-cols-[280px_minmax(0,1fr)]">
//           <aside className={`hidden min-w-0 flex-col rounded-2xl border p-3 lg:flex ${darkMode ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white"}`}>
//             <button type="button" onClick={createNewChat} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40"><Plus size={17} />{t.newChat}</button>
//             <div className={`mt-5 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-400"}`}><span>{t.today}</span><span className={`h-px flex-1 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`} /></div>
//             <div className="mt-2 space-y-1">
//               {historyLoading ? (
//                 <p className="px-3 py-2 text-xs text-slate-400">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
//               ) : threads.filter((thread) => thread.group === "today").length ? (
//                 threads.filter((thread) => thread.group === "today").map(threadButton)
//               ) : (
//                 <p className="px-3 py-2 text-xs text-slate-400">{isArabic ? "لا توجد محادثات بعد" : "No conversations yet"}</p>
//               )}
//             </div>
//             <div className={`mt-5 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-400"}`}><span>{t.thisWeek}</span><span className={`h-px flex-1 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`} /></div>
//             <div className="mt-2 space-y-1">{threads.filter((thread) => thread.group === "week").map(threadButton)}</div>
//             <div className={`mt-auto rounded-xl border p-4 ${darkMode ? "border-teal-900/70 bg-teal-950/30" : "border-teal-100 bg-teal-50/70"}`}>
//               <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-300"><Sparkles size={17} /></span>
//               <strong className="text-sm">{t.tip}</strong><p className={`mt-1.5 text-xs leading-5 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{t.tipText}</p>
//             </div>
//           </aside>

//           <section className={`flex min-h-155 min-w-0 flex-col overflow-hidden rounded-2xl border shadow-sm xl:min-h-175 ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
//             <div className={`flex min-w-0 items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 sm:py-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
//               <div className="flex min-w-0 items-center gap-3">
//                 <button type="button" onClick={() => setMobileHistoryOpen(true)} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl lg:hidden ${darkMode ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`} aria-label={t.close}><MessageCircle size={18} /></button>
//                 <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-teal-500 to-cyan-600 text-white shadow-sm"><Bot size={22} /></span>
//                 <div className="min-w-0"><strong className="block truncate text-sm font-bold sm:text-base">{t.assistant}</strong><span className={`mt-0.5 block truncate text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{t.subtitle}</span></div>
//               </div>
//               <div className="relative">
//                 <button type="button" onClick={() => setShowOptions((value) => !value)} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`} aria-label={t.options}><Ellipsis size={20} /></button>
//                 {showOptions && <div className={`absolute top-full z-10 mt-2 w-48 rounded-xl border p-1 shadow-lg ${isArabic ? "left-0" : "right-0"} ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
//                   <button type="button" onClick={() => { void createNewChat(); setShowOptions(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}><Plus size={15} />{t.newChat}</button>
//                   <button type="button" disabled={!activeThread} onClick={() => { void renameActiveChat(); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}><Pencil size={15} />{t.renameChat}</button>
//                   <button type="button" disabled={!activeThread} onClick={() => { void deleteActiveChat(); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 disabled:cursor-not-allowed disabled:opacity-40 ${darkMode ? "hover:bg-red-950/40" : "hover:bg-red-50"}`}><Trash2 size={15} />{t.deleteChat}</button>
//                 </div>}
//               </div>
//             </div>

//             <div className="flex-1 space-y-5 overflow-y-auto px-3 py-5 sm:px-6 sm:py-7">
//               <div className="flex justify-center"><span className={`rounded-full px-3 py-1 text-[11px] font-medium ${darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{t.date}</span></div>
//               {(historyLoading || messagesLoading) && (
//                 <p className={`py-8 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
//                   {isArabic ? "جاري تحميل المحادثات..." : "Loading conversations..."}
//                 </p>
//               )}
//               {!historyLoading && !messagesLoading && currentMessages.length === 0 && (
//                 <p className={`py-8 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
//                   {t.empty}
//                 </p>
//               )}
//               {currentMessages.map((message) => {
//                 const isAssistant = message.role === "assistant";
//                 return <div key={message.id} className={`flex w-full items-start gap-2.5 sm:gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}>
//                   {isAssistant && <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white"><Sparkles size={15} /></span>}
//                   <div className={`max-w-[88%] min-w-0 sm:max-w-[78%] ${isAssistant ? "items-start" : "items-end"} flex flex-col`}>
//                     <div className={`rounded-2xl px-4 py-3 text-sm leading-7 sm:px-5 ${isAssistant ? (darkMode ? "rounded-ss-md bg-slate-800 text-slate-100" : "rounded-ss-md bg-slate-100 text-slate-800") : "rounded-se-md bg-teal-600 text-white"}`}><p className="whitespace-pre-wrap wrap-break-word">{message.text}</p></div>
//                     <small className={`mt-1.5 px-1 text-[10px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{isAssistant ? t.assistant : t.you} · {isArabic ? "الآن" : "Now"}</small>
//                   </div>
//                   {!isAssistant && <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${darkMode ? "bg-slate-700 text-slate-100" : "bg-slate-200 text-slate-700"}`}>{isArabic ? "أ" : "Y"}</span>}
//                 </div>;
//               })}
//               {currentMessages.length === 1 && <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
//                 <button type="button" onClick={() => sendMessage(isArabic ? "ساعدني في ترتيب أولوياتي اليوم" : "Help me prioritize my day")} className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-start text-xs font-medium transition ${darkMode ? "border-slate-700 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/50"}`}><CheckCheck size={15} className="shrink-0 text-teal-600" />{t.priorities}</button>
//                 <button type="button" onClick={() => sendMessage(isArabic ? "لخّص لي تقدم مشاريعي" : "Summarize my project progress")} className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-start text-xs font-medium transition ${darkMode ? "border-slate-700 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/50"}`}><ChartNoAxesColumnIncreasing size={15} className="shrink-0 text-teal-600" />{t.progress}</button>
//                 <button type="button" onClick={() => sendMessage(isArabic ? "أنشئ خطة عمل لهذا الأسبوع" : "Create a plan for this week")} className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-start text-xs font-medium transition ${darkMode ? "border-slate-700 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/50"}`}><CalendarDays size={15} className="shrink-0 text-teal-600" />{t.weekPlan}</button>            
//               </div>}
//             </div>

//             <div className={`border-t p-3 sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-100 bg-white"}`}>
//               <form onSubmit={handleSubmit} className={`rounded-2xl border p-2 transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10 ${darkMode ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
//                 <label className="sr-only" htmlFor="ai-chat-draft">{t.placeholder}</label>
//                 <textarea id="ai-chat-draft" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleComposerKeyDown} rows={2} placeholder={t.placeholder} className={`max-h-40 min-h-14 w-full resize-y bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-slate-400 ${darkMode ? "text-slate-100" : "text-slate-800"}`} />
//                 <div className="flex flex-col-reverse gap-3 border-t border-slate-200/70 px-2 pt-2 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
//                   <span className={`text-[10px] leading-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{t.disclaimer}</span>                  
//                   <button type="submit" disabled={!draft.trim() || loading} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40">
//   {loading
//     ? isArabic
//       ? "جاري الرد..."
//       : "Thinking..."
//     : t.send}

//   {loading ? (
//     <LoaderCircle size={15} className="animate-spin" />
//   ) : (
//     <Send
//       size={15}
//       className={isArabic ? "rotate-180" : ""}
//     />
//   )}
// </button>
//                 </div>
//               </form>
//               <p className={`mt-2 text-center text-[10px] ${darkMode ? "text-slate-600" : "text-slate-400"}`}>{t.demo}</p>
//             </div>
//           </section>
//         </div>
//       </div>

//       {mobileHistoryOpen && <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label={t.close}>
//         <button type="button" className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileHistoryOpen(false)} aria-label={t.close} />
//         <aside className={`relative flex h-full w-[min(88vw,320px)] flex-col p-4 shadow-2xl ${darkMode ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}>
//           <div className="mb-4 flex items-center justify-between gap-3"><strong>{isArabic ? "سجل المحادثات" : "Chat history"}</strong><button type="button" onClick={() => setMobileHistoryOpen(false)} className={`rounded-lg p-2 ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`} aria-label={t.close}><X size={18} /></button></div>
//           <button type="button" onClick={createNewChat} className="mb-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white"><Plus size={16} />{t.newChat}</button>
//           <p className={`mb-2 px-2 text-xs font-semibold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{t.today}</p>
//           <div className="space-y-1">
//             {historyLoading
//               ? <p className="px-3 py-2 text-xs text-slate-400">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
//               : threads.filter((thread) => thread.group === "today").map(threadButton)}
//           </div>
//           <p className={`mb-2 mt-5 px-2 text-xs font-semibold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{t.thisWeek}</p>
//           <div className="space-y-1">{threads.filter((thread) => thread.group === "week").map(threadButton)}</div>
//         </aside>
//       </div>}
//     </main>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import {
  Bot,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CheckCheck,
  Ellipsis,
  LoaderCircle,
  MessageCircle,
  Plus,
  Pencil,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useCreateConversationMutation,
  useRenameConversationMutation,
  useDeleteConversationMutation,
  useSendChatMessageMutation,
} from "@/app/services/chatbotApi";
import { useDashboardLayout } from "@/app/components/DashboardLayout";

type ChatRole = "assistant" | "user";
type ChatMessage = { role: ChatRole; text: string; id: string };
type ChatThread = { id: string; title: string; time: string; group: "today" | "week" };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const welcomeMessage = (isArabic: boolean) =>
  isArabic
    ? "مرحباً! أنا مساعد NTRA الذكي. يمكنني مساعدتك في تنظيم مهامك، وتلخيص تقدم المشاريع، أو تخطيط يومك. كيف يمكنني مساعدتك اليوم؟"
    : "Hi! I’m your NTRA AI assistant. I can help organize your tasks, summarize project progress, or plan your day. How can I help you today?";

export default function AiChatPage() {
  const { isArabic, darkMode } = useDashboardLayout();
  const [draft, setDraft] = useState("");
  const [activeThread, setActiveThread] = useState("");
  const [localThreads, setLocalThreads] = useState<ChatThread[]>([]);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>({});
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversationIds, setConversationIds] = useState<Record<string, string>>({});

  const {
    data: conversations = [],
    isLoading: historyLoading,
    isError: historyError,
  } = useGetConversationsQuery();

  const [createConversationRequest ] =
    useCreateConversationMutation();
  const [renameConversationRequest] = useRenameConversationMutation();
  const [deleteConversationRequest] = useDeleteConversationMutation();
  const [sendChatMessageRequest ] =
    useSendChatMessageMutation();

  const threads = useMemo<ChatThread[]>(() => {
    const normalizedConversations: ChatThread[] = conversations
      .map((conversation: any) => ({
        id: String(conversation.id ?? conversation.conversation_id ?? ""),
        title: conversation.title ?? (isArabic ? "محادثة جديدة" : "New conversation"),
        time: conversation.updated_at
          ? new Date(conversation.updated_at).toLocaleString(isArabic ? "ar-EG" : "en-US")
          : (isArabic ? "الآن" : "Just now"),
        group: "today" as const,
      }))
      .filter((conversation) => conversation.id.length > 0);

    const localById = new Map(localThreads.map((thread) => [thread.id, thread]));
    const serverIds = new Set(normalizedConversations.map((thread) => thread.id));

    // Server data is the source of truth; local state preserves optimistic
    // chats and titles until the next server response includes them.
    const serverThreads = normalizedConversations.map((thread) => ({
      ...thread,
      title: localById.get(thread.id)?.title ?? thread.title,
      time: localById.get(thread.id)?.time ?? thread.time,
    }));

    const localOnlyThreads = localThreads.filter((thread) => !serverIds.has(thread.id));
    return [...localOnlyThreads, ...serverThreads.filter(
      (thread) => !localOnlyThreads.some((local) => local.id === thread.id)
    )];
  }, [conversations, isArabic, localThreads]);

  const selectedThreadId =
    activeThread && threads.some((thread) => thread.id === activeThread)
      ? activeThread
      : threads[0]?.id ?? "";

  const {
    data: conversationMessages = [],
    isLoading: messagesLoading,
  } = useGetConversationMessagesQuery(selectedThreadId, { skip: !selectedThreadId });

  const serverMessages = useMemo<ChatMessage[]>(
    () =>
      conversationMessages
        .map((message: any, index: number) => ({
          id: String(message.id ?? `${selectedThreadId}-${index}`),
          role: message.role === "user" ? "user" as const : "assistant" as const,
          text: String(message.content ?? message.text ?? ""),
        }))
        .filter((message) => message.text.trim().length > 0),
    [conversationMessages, selectedThreadId]
  );

  // Prefer local messages when the user has started composing this thread;
  // otherwise render the RTK Query result directly without syncing it via an effect.
  const currentMessages = Object.prototype.hasOwnProperty.call(
    messagesByThread,
    selectedThreadId
  )
    ? messagesByThread[selectedThreadId]
    : serverMessages;
  const t = useMemo(
    () =>
      isArabic
        ? {
            kicker: "مدعوم بالذكاء الاصطناعي", title: "مساعد NTRA", description: "اسأل عن مهامك ومشاريعك، أو اطلب المساعدة في تخطيط يومك.", online: "متصل الآن", newChat: "محادثة جديدة", today: "اليوم", thisWeek: "هذا الأسبوع", tip: "نصيحة سريعة", tipText: "اطلب من المساعد إنشاء مهام قابلة للتنفيذ من أي فكرة.", assistant: "مساعد NTRA", subtitle: "مساعدك الذكي للعمل والإنتاجية", date: "اليوم", you: "أنت", placeholder: "اكتب رسالتك هنا...", disclaimer: "قد يقدّم الذكاء الاصطناعي معلومات غير دقيقة.", send: "إرسال", priorities: "رتّب أولوياتي اليوم", progress: "لخّص تقدم مشاريعي", weekPlan: "خطط أسبوعي", search: "ابحث في المحادثات...", empty: "ابدأ محادثة جديدة واسألني أي شيء.", newTitle: "محادثة جديدة", close: "إغلاق سجل المحادثات", options: "خيارات المحادثة", deleteChat: "حذف المحادثة", renameChat: "إعادة تسمية ", renamePrompt: "اكتب الاسم الجديد للمحادثة:", renameFailed: "تعذر تغيير اسم المحادثة. حاول مرة أخرى.", confirmDelete: "هل أنت متأكد من حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.", deleteFailed: "تعذر حذف المحادثة. حاول مرة أخرى.", demo: "تحقق من المعلومات المهمة قبل الاعتماد عليها.",
          }
        : {
            kicker: "AI POWERED", title: "NTRA Assistant", description: "Ask about tasks and projects, or get help planning your day.", online: "Online now", newChat: "New chat", today: "Today", thisWeek: "This week", tip: "Quick tip", tipText: "Ask the assistant to turn any idea into actionable tasks.", assistant: "NTRA Assistant", subtitle: "Your intelligent work & productivity assistant", date: "Today", you: "You", placeholder: "Write your message...", disclaimer: "AI can make mistakes. Check important information.", send: "Send", priorities: "Help prioritize my day", progress: "Summarize project progress", weekPlan: "Plan my week", search: "Search conversations...", empty: "Start a new conversation and ask me anything.", newTitle: "New conversation", close: "Close chat history", options: "Conversation options", deleteChat: "Delete chat", renameChat: "Rename chat", renamePrompt: "Enter a new chat name:", renameFailed: "Could not rename the chat. Please try again.", confirmDelete: "Are you sure you want to delete this chat? This action cannot be undone.", deleteFailed: "Could not delete the chat. Please try again.", demo: "Check important information before relying on it.",
          },
    [isArabic],
  );

  const createNewChat = async () => {
    try {
      const created = await createConversationRequest({ title: t.newTitle }).unwrap();
      const id = String(created?.conversation_id ?? "");
      if (!id) throw new Error("Create conversation response did not include an id");

      const thread: ChatThread = {
        id,
        title: created?.title ?? t.newTitle,
        time: isArabic ? "الآن" : "Just now",
        group: "today",
      };
      setLocalThreads((current) => [thread, ...current.filter((item) => item.id !== id)]);
      setConversationIds((current) => ({ ...current, [id]: id }));
      setMessagesByThread((current) => ({ ...current, [id]: [] }));
      setActiveThread(id);
      setDraft("");
      setMobileHistoryOpen(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      window.alert(isArabic ? "تعذر إنشاء محادثة جديدة. راجع اتصال الـ API." : "Could not create a conversation. Check the API connection.");
    }
  };


const renameActiveChat = async () => {
  if (!selectedThreadId) return;

  const currentThread = threads.find((thread) => thread.id === selectedThreadId);
  if (!currentThread) return;

  const nextTitle = window.prompt(t.renamePrompt, currentThread.title)?.trim();
  if (!nextTitle || nextTitle === currentThread.title) return;

  try {
    await renameConversationRequest({ conversationId: selectedThreadId, title: nextTitle }).unwrap();
    setLocalThreads((current) =>
      current.map((thread) =>
        thread.id === selectedThreadId ? { ...thread, title: nextTitle } : thread
      )
    );
    setShowOptions(false);
  } catch (error) {
    console.error("Failed to rename conversation:", error);
    window.alert(t.renameFailed);
  }
};

const deleteActiveChat = async () => {
  if (!selectedThreadId) return;

  const confirmed = window.confirm(t.confirmDelete);
  if (!confirmed) return;

  const deletingId = selectedThreadId;
  try {
    await deleteConversationRequest(deletingId).unwrap();

    const remainingThreads = threads.filter((thread) => thread.id !== deletingId);
    setLocalThreads(remainingThreads);
    setMessagesByThread((current) => {
      const next = { ...current };
      delete next[deletingId];
      return next;
    });
    setConversationIds((current) => {
      const next = { ...current };
      delete next[deletingId];
      return next;
    });
    setActiveThread(remainingThreads[0]?.id ?? "");
    setShowOptions(false);
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    window.alert(t.deleteFailed);
  }
};

const sendMessage = async (text = draft) => {
  const value = text.trim();

  if (!value || loading) return;

  let threadId = selectedThreadId;
  if (!threadId) {
    try {
      const created = await createConversationRequest({ title: t.newTitle }).unwrap();
      threadId = String(created?.conversation_id ?? "");
      if (!threadId) throw new Error("Create conversation response did not include an id");
      setLocalThreads((current) => [{ id: threadId, title: t.newTitle, time: isArabic ? "الآن" : "Just now", group: "today" }, ...current]);
      setConversationIds((current) => ({ ...current, [threadId]: threadId }));
      setActiveThread(threadId);
      setMessagesByThread((current) => ({ ...current, [threadId]: [] }));
    } catch (error) {
      console.error("Failed to create conversation before sending:", error);
      setLoading(false);
      return;
    }
  }

  const userMessage: ChatMessage = {
    id: `${Date.now()}-user`,
    role: "user",
    text: value,
  };

  setMessagesByThread((current) => ({
    ...current,
    [threadId]: [
      ...(current[threadId] ?? []),
      userMessage,
    ],
  }));

  setDraft("");
  setLoading(true);

  try {
    const result = await sendChatMessageRequest({
      message: value,
      conversation_id: conversationIds[threadId] ?? threadId,
    }).unwrap();

    if (!result.reply?.trim()) {
      throw new Error("The chatbot returned an empty reply");
    }

    if (result.conversation_id) {
      setConversationIds((current) => ({
        ...current,
        [threadId]: result.conversation_id,
      }));
    }

    setMessagesByThread((current) => ({
      ...current,
      [threadId]: [
        ...(current[threadId] ?? []),
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: result.reply,
        },
      ],
    }));

    setLocalThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              title:
                thread.title === t.newTitle ||
                thread.id === "today-plan"
                  ? value.length > 28
                    ? `${value.slice(0, 28)}…`
                    : value
                  : thread.title,
              time: isArabic ? "الآن" : "Just now",
            }
          : thread
      )
    );
  } catch (error) {
    console.error("Chatbot API error:", error);

    setMessagesByThread((current) => ({
      ...current,
      [threadId]: [
        ...(current[threadId] ?? []),
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: isArabic
            ? "تعذر الاتصال بالمساعد الذكي. تأكد من تشغيل الخادم وإعدادات الاتصال."
            : "Unable to connect to the AI assistant. Check the server and connection settings.",
        },
      ],
    }));
  } finally {
    setLoading(false);
  }
};





  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };
  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const threadButton = (thread: ChatThread) => (
    <button
      key={thread.id}
      type="button"
      onClick={() => { setActiveThread(thread.id); setMobileHistoryOpen(false); }}
      className={`group flex w-full min-w-0 items-start gap-3 rounded-xl px-3 py-3 text-start transition ${selectedThreadId === thread.id ? (darkMode ? "bg-teal-400/10 text-teal-200 ring-1 ring-teal-400/20" : "bg-teal-50 text-teal-800 ring-1 ring-teal-100") : (darkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100")}`}
    >
      <MessageCircle size={17} className="mt-0.5 shrink-0 opacity-80" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{thread.title}</span>
        <span className={`mt-1 block text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{thread.time}</span>
      </span>
    </button>
  );

  return (
    <main dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"} className={`min-h-[calc(100vh-2rem)] transition-colors duration-200 ${darkMode ? "bg-transparent text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="flex w-full max-w-380 flex-col gap-6 p-3 sm:p-5 lg:p-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-teal-500  sm:text-sm"><Sparkles size={15} />{t.kicker}</span>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h1>
            <p className={`mt-2 max-w-2xl text-sm leading-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{t.description}</p>
          </div>
        </header>

        <div className="grid min-h-155 grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:min-h-175 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`hidden min-w-0 flex-col rounded-2xl border p-3 lg:flex ${darkMode ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white"}`}>
            <button type="button" onClick={createNewChat} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40"><Plus size={17} />{t.newChat}</button>
            <div className={`mt-5 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-400"}`}><span>{t.today}</span><span className={`h-px flex-1 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`} /></div>
            <div className="mt-2 space-y-1">
              {historyLoading ? (
                <p className="px-3 py-2 text-xs text-slate-400">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
              ) : historyError ? (
                <p className="px-3 py-2 text-xs text-red-400">{isArabic ? "تعذر تحميل المحادثات" : "Could not load conversations"}</p>
              ) : threads.filter((thread) => thread.group === "today").length ? (
                threads.filter((thread) => thread.group === "today").map(threadButton)
              ) : (
                <p className="px-3 py-2 text-xs text-slate-400">{isArabic ? "لا توجد محادثات بعد" : "No conversations yet"}</p>
              )}
            </div>
            <div className={`mt-5 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-400"}`}><span>{t.thisWeek}</span><span className={`h-px flex-1 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`} /></div>
            <div className="mt-2 space-y-1">{threads.filter((thread) => thread.group === "week").map(threadButton)}</div>
            <div className={`mt-auto rounded-xl border p-4 ${darkMode ? "border-teal-900/70 bg-teal-950/30" : "border-teal-100 bg-teal-50/70"}`}>
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-300"><Sparkles size={17} /></span>
              <strong className="text-sm">{t.tip}</strong><p className={`mt-1.5 text-xs leading-5 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{t.tipText}</p>
            </div>
          </aside>

          <section className={`flex min-h-155 min-w-0 flex-col overflow-hidden rounded-2xl border shadow-sm xl:min-h-175 ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
            <div className={`flex min-w-0 items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 sm:py-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" onClick={() => setMobileHistoryOpen(true)} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl lg:hidden ${darkMode ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`} aria-label={t.close}><MessageCircle size={18} /></button>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-teal-500 to-cyan-600 text-white shadow-sm"><Bot size={22} /></span>
                <div className="min-w-0"><strong className="block truncate text-sm font-bold sm:text-base">{t.assistant}</strong><span className={`mt-0.5 block truncate text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{t.subtitle}</span></div>
              </div>
              <div className="relative">
                <button type="button" onClick={() => setShowOptions((value) => !value)} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`} aria-label={t.options}><Ellipsis size={20} /></button>
                {showOptions && <div className={`absolute top-full z-10 mt-2 w-48 rounded-xl border p-1 shadow-lg ${isArabic ? "left-0" : "right-0"} ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
                  <button type="button" onClick={() => { void createNewChat(); setShowOptions(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}><Plus size={15} />{t.newChat}</button>
                  <button type="button" disabled={!selectedThreadId} onClick={() => { void renameActiveChat(); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}><Pencil size={15} />{t.renameChat}</button>
                  <button type="button" disabled={!selectedThreadId} onClick={() => { void deleteActiveChat(); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 disabled:cursor-not-allowed disabled:opacity-40 ${darkMode ? "hover:bg-red-950/40" : "hover:bg-red-50"}`}><Trash2 size={15} />{t.deleteChat}</button>
                </div>}
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-3 py-5 sm:px-6 sm:py-7">
              <div className="flex justify-center"><span className={`rounded-full px-3 py-1 text-[11px] font-medium ${darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{t.date}</span></div>
              {(historyLoading || messagesLoading) && (
                <p className={`py-8 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {isArabic ? "جاري تحميل المحادثات..." : "Loading conversations..."}
                </p>
              )}
              {!historyLoading && !messagesLoading && currentMessages.length === 0 && (
                <p className={`py-8 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {t.empty}
                </p>
              )}
              {currentMessages.map((message) => {
                const isAssistant = message.role === "assistant";
                return <div key={message.id} className={`flex w-full items-start gap-2.5 sm:gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}>
                  {isAssistant && <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white"><Sparkles size={15} /></span>}
                  <div className={`max-w-[88%] min-w-0 sm:max-w-[78%] ${isAssistant ? "items-start" : "items-end"} flex flex-col`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-7 sm:px-5 ${isAssistant ? (darkMode ? "rounded-ss-md bg-slate-800 text-slate-100" : "rounded-ss-md bg-slate-100 text-slate-800") : "rounded-se-md bg-teal-600 text-white"}`}><p className="whitespace-pre-wrap wrap-break-word">{message.text}</p></div>
                    <small className={`mt-1.5 px-1 text-[10px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{isAssistant ? t.assistant : t.you} · {isArabic ? "الآن" : "Now"}</small>
                  </div>
                  {!isAssistant && <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${darkMode ? "bg-slate-700 text-slate-100" : "bg-slate-200 text-slate-700"}`}>{isArabic ? "أ" : "Y"}</span>}
                </div>;
              })}
              {currentMessages.length === 1 && <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
                <button type="button" onClick={() => sendMessage(isArabic ? "ساعدني في ترتيب أولوياتي اليوم" : "Help me prioritize my day")} className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-start text-xs font-medium transition ${darkMode ? "border-slate-700 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/50"}`}><CheckCheck size={15} className="shrink-0 text-teal-600" />{t.priorities}</button>
                <button type="button" onClick={() => sendMessage(isArabic ? "لخّص لي تقدم مشاريعي" : "Summarize my project progress")} className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-start text-xs font-medium transition ${darkMode ? "border-slate-700 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/50"}`}><ChartNoAxesColumnIncreasing size={15} className="shrink-0 text-teal-600" />{t.progress}</button>
                <button type="button" onClick={() => sendMessage(isArabic ? "أنشئ خطة عمل لهذا الأسبوع" : "Create a plan for this week")} className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-start text-xs font-medium transition ${darkMode ? "border-slate-700 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50/50"}`}><CalendarDays size={15} className="shrink-0 text-teal-600" />{t.weekPlan}</button>            
              </div>}
            </div>

            <div className={`border-t p-3 sm:p-5 ${darkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-100 bg-white"}`}>
              <form onSubmit={handleSubmit} className={`rounded-2xl border p-2 transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10 ${darkMode ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
                <label className="sr-only" htmlFor="ai-chat-draft">{t.placeholder}</label>
                <textarea id="ai-chat-draft" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleComposerKeyDown} rows={2} placeholder={t.placeholder} className={`max-h-40 min-h-14 w-full resize-y bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-slate-400 ${darkMode ? "text-slate-100" : "text-slate-800"}`} />
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200/70 px-2 pt-2 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                  <span className={`text-[10px] leading-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{t.disclaimer}</span>                  
                  <button type="submit" disabled={!draft.trim() || loading} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40">
  {loading
    ? isArabic
      ? "جاري الرد..."
      : "Thinking..."
    : t.send}

  {loading ? (
    <LoaderCircle size={15} className="animate-spin" />
  ) : (
    <Send
      size={15}
      className={isArabic ? "rotate-180" : ""}
    />
  )}
</button>
                </div>
              </form>
              <p className={`mt-2 text-center text-[10px] ${darkMode ? "text-slate-600" : "text-slate-400"}`}>{t.demo}</p>
            </div>
          </section>
        </div>
      </div>

      {mobileHistoryOpen && <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label={t.close}>
        <button type="button" className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileHistoryOpen(false)} aria-label={t.close} />
        <aside className={`relative flex h-full w-[min(88vw,320px)] flex-col p-4 shadow-2xl ${darkMode ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}>
          <div className="mb-4 flex items-center justify-between gap-3"><strong>{isArabic ? "سجل المحادثات" : "Chat history"}</strong><button type="button" onClick={() => setMobileHistoryOpen(false)} className={`rounded-lg p-2 ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`} aria-label={t.close}><X size={18} /></button></div>
          <button type="button" onClick={createNewChat} className="mb-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white"><Plus size={16} />{t.newChat}</button>
          <p className={`mb-2 px-2 text-xs font-semibold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{t.today}</p>
          <div className="space-y-1">
            {historyLoading
              ? <p className="px-3 py-2 text-xs text-slate-400">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
              : threads.filter((thread) => thread.group === "today").map(threadButton)}
          </div>
          <p className={`mb-2 mt-5 px-2 text-xs font-semibold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{t.thisWeek}</p>
          <div className="space-y-1">{threads.filter((thread) => thread.group === "week").map(threadButton)}</div>
        </aside>
      </div>}
    </main>
  );
}
