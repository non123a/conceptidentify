"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";

type Course = {
  id: number;
  name: string;
  description: string;
  join_code: string;

  lecturer: {
    first_name: string;
    last_name: string;
  };

  student_count: number;
};

export default function CourseDetailPage() {

  const params = useParams();

  const [course, setCourse] =
    useState<Course | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchCourse();

  }, []);

  const fetchCourse = async () => {

    try {

      const response = await api.get(
        `/courses/${params.id}/`
      );

      setCourse(
        response.data.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {

    return (
      <div className="p-10">
        Loading course...
      </div>
    );
  }

  if (!course) {

    return (
      <div className="p-10 text-red-500">
        Course not found
      </div>
    );
  }

  return (
    <div className="p-10">

  <div className="mb-10">

    <h1 className="text-4xl font-bold">
      {course.name}
    </h1>

    <p className="mt-4 text-gray-600">
      {course.description || "No description"}
    </p>

    <div className="mt-6 space-y-2 text-sm text-gray-500">

      <p>
        Lecturer:{" "}
        {course.lecturer.first_name}{" "}
        {course.lecturer.last_name}
      </p>

      <p>
        Join Code: {course.join_code}
      </p>

      <p>
        Students: {course.student_count}
      </p>

    </div>

  </div>

  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

    <div className="rounded-xl border p-6 shadow-sm">

      <h2 className="text-2xl font-semibold">
        Materials
      </h2>

      <p className="mt-2 text-gray-600">
        Access lecture materials and documents.
      </p>

    </div>

    <div className="rounded-xl border p-6 shadow-sm">

      <h2 className="text-2xl font-semibold">
        Quizzes
      </h2>

      <p className="mt-2 text-gray-600">
        View and complete course quizzes.
      </p>

    </div>

    <div className="rounded-xl border p-6 shadow-sm">

      <h2 className="text-2xl font-semibold">
        AI Assistant
      </h2>

      <p className="mt-2 text-gray-600">
        Generate concepts and learning insights.
      </p>

    </div>

    <div className="rounded-xl border p-6 shadow-sm">

      <h2 className="text-2xl font-semibold">
        Analytics
      </h2>

      <p className="mt-2 text-gray-600">
        Track learning performance and engagement.
      </p>

    </div>

  </div>

</div>
  );
}