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
      <div className="ci-loading-state ci-page min-h-[calc(100vh-73px)]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
        <p className="text-sm font-medium text-slate-600">
          Loading...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
