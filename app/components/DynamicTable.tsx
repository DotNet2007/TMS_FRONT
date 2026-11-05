// import type { ReactNode } from "react";
// import { Search } from "lucide-react";

// export interface TableColumn<T> {
//   key: string;
//   header: string;
//   render?: (item: T) => ReactNode;
//   className?: string;
//   width?: string;
// }

// interface DynamicReportTableProps<T> {
//   data: T[];
//   columns: TableColumn<T>[];
//   getRowKey: (item: T) => string | number;
//   getRowLabel?: (item: T) => string;
//   onRowClick?: (item: T) => void;
//   rowClassName?: (item: T) => string;
//   isDark: boolean;
//   isRTL: boolean;
//   surface: string;
//   mutedText: string;
//   noResults: string;
//   changeFilters: string;
//   mobileCards?: boolean;
//   emptyIcon?: ReactNode;
// }

// export default function DynamicReportTable<T>({
//   data,
//   columns,
//   getRowKey,
//   getRowLabel,
//   onRowClick,
//   rowClassName,
//   isDark,
//   isRTL,
//   surface,
//   mutedText,
//   noResults,
//   changeFilters,
//   mobileCards = true,
//   emptyIcon,
// }: DynamicReportTableProps<T>) {
//   if (columns.length === 0) {
//     return null;
//   }

//   if (data.length === 0) {
//     return (
//       <div
//         className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-14 text-center ${surface}`}
//       >
//         {emptyIcon ?? <Search size={28} className={`mb-3 ${mutedText}`} />}
//         <strong className="text-sm">{noResults}</strong>
//         <p className={`mt-2 text-xs ${mutedText}`}>{changeFilters}</p>
//       </div>
//     );
//   }

//   const renderCell = (item: T, column: TableColumn<T>) => {
//     if (column.render) {
//       return column.render(item);
//     }

//     const value = (item as Record<string, unknown>)[column.key];

//     if (value === null || value === undefined || value === "") {
//       return "—";
//     }

//     if (typeof value === "string" || typeof value === "number") {
//       return value;
//     }

//     return "—";
//   };

//   const defaultWidth = `${100 / columns.length}%`;

//   return (
//     <>
//       {/* Desktop table */}
//       <div className="print-table-wrapper hidden overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 md:block">
//         <table className="w-full min-w-0 table-fixed text-sm">
//           <colgroup>
//             {columns.map((column) => (
//               <col
//                 key={column.key}
//                 style={{ width: column.width ?? defaultWidth }}
//               />
//             ))}
//           </colgroup>

//           <thead
//             className={
//               isDark
//                 ? "bg-gray-900/70 text-gray-400"
//                 : "bg-gray-50 text-gray-500"
//             }
//           >
//             <tr>
//               {columns.map((column) => (
//                 <th
//                   key={column.key}
//                   scope="col"
//                   className={`px-2 py-3 text-xs font-bold ${
//                     isRTL ? "text-right" : "text-left"
//                   } ${column.className ?? ""}`}
//                 >
//                   {column.header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((item) => (
//               <tr
//                 key={getRowKey(item)}
//                 role={onRowClick ? "link" : undefined}
//                 tabIndex={onRowClick ? 0 : undefined}
//                 aria-label={getRowLabel?.(item)}
//                 onClick={onRowClick ? () => onRowClick(item) : undefined}
//                 onKeyDown={
//                   onRowClick
//                     ? (event) => {
//                         const target = event.target as HTMLElement;
//                         if (target.closest("button, a, input, textarea, select")) return;
//                         if (event.key === "Enter" || event.key === " ") {
//                           event.preventDefault();
//                           onRowClick(item);
//                         }
//                       }
//                     : undefined
//                 }
//                 className={`border-t border-gray-200 transition hover:bg-gray-500/5 dark:border-gray-700 ${
//                   onRowClick
//                     ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#238e94]"
//                     : ""
//                 } ${rowClassName?.(item) ?? ""}`}
//               >
//                 {columns.map((column) => (
//                   <td
//                     key={column.key}
//                     className={`min-w-0 px-2 py-3 text-[11px] ${mutedText} ${column.className ?? ""}`}
//                   >
//                     {renderCell(item, column)}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile cards */}
//       {mobileCards && (
//         <div className="mobile-task-cards grid grid-cols-1 gap-3 md:hidden">
//           {data.map((item) => (
//             <article
//               key={`mobile-${getRowKey(item)}`}
//               role={onRowClick ? "link" : undefined}
//               tabIndex={onRowClick ? 0 : undefined}
//               aria-label={getRowLabel?.(item)}
//               onClick={onRowClick ? () => onRowClick(item) : undefined}
//               onKeyDown={
//                 onRowClick
//                   ? (event) => {
//                       const target = event.target as HTMLElement;
//                       if (target.closest("button, a, input, textarea, select")) return;
//                       if (event.key === "Enter" || event.key === " ") {
//                         event.preventDefault();
//                         onRowClick(item);
//                       }
//                     }
//                   : undefined
//               }
//               className={`min-w-0 rounded-xl border p-3 ${surface} ${
//                 onRowClick
//                   ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#238e94]"
//                   : ""
//               } ${rowClassName?.(item) ?? ""}`}
//             >
//               {columns.map((column, index) => (
//                 <div
//                   key={column.key}
//                   className={`min-w-0 ${
//                     index === 0
//                       ? "mb-3"
//                       : "border-t border-gray-200 py-2 dark:border-gray-700"
//                   }`}
//                 >
//                   {index > 0 && (
//                     <span className={`mb-1 block text-xs ${mutedText}`}>
//                       {column.header}
//                     </span>
//                   )}

