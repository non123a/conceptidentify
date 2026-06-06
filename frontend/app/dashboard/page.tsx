"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

const [showCreateModal, setShowCreateModal] =
  useState(false);
const [showJoinModal, setShowJoinModal] =
  useState(false);

const [joinCode, setJoinCode] =
  useState("");
const [courseName, setCourseName] =
  useState("");

const [courseDescription, setCourseDescription] =
  useState("");
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
  const createCourse = async () => {
    if (!courseName.trim()) {

      alert(
        "Course name is required"
      );

      return;
    } try {

    const response = await api.post(
      "/courses/create/",
      {
        name: courseName,
        description: courseDescription,
      }
    );

    // const courseId =
    //   response.data.data.id;

    // router.push(
    //   `/courses/${courseId}`
    // );
    const courseId =
      response.data.data.id;

    setShowCreateModal(false);

    setCourseName("");
    setCourseDescription("");

    router.push(
      `/courses/${courseId}`
    );

  } catch (error) {

    console.error(error);

    alert(
      "Failed to create course"
    );
  }
};
const joinCourse = async () => {

  if (!joinCode.trim()) {

    alert(
      "Join code is required"
    );

    return;
  }

  try {

    await api.post(
      "/courses/join/",
      {
        join_code: joinCode,
      }
    );

    setShowJoinModal(false);

    setJoinCode("");

    fetchCourses();

  } catch (error) {

    console.error(error);

    alert(
      "Failed to join course"
    );
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
    console.log("Dashboard: user is null");
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

        <div className="flex gap-3">

          {user.role === "lecturer" && (

            <button
              onClick={() =>
                setShowCreateModal(true)
              }
              className="rounded bg-black px-4 py-2 text-white"
            >
              + Create Course
            </button>

          )}

          {user.role === "student" && (

            <button
              onClick={() =>
                setShowJoinModal(true)
              }
              className="rounded bg-black px-4 py-2 text-white"
            >
              + Join Course
            </button>

          )}

        </div>

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
{showCreateModal && (

  <div className="fixed inset-0 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-md rounded bg-white p-6">

      <h2 className="mb-4 text-xl font-bold">
        Create Course
      </h2>

      <input
        placeholder="Course Name"
        className="mb-3 w-full rounded border p-3"
        value={courseName}
        onChange={(e) =>
          setCourseName(e.target.value)
        }
      />

      <textarea
        placeholder="Description"
        className="mb-4 w-full rounded border p-3"
        value={courseDescription}
        onChange={(e) =>
          setCourseDescription(
            e.target.value
          )
        }
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() =>
            setShowCreateModal(false)
          }
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>

        <button
          onClick={createCourse}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Create
        </button>

      </div>

    </div>

  </div>

)
}
{showJoinModal && (

  <div className="fixed inset-0 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-md rounded bg-white p-6">

      <h2 className="mb-4 text-xl font-bold">
        Join Course
      </h2>

      <input
        placeholder="Join Code"
        className="mb-4 w-full rounded border p-3"
        value={joinCode}
        onChange={(e) =>
          setJoinCode(e.target.value)
        }
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() =>
            setShowJoinModal(false)
          }
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>

        <button
          onClick={joinCourse}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Join
        </button>

      </div>

    </div>

  </div>

)}
    </div>
    
  );
}