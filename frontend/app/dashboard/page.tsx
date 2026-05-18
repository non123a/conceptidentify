"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/me/");
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="mb-4 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="rounded border p-6">
        <p>
          <strong>Name:</strong> {user.full_name}
        </p>

        <p>
          <strong>Username:</strong> {user.username}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </div>
  );
}