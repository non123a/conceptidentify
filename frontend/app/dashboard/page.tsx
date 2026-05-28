"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";


import api from "@/lib/api";
type Course = {
  id: number;
  name: string;
  description: string;
  join_code: string;
};
export default function DashboardPage() {

  const { user, loading } = useAuth();
  const [courses, setCourses] =
    useState<Course[]>([]);
  useEffect(() => {

    fetchCourses();

  }, []);

  const fetchCourses = async () => {

    try {

      const response = await api.get(
        "/courses/"
      );

      setCourses(
        response.data.data
      );

    } catch (error) {

      console.error(error);

    }
  };
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
      <div className="mt-10">

        <h2 className="mb-6 text-2xl font-bold">
          My Courses
        </h2>

        {courses.length === 0 ? (

          <div className="rounded border p-6 text-gray-500">

            No courses found.

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {courses.map((course) => (

              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="rounded-xl border p-6 shadow-sm transition hover:shadow-md"
              >

                <h3 className="text-2xl font-semibold">
                  {course.name}
                </h3>

                <p className="mt-2 text-gray-600">
                  {course.description || "No description"}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  Join Code: {course.join_code}
                </p>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>
    
  );
}