"use client";

import { useEffect, type ReactNode } from "react";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { RefreshCw } from "lucide-react";

interface ProtectedRouteProps {children: ReactNode; adminOnly?: boolean }

export default function ProtectedRoute({children, adminOnly = false}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const hasAdminAccess = user?.role === "SUPER_SUPERVISOR";
  const hasAccess = isAuthenticated && (!adminOnly || hasAdminAccess);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (adminOnly && !hasAdminAccess) {
      // router.replace("/dashboard");
      notFound();
    }
    }, [isLoading, isAuthenticated, adminOnly, hasAdminAccess, router,]
  );

  if (isLoading || !hasAccess) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          {isLoading ? 
            <section className={`rounded-2xl border p-12 text-center border-white`}>
            <RefreshCw size={50} className="mx-auto mb-4 animate-spin text-teal-500"/>
          </section> : "Redirecting…"}
      </div>
    );
  }

  return <>{children}</>;
}





// "use client";

// import { useEffect, type ReactNode } from "react";
// import { notFound, useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/AuthContext";
// import { RefreshCw } from "lucide-react";

// interface ProtectedRouteProps {
//   children: ReactNode;
//   adminOnly?: boolean;
// }

// export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
//   const { isAuthenticated, isLoading, user } = useAuth();
//   const router = useRouter();

//   // Normalize role: SUPER_SUPERVISOR, SUPER SUPERVISOR, super-supervisor
//   const normalizedRole =
//     typeof user?.role === "string"
//       ? user.role.trim().toUpperCase().replace(/[\s-]+/g, "_")
//       : "";

//   const hasAdminAccess =
//     user?.isAdmin === true ||
//     normalizedRole === "SUPER_SUPERVISOR";

//   const hasAccess =
//     isAuthenticated && (!adminOnly || hasAdminAccess);

//   useEffect(() => {
//     if (isLoading) return;

//     if (!isAuthenticated) {
//       router.replace("/login");
//     }
//   }, [isLoading, isAuthenticated, router]);

//   console.log("Authenticated:", isAuthenticated);
// console.log("User:", user);
// console.log("User role:", user?.role);
// console.log("Admin access:", hasAdminAccess);

//   // Wait for authentication to finish loading.
//   if (isLoading) {
//     return (
//       <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
//         <section className="rounded-2xl border border-slate-200 p-12 text-center dark:border-slate-800">
//           <RefreshCw
//             size={50}
//             className="mx-auto mb-4 animate-spin text-teal-500"
//           />
//         </section>
//       </div>
//     );
//   }

//   // Redirect unauthenticated users.
//   if (!isAuthenticated) {
//     return (
//       <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
//         Redirecting…
//       </div>
//     );
//   }

//   // Hide admin-only pages from users without admin access.
//   if (adminOnly && !hasAdminAccess) {
//     notFound();
//   }

//   if (!hasAccess) {
//     return null;
//   }

//   return <>{children}</>;
// }
