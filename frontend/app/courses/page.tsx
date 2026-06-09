"use client";

import { useEffect, useState } from "react";

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

export default function CoursesPage() {

  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);

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

    } finally {

      setLoading(false);

    }
  };

  if (loading) {

    return (
      <div className="ci-page">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="ci-page">

      <h1 className="mb-8 text-3xl font-bold">
        My Courses
      </h1>

      <div className="grid gap-6">

        {courses.map((course) => (

          <div
            key={course.id}
            className="ci-card p-6"
          >

            <h2 className="text-xl font-semibold">
              {course.name}
            </h2>

            <p className="mt-2 text-gray-600">
              {course.description || "No description"}
            </p>

            <div className="mt-4 space-y-1 text-sm text-gray-500">

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

        ))}

      </div>

    </div>
  );
}