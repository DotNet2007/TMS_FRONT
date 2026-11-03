"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import type { ReactNode } from "react";


export default function TeamLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute adminOnly>
      {children}
    </ProtectedRoute>
  );
}
