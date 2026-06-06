"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

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

type StudentAnalytics = {
  topic: string;
  performance: number;
  has_data: boolean;
};



export default function CourseDetailPage() {

  const params = useParams();
  const { user } = useAuth();

  const [course, setCourse] =
    useState<Course | null>(null);
    const [topics, setTopics] =
  useState<Topic[]>([]);

  const [loading, setLoading] =
    useState(true);
  const [showCreateTopicModal, setShowCreateTopicModal] =
  useState(false);
const [studentAnalytics, setStudentAnalytics] =
  useState<StudentAnalytics[]>([]);
const [topicName, setTopicName] =
  useState("");

const [topicDescription, setTopicDescription] =
  useState("");
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
        if (user?.role === "student") {

          const analyticsResponse =
            await api.get(
              `/courses/${params.id}/student-analytics/`
            );

          setStudentAnalytics(
            analyticsResponse.data.analytics
          );

        }

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
  const createTopic = async () => {

  if (!topicName.trim()) {

    alert(
      "Topic name is required"
    );

    return;
  }

  try {

    await api.post(
      `/courses/${params.id}/topics/create/`,
      {
        name: topicName,
        description: topicDescription,
      }
    );

    setShowCreateTopicModal(false);

    setTopicName("");
    setTopicDescription("");

    fetchCourse();

  } catch (error) {

    console.error(error);

    alert(
      "Failed to create topic"
    );
  }
};
  useEffect(() => {

    void Promise.resolve().then(fetchCourse);

  }, []);
  
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
  {user?.role === "student" && (

    <div className="mb-8 rounded-xl border p-6 shadow-sm">

      <h2 className="mb-4 text-2xl font-bold">

        My Learning Progress

      </h2>

      {studentAnalytics.length === 0 ? (

        <p className="text-gray-500">

          No learning data available yet.

        </p>

      ) : (

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left">
                Topic
              </th>

              <th className="py-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {studentAnalytics.map((topic) => (

              <tr
                key={topic.topic}
                className="border-b"
              >

                <td className="py-3">

                  {topic.topic}

                </td>

                <td className="py-3">

                  {!topic.has_data ? (

                    <span className="text-gray-500">

                      No Data Yet

                    </span>

                  ) : topic.performance < 40 ? (

                    <span className="text-red-600">

                      ❌ Weak

                    </span>

                  ) : topic.performance < 70 ? (

                    <span className="text-yellow-600">

                      ⚠ Needs Improvement

                    </span>

                  ) : (

                    <span className="text-green-600">

                      ✔ Strong

                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      )}

    </div>

  )}
  <div className="mb-6 flex items-center justify-between">

  <h2 className="text-3xl font-bold">
    Topics
  </h2>

  <div className="flex gap-3">

    {user?.role === "lecturer" && (
      <Link
        href={`/courses/${params.id}/analytics`}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Class Analytics
      </Link>
    )}

    {user?.role === "student" && (
      <Link
        href={`/courses/${params.id}/student-analytics`}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        My Analytics
      </Link>
    )}

    {user?.role === "lecturer" && (
      <button
        onClick={() =>
          setShowCreateTopicModal(true)
        }
        className="rounded bg-black px-4 py-2 text-white"
      >
        + Create Topic
      </button>
    )}

  </div>

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

              {user?.role === "lecturer" ? (
                <>

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

                </>
              ) : (
                <><Link
                  href={`/courses/${params.id}/topics/${topic.id}`}
                  className="rounded-lg border bg-black px-4 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
                >

                  Answer Questions

                </Link><Link
                  href={`/courses/${params.id}/topics/${topic.id}/student-analytics`}
                  className="rounded-lg border px-4 py-3 text-center text-sm font-medium"
                >
                    My Performance
                  </Link></>
              )}

                </div>

        </div>

      ))}

    </div>

  )}

</div>
{showCreateTopicModal && (

  <div className="fixed inset-0 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-md rounded bg-white p-6">

      <h2 className="mb-4 text-xl font-bold">
        Create Topic
      </h2>

      <input
        placeholder="Topic Name"
        className="mb-3 w-full rounded border p-3"
        value={topicName}
        onChange={(e) =>
          setTopicName(e.target.value)
        }
      />

      <textarea
        placeholder="Description"
        className="mb-4 w-full rounded border p-3"
        value={topicDescription}
        onChange={(e) =>
          setTopicDescription(
            e.target.value
          )
        }
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() =>
            setShowCreateTopicModal(false)
          }
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>

        <button
          onClick={createTopic}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Create
        </button>

      </div>

    </div>

  </div>

)}
</div>
  );
}
