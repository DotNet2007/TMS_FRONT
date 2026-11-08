type Props = {
  currentPage: number; totalPages: number; totalCount: number; pageSize: number;
  isRTL: boolean; isDark: boolean; onPageChange: (page: number) => void;
};

export default function TaskPagination({ currentPage, totalPages, totalCount, pageSize, isRTL, isDark, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  const activePage = Math.min(currentPage, totalPages);
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  return <nav className={`flex min-w-0 flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${borderColor}`} aria-label={isRTL ? "ترقيم الصفحات" : "Pagination"} dir={isRTL ? "rtl" : "ltr"}>
    <p className={`text-sm ${mutedText}`} aria-live="polite">{isRTL ? `عرض ${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, totalCount)} من ${totalCount}` : `Showing ${(activePage - 1) * pageSize + 1}–${Math.min(activePage * pageSize, totalCount)} of ${totalCount}`}</p>
    <div className="flex items-center justify-between gap-2 sm:justify-end">
      <button type="button" onClick={() => onPageChange(Math.max(1, activePage - 1))} disabled={activePage <= 1} className={`min-h-9 rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${borderColor} ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>{isRTL ? "السابق" : "Previous"}</button>
      <span className={`min-w-20 text-center text-sm ${mutedText}`} aria-live="polite">{isRTL ? `صفحة ${activePage} من ${totalPages}` : `Page ${activePage} of ${totalPages}`}</span>
      <button type="button" onClick={() => onPageChange(Math.min(totalPages, activePage + 1))} disabled={activePage >= totalPages} className={`min-h-9 rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${borderColor} ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>{isRTL ? "التالي" : "Next"}</button>
    </div>
  </nav>;
}
