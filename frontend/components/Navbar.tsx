"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {

  const {
    user,
    logout,
  } = useAuth();

  if (!user) {
    return null;
  }

  return (

    <nav className="border-b bg-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/dashboard"
          className="text-xl font-bold"
        >
          ConceptIdentify
        </Link>

        <div className="flex items-center gap-6">

          <Link
            href="/dashboard"
            className="hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            href="/profile"
            className="hover:text-blue-600"
          >
            Profile
          </Link>

          <span className="text-sm text-gray-500">

            {user.first_name} {user.last_name}

          </span>

          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>

  );

}