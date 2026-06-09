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

// if (loading || !user || user.role !== allowedRole) {
//     // Return null to prevent flashing the page content before redirect
//     return null;
// }
if (loading) {
  return (
    <div className="ci-page">
      Loading...
    </div>
  );
}

if (!user || user.role !== allowedRole) {
  return (
    <div className="ci-page">
      Redirecting...
    </div>
  );
}
return <>{children}</>;
}
