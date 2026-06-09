
"use client";
import RoleGuard from "@/components/RoleGuard";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";

type Topic = {
  id: number;
  name: string;
  description: string;
};
type Analytics = {
  topic: string;
  completion_rate: number;
  performance: number;
  has_data: boolean;
  is_weak: boolean;

  students_struggling: number;

  struggling_students: {
    student: string;
    performance: number;
  }[];

  student_distribution: {
    strong: number;
    average: number;
    weak: number;
  };

  question_performance: {
    id: number;
    text: string;
    attempted: number;
    correct: number;
    incorrect: number;
    accuracy: number;
    is_weak: boolean;
  }[];

  weak_questions: {
    text: string;
    accuracy: number;
  }[];
};
export default function AnalyticsPage() {

  const params = useParams();

const [topic, setTopic] =
  useState<Topic | null>(null);

const [analytics, setAnalytics] =
  useState<Analytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchPage();

  }, []);

  // const fetchPage = async () => {

  //   try {

  //     const response = await api.get(
  //       `/topics/${params.topicId}/`
  //     );

  //     setTopic(
  //       response.data.data
  //     );

  //   } catch (error) {

  //     console.error(error);

  //   } finally {

  //     setLoading(false);

  //   }
  // };
const fetchPage = async () => {

  try {

    const response = await api.get(
      `/topics/${params.topicId}/analytics/`
    );

    setTopic(
      response.data.topic
    );

    setAnalytics(
      response.data.analytics
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
        Loading analytics...
      </div>
    );
  }

  if (!topic) {

    return (
      <div className="ci-page text-red-600">
        Topic not found
      </div>
    );
  }

  return (
    <RoleGuard allowedRole="lecturer">
<div className="ci-page">

  <div className="mb-10">

    <h1 className="text-3xl font-bold">
      Topic Analytics
    </h1>

    <p className="mt-3 text-gray-600">
      {topic.name}
    </p>

  </div>

  {/* SUMMARY */}

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <div className="ci-card p-6">

      <h2 className="text-lg font-semibold">
        Performance
      </h2>

      <p className="mt-4 text-3xl font-bold">
        {analytics?.performance}%
      </p>

    </div>

    <div className="ci-card p-6">

      <h2 className="text-lg font-semibold">
        Completion Rate
      </h2>

      <p className="mt-4 text-3xl font-bold">
        {analytics?.completion_rate}%
      </p>

    </div>

    <div className="ci-card p-6">

      <h2 className="text-lg font-semibold">
        Students Struggling
      </h2>

      <p className="mt-4 text-3xl font-bold">
        {analytics?.students_struggling}
      </p>

    </div>

    <div className="ci-card p-6">

      <h2 className="text-lg font-semibold">
        Weak Questions
      </h2>

      <p className="mt-4 text-3xl font-bold">
        {analytics?.weak_questions.length}
      </p>

    </div>

  </div>

  {/* DISTRIBUTION */}

  <div className="mt-10 rounded-xl border p-6">

    <h2 className="mb-6 text-xl font-bold">

      Student Distribution

    </h2>

    <div className="grid gap-6 md:grid-cols-3">

      <div className="rounded border p-5 text-center">

        <p className="text-sm text-gray-500">

          Strong

        </p>

        <p className="mt-2 text-3xl font-bold">

          {analytics?.student_distribution.strong}

        </p>

      </div>

      <div className="rounded border p-5 text-center">

        <p className="text-sm text-gray-500">

          Average

        </p>

        <p className="mt-2 text-3xl font-bold">

          {analytics?.student_distribution.average}

        </p>

      </div>

      <div className="rounded border p-5 text-center">

        <p className="text-sm text-gray-500">

          Weak

        </p>

        <p className="mt-2 text-3xl font-bold">

          {analytics?.student_distribution.weak}

        </p>

      </div>

    </div>

  </div>

  {/* STRUGGLING STUDENTS */}

  <div className="mt-10 rounded-xl border p-6">

    <h2 className="mb-6 text-xl font-bold">

      Students Needing Help

    </h2>

    {analytics?.struggling_students.length === 0 ? (

      <p className="text-gray-500">

        No students currently need intervention.

      </p>

    ) : (

      <div className="space-y-3">

        {analytics?.struggling_students.map(
          (student, index) => (

            <div
              key={index}
              className="rounded border p-4"
            >

              <strong>

                {student.student}

              </strong>

              {" "}({student.performance}%)

            </div>

          )
        )}

      </div>

    )}

  </div>

  {/* QUESTION PERFORMANCE */}

  <div className="mt-10 rounded-xl border p-6">

    <h2 className="mb-6 text-xl font-bold">

      Question Performance

    </h2>

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="py-3 text-left">

              Question

            </th>

            <th className="py-3 text-left">

              Accuracy

            </th>

            <th className="py-3 text-left">

              Attempted

            </th>

            <th className="py-3 text-left">

              Correct

            </th>

            <th className="py-3 text-left">

              Incorrect

            </th>

          </tr>

        </thead>

        <tbody>

          {analytics?.question_performance.map(
            (question) => (

              <tr
                key={question.id}
                className="border-b"
              >

                <td className="py-3">

                  {question.text}

                </td>

                <td className="py-3">

                  {question.accuracy}%

                </td>

                <td className="py-3">

                  {question.attempted}

                </td>

                <td className="py-3">

                  {question.correct}

                </td>

                <td className="py-3">

                  {question.incorrect}

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  </div>

</div>
    </RoleGuard>
  );
}

