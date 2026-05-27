"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-red-500">
        Not logged in
      </div>
    );
  }

  return (
    <div className="p-10">

      <h1 className="mb-6 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="rounded border p-6">

        <p>
          <strong>Name:</strong>{" "}
          {user.first_name} {user.last_name}
        </p>

        <p>
          <strong>Username:</strong>{" "}
          {user.username}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user.email}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {user.role}
        </p>

      </div>

    </div>
  );
}