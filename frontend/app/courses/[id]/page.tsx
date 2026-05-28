"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";

import Link from "next/link";
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
type Topic = {
  id: number;
  name: string;
  description: string;
  material_count: number;
  question_count: number;
};



export default function CourseDetailPage() {

  const params = useParams();

  const [course, setCourse] =
    useState<Course | null>(null);
    const [topics, setTopics] =
  useState<Topic[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchCourse();

  }, []);

  const fetchCourse = async () => {

    try {

        const [
            courseResponse,
            topicsResponse,
        ] = await Promise.all([

            api.get(
            `/courses/${params.id}/`
            ),


            api.get(
            `/courses/${params.id}/topics/`
            ),

        ]);

        setCourse(
            courseResponse.data.data
        );


        setTopics(
            topicsResponse.data.data
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

<div>

  <div className="mb-6 flex items-center justify-between">

    <h2 className="text-3xl font-bold">
      Topics
    </h2>

  </div>

  {topics.length === 0 ? (

    <div className="rounded-xl border p-6 text-gray-500">

      No topics available.

    </div>

  ) : (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {topics.map((topic) => (

        <div
          key={topic.id}
          className="rounded-xl border p-6 shadow-sm transition hover:shadow-md">

          <h3 className="text-2xl font-semibold">
            {topic.name}
          </h3>

          <p className="mt-2 text-gray-600">
            {topic.description || "No description"}
          </p>

          <div className="mt-4 space-y-1 text-sm text-gray-500">

            <p>
              Materials: {topic.material_count}
            </p>

            <p>
              Questions: {topic.question_count}
            </p>

          </div>
            <div className="mt-6 grid gap-3">

                <Link
                    href={`/courses/${params.id}/topics/${topic.id}/create`}
                    className="rounded-lg border bg-black px-4 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
                >

                    Create Questions

                </Link>

                <Link
                    href={`/courses/${params.id}/topics/${topic.id}/questions`}
                    className="rounded-lg border px-4 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
                >

                    Question Bank

                </Link>

                <Link
                    href={`/courses/${params.id}/topics/${topic.id}/analytics`}
                    className="rounded-lg border px-4 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
                >

                    Analytics

                </Link>

                </div>

        </div>

      ))}

    </div>

  )}

</div>

</div>
  );
}