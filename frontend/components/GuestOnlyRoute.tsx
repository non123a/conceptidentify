"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getAuthenticatedRedirectPath,
  LAST_AUTHENTICATED_PATH_KEY,
} from "@/lib/authRoutes";

export default function GuestOnlyRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const redirectPath = getAuthenticatedRedirectPath(
      window.sessionStorage.getItem(
        LAST_AUTHENTICATED_PATH_KEY
      )
    );

    router.replace(redirectPath);
  }, [loading, router, user]);

  if (loading || user) {
    return (
      <div className="ci-page">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
