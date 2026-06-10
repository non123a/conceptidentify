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
      <div className="ci-page">
        Loading...
      </div>
    );
  }

  if (!user) {
    console.log("Dashboard: user is null");
    return (
      <div className="ci-page text-red-600">
        Not logged in
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
    <div className="ci-page">

      <h1 className="mb-6 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="ci-card p-6">

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

          <div className="rounded border p-6 text-gray-500">

            No courses found.

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {courses.map((course) => (

              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="ci-card ci-card-hover p-6 transition"
              >

                <h3 className="text-xl font-semibold">
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

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-6">

    <div className="ci-card w-full max-w-md p-6">

      <h2 className="mb-4 text-xl font-bold">
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

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-6">

    <div className="ci-card w-full max-w-md p-6">

      <h2 className="mb-4 text-xl font-bold">
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