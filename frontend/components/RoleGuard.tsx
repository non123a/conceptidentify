"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({
children,
allowedRole,
}: {
children: React.ReactNode;
allowedRole: "lecturer" | "student";
}) {

const { user, loading } = useAuth();
const router = useRouter();

useEffect(() => {
    if (!loading && !user) {
      // router.push("/login");
      router.replace("/login");
      return;
    }

    if (!loading && user && user.role !== allowedRole) {
      // router.push("/dashboard");
      router.replace("/dashboard");
    }
}, [user, loading, allowedRole, router]);

if (loading) {
  return (
    <div className="ci-loading-state ci-page min-h-[calc(100vh-73px)]">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
      <p className="text-sm font-medium text-slate-600">
        Loading...
      </p>
    </div>
  );
}

if (!user || user.role !== allowedRole) {
  return (
    <div className="ci-loading-state ci-page min-h-[calc(100vh-73px)]">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
      <p className="text-sm font-medium text-slate-600">
        Redirecting...
      </p>
    </div>
  );
}
return <>{children}</>;
}
