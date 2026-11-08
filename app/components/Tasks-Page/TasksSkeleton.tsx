"use client";

type MyTasksSkeletonProps = { isRTL?: boolean; isDark?: boolean; isSupervisorMode?: boolean; canReviewTasks?: boolean };

export default function MyTasksSkeleton({ isRTL = true, isDark = false, isSupervisorMode = false, canReviewTasks = false }: MyTasksSkeletonProps) {
    const surface = isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white";
    const skeleton = isDark ? "bg-slate-700" : "bg-gray-200";
    const shimmer = `animate-pulse rounded-lg ${skeleton}`;
    const tableColumns = canReviewTasks ? 5 : 4;

    return (
        <section dir={isRTL ? "rtl" : "ltr"} className={`min-w-0 space-y-6 ${ isDark ? "text-gray-100" : "text-gray-900" }`}
        >
        {/* ================================= */}
        {/* Page Header */}
        {/* ================================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-3">
            <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded ${shimmer}`} />
                <div className={`h-4 w-28 ${shimmer}`} />
            </div>

            <div className={`h-8 w-40 ${shimmer}`} />

            <div className={`h-4 w-64 max-w-full ${shimmer}`} />
            </div>
        </div>

        {/* ================================= */}
        {/* Statistics Cards */}
        {/* ================================= */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 3 }).map((_, index) => (
            <article
                key={index}
                className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:p-5 ${surface}`}
            >
                <div className={`h-10 w-10 shrink-0 rounded-xl ${shimmer}`} />

                <div className="min-w-0 flex-1 space-y-2">
                <div className={`h-6 w-14 max-w-full ${shimmer}`} />
                <div className={`h-3 w-20 max-w-full ${shimmer}`} />
                </div>

                {index === 1 || index === 2 ? (
                <div className={`hidden h-3 w-12 sm:block ${shimmer}`} />
                ) : null}
            </article>
            ))}
        </div>

        {/* ================================= */}
        {/* Tasks Container */}
        {/* ================================= */}

        <div className={`min-w-0 overflow-hidden rounded-xl border shadow-sm ${surface}`}>

            {/* Toolbar */}
            <div className={`border-b p-3 sm:p-5 ${ isDark ? "border-gray-700" : "border-gray-200" }`}>
                <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                    {/* Task List Title */}
                    <div className="shrink-0 space-y-2">
                    <div className={`h-5 w-32 ${shimmer}`} />
                    <div className={`h-3 w-24 ${shimmer}`} />
                    </div>

                    {/* Search + Supervisor Tabs */}
                    <div className="flex w-full min-w-0 flex-1 flex-col gap-3 xl:max-w-5xl">

                        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">

                            {/* Search */}
                            <div className="flex-1">
                            <div className={`h-11 w-full rounded-xl ${shimmer}`} />
                            </div>

                            {/* Supervisor Tabs */}
                            {isSupervisorMode && (
                            <div className={`grid grid-cols-2 gap-1 rounded-xl p-1 ${ isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                                <div className={`h-9 w-full rounded-lg ${shimmer}`} />
                                <div className={`h-9 w-full rounded-lg ${shimmer}`} />
                            </div>
                            )}
                        </div>

                        {/* Status Filters */}
                        <div className={`grid w-full grid-cols-2 gap-1.5 rounded-xl border p-1.5 sm:flex sm:flex-wrap sm:items-center ${ isDark ? "border-gray-700 bg-gray-900/70" : "border-gray-200 bg-gray-50" }`}>
                            {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className={`h-9 min-w-0 rounded-lg ${ index === 4 ? "col-span-2 sm:col-span-1" : "" } ${shimmer}`}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================= */}
            {/* Desktop Table */}
            {/* ================================= */}

            <div className="hidden overflow-x-auto md:block">
            <table className="w-full table-fixed">
                <thead>
                <tr className={isDark ? "bg-slate-900/50" : "bg-gray-50"}>
                    {Array.from({ length: tableColumns }).map((_, index) => (
                    <th key={index} className="px-5 py-4 text-start" style={{ width: canReviewTasks ? ["32%", "16%", "20%", "16%", "16%"][index] : ["38%", "16%", "24%", "22%"][index] }}>
                        <div className={`h-3 ${ index === 0 ? "w-20" : "w-16" } ${shimmer}`}/>
                    </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {Array.from({ length: 4 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className={`border-t ${ isDark ? "border-gray-700" : "border-gray-200" }`}>
                    {Array.from({ length: tableColumns }).map((_, colIndex) => (
                        <td key={colIndex} className="px-5 py-5">
                        {colIndex === 0 ? (
                            <div className="space-y-2">
                            <div className={`h-4 w-36 max-w-full ${shimmer}`} />
                            <div className={`h-3 w-24 max-w-full ${shimmer}`} />
                            </div>
                        ) : colIndex === 3 ? (
                            <div className={`h-6 w-24 rounded-full ${shimmer}`} />
                        ) : colIndex === 4 && canReviewTasks ? (
                            <div className="flex items-center gap-2">
                            <div className={`h-9 w-9 rounded-lg ${shimmer}`} />
                            <div className={`h-9 w-9 rounded-lg ${shimmer}`} />
                            </div>
                        ) : (
                            <div className={`h-4 w-24 max-w-full ${shimmer}`} />
                        )}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {/* ================================= */}
            {/* Mobile Task Cards */}
            {/* ================================= */}

            <div className="space-y-3 p-4 md:hidden">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                key={index}
                className={`space-y-4 rounded-xl border p-4 ${surface}`}
                >
                {/* Task Title + Status */}
                <div className="flex items-center justify-between gap-3">
                    <div className={`h-4 w-36 max-w-full ${shimmer}`} />
                    <div className={`h-6 w-20 shrink-0 rounded-full ${shimmer}`} />
                </div>

                {/* Task Details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 ${shimmer}`} />
                    <div className={`h-3 w-28 ${shimmer}`} />
                    </div>

                    <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 ${shimmer}`} />
                    <div className={`h-3 w-36 ${shimmer}`} />
                    </div>
                </div>

                {/* Review Actions */}
                {canReviewTasks && (
                    <div className="flex items-center justify-end gap-2 border-t border-inherit pt-3">
                    <div className={`h-9 w-9 rounded-lg ${shimmer}`} />
                    <div className={`h-9 w-9 rounded-lg ${shimmer}`} />
                    </div>
                )}
                </div>
            ))}
            </div>

            {/* ================================= */}
            {/* Pagination */}
            {/* ================================= */}

            <div className={`flex min-w-0 flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <div className={`h-4 w-40 max-w-full ${shimmer}`} />

            <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className={`h-9 w-20 rounded-lg ${shimmer}`} />
                <div className={`h-4 w-24 ${shimmer}`} />
                <div className={`h-9 w-20 rounded-lg ${shimmer}`} />
            </div>
            </div>
        </div>
        </section>
    );
}
