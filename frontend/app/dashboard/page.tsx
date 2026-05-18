"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userResponse = await api.get("/me/");
        setUser(userResponse.data);

        // Fetch courses
        const courseResponse = await api.get("/courses/");
        setCourses(courseResponse.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="mb-4 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="mb-8 rounded border p-6">
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

      <h2 className="mb-4 text-2xl font-bold">
        My Courses
      </h2>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded border p-5 shadow-sm"
          >
            <h3 className="text-xl font-semibold">
              {course.name}
            </h3>

            <p className="mt-2 text-gray-600">
              {course.description}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Join Code: {course.join_code}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}