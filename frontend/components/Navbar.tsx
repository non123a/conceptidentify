"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Navbar() {

  const {
    user,
    logout,
  } = useAuth();

  const [logoutConfirmOpen, setLogoutConfirmOpen] =
    useState(false);
  const [loggingOut, setLoggingOut] =
    useState(false);

  const handleConfirmLogout = async () => {

    try {

      setLoggingOut(true);

      await logout();

    } finally {

      setLoggingOut(false);
      setLogoutConfirmOpen(false);

    }
  };

  if (!user) {
    return null;
  }

  return (

    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">

        <Link
          href="/dashboard"
          className="text-lg font-bold tracking-tight text-gray-900"
        >
          ConceptIdentify
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-3 text-sm">

          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            href="/profile"
            className="rounded-lg px-3 py-2 font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            Profile
          </Link>

          <span className="hidden text-sm text-gray-500 sm:inline">

            {user.first_name} {user.last_name}

          </span>

          <button
            onClick={() =>
              setLogoutConfirmOpen(true)
            }
            className="ci-button-danger min-h-0 px-4 py-2"
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
