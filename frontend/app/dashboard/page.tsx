"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


import api from "@/lib/api";
import Toast from "@/components/ui/Toast";
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
const [notification, setNotification] =
  useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
const [courseDescription, setCourseDescription] =
  useState("");
  async function fetchCourses() {

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
  }

  useEffect(() => {

    void Promise.resolve().then(fetchCourses);

  }, []);
  const createCourse = async () => {
    if (!courseName.trim()) {

      setNotification({
        type: "error",
        message: "Course name is required",
      });

      return;
    } try {

    const response = await api.post(
      "/courses/create/",
      {
        name: courseName,
        description: courseDescription,
      }
    );

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

    setNotification({
      type: "error",
      message: "Failed to create course",
    });
  }
};
const joinCourse = async () => {

  if (!joinCode.trim()) {

    setNotification({
      type: "error",
      message: "Join code is required",
    });

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

    setNotification({
      type: "error",
      message: "Failed to join course",
    });
  }
};
  if (loading) {
    return (
      <div className="ci-loading-state ci-page min-h-[calc(100vh-73px)]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
        <p className="text-sm font-medium text-slate-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ci-empty-state ci-page min-h-[calc(100vh-73px)]">
        <p className="text-base font-semibold text-slate-950">
          Not logged in
        </p>
        <p className="text-sm text-slate-600">
          Please sign in again to access the dashboard.
        </p>
      </div>
    );
  }

  return (
    <>
    {notification && (

    <Toast
      message={notification.message}
      type={notification.type}
    />

  )}
    <div className="ci-page space-y-8">

      <h1 className="ci-title">
        Dashboard
      </h1>

      <div className="ci-card p-6 sm:p-8">

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Name</p>
            <p className="mt-1 text-base font-semibold text-slate-950">
              {user.first_name} {user.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Username</p>
            <p className="mt-1 text-base font-semibold text-slate-950">
              {user.username}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Email</p>
            <p className="mt-1 text-base font-semibold text-slate-950 break-all">
              {user.email}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Role</p>
            <p className="mt-1">
              <span className="ci-badge ci-badge-neutral">{user.role}</span>
            </p>
          </div>
        </div>

      </div>
      <div className="mt-10">

        <div className="flex gap-3">

          {user.role === "lecturer" && (

            <button
              onClick={() =>
                setShowCreateModal(true)
              }
              className="ci-button-primary"
            >
              + Create Course
            </button>

          )}

          {user.role === "student" && (

            <button
              onClick={() =>
                setShowJoinModal(true)
              }
              className="ci-button-primary"
            >
              + Join Course
            </button>

          )}

        </div>

        {courses.length === 0 ? (

          <div className="ci-empty-state">

            <p className="text-base font-semibold text-slate-950">
              No courses found.
            </p>
            <p className="text-sm text-slate-600">
              Create a course or join one to see it here.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {courses.map((course) => (

              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="ci-card ci-card-hover p-6 transition-all duration-300 hover:-translate-y-1"
              >

                <h3 className="text-lg font-semibold text-slate-950">
                  {course.name}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {course.description || "No description"}
                </p>

                <p className="mt-4 text-sm text-slate-500">
                  Join Code: {course.join_code}
                </p>

              </Link>

            ))}

          </div>

        )}

      </div>
{showCreateModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-6 backdrop-blur-sm">

    <div className="ci-card w-full max-w-md rounded-3xl p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">

      <h2 className="mb-4 text-xl font-semibold text-slate-950">
        Create Course
      </h2>

      <input
        placeholder="Course Name"
        className="mb-3 ci-input"
        value={courseName}
        onChange={(e) =>
          setCourseName(e.target.value)
        }
      />

      <textarea
        placeholder="Description"
        className="mb-4 ci-input"
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
          className="ci-button-secondary"
        >
          Cancel
        </button>

        <button
          onClick={createCourse}
          className="ci-button-primary"
        >
          Create
        </button>

      </div>

    </div>

  </div>

)
}
{showJoinModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-6 backdrop-blur-sm">

    <div className="ci-card w-full max-w-md rounded-3xl p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">

      <h2 className="mb-4 text-xl font-semibold text-slate-950">
        Join Course
      </h2>

      <input
        placeholder="Join Code"
        className="mb-4 ci-input"
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
          className="ci-button-secondary"
        >
          Cancel
        </button>

        <button
          onClick={joinCourse}
          className="ci-button-primary"
        >
          Join
        </button>

      </div>

    </div>

  </div>

)}
    </div>
    </>
  );
}