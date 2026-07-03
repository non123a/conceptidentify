"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  isAuthenticatedAppPath,
  isGuestOnlyPath,
  LAST_AUTHENTICATED_PATH_KEY,
} from "@/lib/authRoutes";

export default function Navbar() {

  const {
    user,
    logout,
  } = useAuth();
  const pathname = usePathname();

  const [logoutConfirmOpen, setLogoutConfirmOpen] =
    useState(false);
  const [loggingOut, setLoggingOut] =
    useState(false);

  useEffect(() => {
    if (
      user &&
      pathname &&
      isAuthenticatedAppPath(pathname)
    ) {
      window.sessionStorage.setItem(
        LAST_AUTHENTICATED_PATH_KEY,
        pathname
      );
    }
  }, [pathname, user]);

  const handleConfirmLogout = async () => {

    try {

      setLoggingOut(true);

      await logout();

    } finally {

      setLoggingOut(false);
      setLogoutConfirmOpen(false);

    }
  };

  if (!user || isGuestOnlyPath(pathname)) {
    return null;
  }

  return (

    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

      <div className="ci-page flex items-center justify-between gap-4 py-4">

        <Link
          href="/dashboard"
          className="text-lg font-semibold tracking-tight text-slate-950"
        >
          ConceptIdentify
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-3 text-sm">

          <Link
            href="/dashboard"
            className="ci-button-secondary min-h-0 rounded-full px-4 py-2 text-sm"
          >
            Dashboard
          </Link>

          <Link
            href="/profile"
            className="ci-button-secondary min-h-0 rounded-full px-4 py-2 text-sm"
          >
            Profile
          </Link>

          <span className="ci-badge ci-badge-neutral hidden sm:inline-flex">

            {user.first_name} {user.last_name}

          </span>

          <button
            onClick={() =>
              setLogoutConfirmOpen(true)
            }
            className="ci-button-danger min-h-0 rounded-full px-4 py-2 text-sm"
          >
            Logout
          </button>

        </div>

      </div>

      <ConfirmDialog
        open={logoutConfirmOpen}
        title="Log Out"
        description="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        cancelText="Cancel"
        danger={false}
        loading={loggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={() =>
          setLogoutConfirmOpen(false)
        }
      />

    </nav>

  );

}
