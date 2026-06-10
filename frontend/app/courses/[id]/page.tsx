"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import Link from "next/link";
import Toast from "@/components/ui/Toast";
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
const [notification, setNotification] =
  useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
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


    setNotification({
      type: "error",
      message: "Topic name is required",
    });

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
    setNotification({
      type: "success",
      message: "Topic created successfully.",
    });
    fetchCourse();

  } catch (error) {

    console.error(error);

    setNotification({
      type: "error",
      message: "Failed to create topic.",
    });
  }
};


  useEffect(() => {

    void Promise.resolve().then(fetchCourse);

  }, []);
  useEffect(() => {

  if (!notification) return;

  const timer = setTimeout(() => {

    setNotification(null);

  }, 3000);

  return () => clearTimeout(timer);

}, [notification]);
  
  if (loading) {

    return (
      <div className="ci-page">
        Loading course...
      </div>
    );
  }

  if (!course) {

    return (
      <div className="ci-page text-red-600">
        Course not found
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

  <div className="mb-10">

    <h1 className="text-3xl font-bold">
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

      <h2 className="mb-4 text-xl font-bold">

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

                    <span className="text-amber-600">

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
        className="ci-button-primary"
      >
        Class Analytics
      </Link>
    )}

    {/* {user?.role === "student" && (
      <Link
        href={`/courses/${params.id}/student-analytics`}
        className="ci-button-primary"
      >
        My Analytics
      </Link>
    )} */}

    {user?.role === "lecturer" && (
      <button
        onClick={() =>
          setShowCreateTopicModal(true)
        }
        className="ci-button-primary"
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
          className="ci-card ci-card-hover p-6 transition">

          <h3 className="text-xl font-semibold">
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
                    className="ci-button-primary text-center"
                >

                    Create Questions

                </Link>

                <Link
                    href={`/courses/${params.id}/topics/${topic.id}/questions`}
                    className="ci-button-secondary text-center"
                >

                    Question Bank

                </Link>

                <Link
                    href={`/courses/${params.id}/topics/${topic.id}/analytics`}
                    className="ci-button-secondary text-center"
                >

                    Analytics

                </Link>

                </>
              ) : (
                <><Link
                  href={`/courses/${params.id}/topics/${topic.id}`}
                  className="ci-button-primary text-center"
                >

                  Answer Questions

                </Link><Link
                  href={`/courses/${params.id}/topics/${topic.id}/student-analytics`}
                  className="ci-button-secondary text-center"
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

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-6">

    <div className="ci-card w-full max-w-md p-6">

      <h2 className="mb-4 text-xl font-bold">
        Create Topic
      </h2>

      <input
        placeholder="Topic Name"
        className="mb-3 ci-input"
        value={topicName}
        onChange={(e) =>
          setTopicName(e.target.value)
        }
      />

      <textarea
        placeholder="Description"
        className="mb-4 ci-input"
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
          className="ci-button-secondary"
        >
          Cancel
        </button>

        <button
          onClick={createTopic}
          className="ci-button-primary"
        >
          Create
        </button>

      </div>

    </div>

  </div>

)}
</div>
</>
  );
}
