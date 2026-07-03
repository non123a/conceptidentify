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

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    void Promise.resolve().then(fetchCourses);

  }, []);

  if (loading) {

    return (
      <div className="ci-loading-state ci-page min-h-[calc(100vh-73px)]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
        <p className="text-sm font-medium text-slate-600">
          Loading courses...
        </p>
      </div>
    );
  }

  return (
    <div className="ci-page space-y-8">

      <h1 className="ci-title">
        My Courses
      </h1>

      {courses.length === 0 ? (

        <div className="ci-empty-state">

          <p className="text-base font-semibold text-slate-950">
            No courses available yet.
          </p>
          <p className="text-sm text-slate-600">
            Join a course or create one from the dashboard.
          </p>

        </div>

      ) : (

        <div className="grid gap-6">

          {courses.map((course) => (

          <div
            key={course.id}
            className="ci-card ci-card-hover p-6 transition-all duration-300 hover:-translate-y-1"
          >

            <h2 className="text-lg font-semibold text-slate-950">
              {course.name}
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              {course.description || "No description"}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-500">

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

      )}

    </div>
  );
}