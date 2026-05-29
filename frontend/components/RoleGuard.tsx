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
      router.push("/login");
      return;
    }

    if (!loading && user && user.role !== allowedRole) {
      router.push("/dashboard");
    }
}, [user, loading, allowedRole, router]);

if (loading || !user || user.role !== allowedRole) {
    // Return null to prevent flashing the page content before redirect
    return null;
}

return <>{children}</>;
}
