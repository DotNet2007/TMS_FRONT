"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import type { ReactNode } from "react";


export default function ReportsLayout( { children }: { children: ReactNode } ) {
  return (
    <ProtectedRoute adminOnly>
      {children}
    </ProtectedRoute>
  );
}
