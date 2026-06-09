"use client";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {

  const { user } = useAuth();

  if (!user) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );

  }

  return (

    <div className="mx-auto max-w-3xl p-10">

      <h1 className="mb-8 text-4xl font-bold">

        My Profile

      </h1>

      <div className="rounded-xl border p-6 shadow-sm">

        <div className="mb-5">

          <p className="text-sm text-gray-500">

            Full Name

          </p>

          <p className="font-semibold">

            {user.first_name} {user.last_name}

          </p>

        </div>

        <div className="mb-5">

          <p className="text-sm text-gray-500">

            Username

          </p>

          <p className="font-semibold">

            {user.username}

          </p>

        </div>

        <div className="mb-5">

          <p className="text-sm text-gray-500">

            Email

          </p>

          <p className="font-semibold">

            {user.email}

          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">

            Role

          </p>

          <p className="font-semibold capitalize">

            {user.role}

          </p>

        </div>

      </div>

    </div>

  );

}