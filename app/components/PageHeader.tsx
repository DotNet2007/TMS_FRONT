"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps { title: string; description?: string; kicker?: string; isRTL?: boolean; isDark?: boolean; action?: ReactNode }

export default function PageHeader({ title, description, kicker, isRTL = true, isDark = false, action }: PageHeaderProps) {

    return (
        <div dir={isRTL ? "rtl" : "ltr"} className="flex min-w-0 items-start justify-between gap-4" >
            <div className="min-w-0 space-y-2">
                {kicker && ( <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#238e94] sm:text-sm"> <Check size={15} strokeWidth={3} />{kicker}</span>)}
                <h1 className={`text-xl font-bold tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-800"}`}>{title}</h1>
                {description && ( <p className={`text-xs leading-6 sm:text-sm ${ isDark ? "text-slate-400" : "text-slate-500"}`}>{description}</p>)}
            </div>
            {action && (<div className="shrink-0">{action}</div>)}
        </div>
    );

}