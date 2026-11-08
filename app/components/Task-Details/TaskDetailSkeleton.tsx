type TaskDetailSkeletonProps = { isArabic?: boolean; darkMode?: boolean };

function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-lg ${ className }`} aria-hidden="true"/>
    );
}

export default function TaskDetailSkeleton({ isArabic = false, darkMode = false }: TaskDetailSkeletonProps) {

    const card = darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white";
    const skeleton = darkMode ? "bg-slate-700" : "bg-slate-200";
    const muted = darkMode ? "bg-slate-700/60" : "bg-slate-100";

    return (
        <section dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"} aria-label={isArabic ? "جاري تحميل المهمة" : "Loading task"} aria-busy="true" role="status" className="min-w-0 space-y-6 pb-8" >
            {/* Page Heading */}
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                    <Skeleton className={`h-4 w-28 ${skeleton}`} />
                    <Skeleton className={`h-7 w-48 max-w-full ${skeleton}`} />
                    <Skeleton className={`h-4 w-64 max-w-full ${muted}`} />
                </div>

                <Skeleton className={`h-5 w-20 ${skeleton}`} />
            </div>

            {/* Task Header */}
            <div className={`flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 ${card}`}>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Skeleton className={`h-12 w-12 shrink-0 rounded-2xl ${skeleton}`} />

                    <div className="min-w-0 flex-1 space-y-3">
                        <Skeleton className={`h-5 w-3/4 max-w-64 ${skeleton}`} />
                        <Skeleton className={`h-3 w-36 ${muted}`} />
                    </div>
                </div>

                <Skeleton className={`h-10 w-32 rounded-xl ${skeleton}`} />
            </div>

            {/* Main Content */}
            <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">

                {/* Left Column */}
                <div className="min-w-0 space-y-5">

                {/* Description Card */}
                <article className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${card}`}>
                    <div className="mb-6 flex items-center gap-3">
                        <Skeleton className={`h-9 w-9 rounded-xl ${skeleton}`} />
                        <Skeleton className={`h-5 w-32 ${skeleton}`} />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className={`h-3.5 w-full ${muted}`} />
                        <Skeleton className={`h-3.5 w-full ${muted}`} />
                        <Skeleton className={`h-3.5 w-4/5 ${muted}`} />
                        <Skeleton className={`h-3.5 w-2/3 ${muted}`} />
                    </div>
                </article>

                {/* Activity Timeline */}
                <article className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${card}`}>
                    <div className="mb-6 flex items-center gap-3">
                        <Skeleton className={`h-9 w-9 rounded-xl ${skeleton}`} />
                        <Skeleton className={`h-5 w-36 ${skeleton}`} />
                    </div>

                    <div className="space-y-7">
                    {[1, 2].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                            <Skeleton className={`h-10 w-10 shrink-0 rounded-full ${skeleton}`}/>

                            <div className="min-w-0 flex-1 space-y-3 pt-1">
                                <Skeleton className={`h-3.5 w-32 ${skeleton}`} />
                                <Skeleton className={`h-3.5 w-48 max-w-full ${muted}`} />
                                <Skeleton className={`h-3 w-28 ${muted}`} />
                            </div>
                        </div>
                    ))}
                    </div>
                </article>
                </div>

                {/* Right Column */}
                <aside className="min-w-0">
                    <article className={`rounded-2xl border p-5 shadow-sm ${card}`}>
                        <Skeleton className={`mb-6 h-5 w-28 ${skeleton}`} />

                        {/* Owner */}
                        <div className={`flex items-center justify-between gap-3 border-b py-5 ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                            <Skeleton className={`h-4 w-20 ${muted}`} />
                            <Skeleton className={`h-4 w-24 ${skeleton}`} />
                        </div>

                        {/* Deadline */}
                        <div className={`flex items-center justify-between gap-3 border-b py-5 ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                            <Skeleton className={`h-4 w-16 ${muted}`} />
                            <Skeleton className={`h-4 w-24 ${skeleton}`} />
                        </div>

                        {/* Status */}
                        <div className={`flex items-center justify-between gap-3 border-b py-5 ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                            <Skeleton className={`h-4 w-16 ${muted}`} />
                            <Skeleton className={`h-6 w-24 rounded-full ${skeleton}`} />
                        </div>

                        {/* Project */}
                        <div className="flex items-center justify-between gap-3 pt-5">
                            <Skeleton className={`h-4 w-20 ${muted}`} />
                            <Skeleton className={`h-4 w-24 ${skeleton}`} />
                        </div>
                    </article>
                </aside>
            </div>

            <span className="sr-only">
                {isArabic ? "جاري تحميل تفاصيل المهمة..." : "Loading task details..."}
            </span>
        </section>
    );
}