//                   <div className="min-w-0 wrap-break-word text-sm font-medium">
//                     {renderCell(item, column)}
//                   </div>
//                 </div>
//               ))}
//             </article>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }





import type { ReactNode } from "react";
import { Search } from "lucide-react";

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  width?: string;
}

interface DynamicReportTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowKey: (item: T) => string | number;
  getRowLabel?: (item: T) => string;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
  isDark: boolean;
  isRTL: boolean;
  surface: string;
  mutedText: string;
  noResults: string;
  changeFilters: string;
  mobileCards?: boolean;
  emptyIcon?: ReactNode;
}

export default function DynamicReportTable<T>({
  data,
  columns,
  getRowKey,
  getRowLabel,
  onRowClick,
  rowClassName,
  isDark,
  isRTL,
  surface,
  mutedText,
  noResults,
  changeFilters,
  mobileCards = true,
  emptyIcon,
}: DynamicReportTableProps<T>) {
  if (columns.length === 0) {
    return null;
  }

  if (data.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-14 text-center ${surface}`}
      >
        {emptyIcon ?? (
          <Search size={28} className={`mb-3 ${mutedText}`} />
        )}

        <strong className="text-sm">{noResults}</strong>

        <p className={`mt-2 text-xs ${mutedText}`}>
          {changeFilters}
        </p>
      </div>
    );
  }

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(item);
    }

    const value = (item as Record<string, unknown>)[column.key];

    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }

    return "—";
  };

  const defaultWidth = `${100 / columns.length}%`;

  return (
    <>
      {/* Desktop table */}
      <div
        className={`print-table-wrapper hidden overflow-x-auto rounded-xl border ${
          isDark ? "border-gray-700" : "border-gray-200"
        } md:block`}
      >
        <table className="w-full min-w-0 table-fixed text-sm">
          <colgroup>
            {columns.map((column) => (
              <col
                key={column.key}
                style={{ width: column.width ?? defaultWidth }}
              />
            ))}
          </colgroup>

          <thead
            className={
              isDark
                ? "bg-gray-900/70 text-gray-400"
                : "bg-gray-50 text-gray-500"
            }
          >
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-2 py-3 text-xs font-bold ${
                    isRTL ? "text-right" : "text-left"
                  } ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={getRowKey(item)}
                role={onRowClick ? "link" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={getRowLabel?.(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        const target = event.target as HTMLElement;

                        if (
                          target.closest(
                            "button, a, input, textarea, select"
                          )
                        ) {
                          return;
                        }

                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          onRowClick(item);
                        }
                      }
                    : undefined
                }
                className={`border-t transition hover:bg-gray-500/5 ${
                  isDark ? "border-gray-700" : "border-gray-200"
                } ${
                  onRowClick
                    ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#238e94]"
                    : ""
                } ${rowClassName?.(item) ?? ""}`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`min-w-0 px-2 py-3 text-[11px] ${mutedText} ${column.className ?? ""}`}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      {mobileCards && (
        <div className="mobile-task-cards grid grid-cols-1 gap-3 md:hidden">
          {data.map((item) => (
            <article
              key={`mobile-${getRowKey(item)}`}
              role={onRowClick ? "link" : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              aria-label={getRowLabel?.(item)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      const target = event.target as HTMLElement;

                      if (
                        target.closest(
                          "button, a, input, textarea, select"
                        )
                      ) {
                        return;
                      }

                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        onRowClick(item);
                      }
                    }
                  : undefined
              }
              className={`min-w-0 rounded-xl border p-3 ${surface} ${
                onRowClick
                  ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#238e94]"
                  : ""
              } ${rowClassName?.(item) ?? ""}`}
            >
              {columns.map((column, index) => (
                <div
                  key={column.key}
                  className={`min-w-0 ${
                    index === 0
                      ? "mb-3"
                      : `border-t py-2 ${
                          isDark
                            ? "border-gray-700"
                            : "border-gray-200"
                        }`
                  }`}
                >
                  {index > 0 && (
                    <span
                      className={`mb-1 block text-xs ${mutedText}`}
                    >
                      {column.header}
                    </span>
                  )}

                  <div className="min-w-0 wrap-break-word text-sm font-medium">
                    {renderCell(item, column)}
                  </div>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
