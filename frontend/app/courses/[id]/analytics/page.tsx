// app/courses/[id]/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type WeakQuestion = {
  text: string;
  accuracy: number;
};

type TopicAnalytics = {
  topic: string;
  topic_id: number;
  performance: number;
  completion_rate: number;
  students_answered: number;
  total_students: number;
  has_data: boolean;
  is_weak: boolean;
  error_rate: number;
  weak_questions: WeakQuestion[];
};

type StudentHelp = {
  student: string;
  topic: string;
  performance: number;
};

export default function AnalyticsPage() {

  const params = useParams();

  const [loading, setLoading] =
    useState(true);

  const [courseName, setCourseName] =
    useState("");

  const [topics, setTopics] =
    useState<TopicAnalytics[]>([]);

  const [studentsNeedingHelp, setStudentsNeedingHelp] =
    useState<StudentHelp[]>([]);

    const chartData = topics.map(
  (topic) => ({
    topic: topic.topic,
    performance: topic.performance,
    completion: topic.completion_rate,
  })
);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

    try {

      const response = await api.get(
        `/courses/${params.id}/lecturer-analytics/`
      );

      setCourseName(
        response.data.course.name
      );

      setTopics(
        response.data.topics
      );

      setStudentsNeedingHelp(
        response.data.students_needing_help
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

  const weakTopics =
    topics.filter(
      topic => topic.is_weak
    );

  return (

    <div className="ci-page">

      {/* Header */}

      <h1 className="text-3xl font-bold">
        {courseName} - Class Learning Analysis
      </h1>

      <p className="mt-3 text-gray-600">
        This dashboard shows overall topic performance
        and students who may need additional support.
      </p>

      {/* Attention Section */}

      <div className="mt-8 rounded-xl border p-6">

        <h2 className="mb-4 text-xl font-bold">
          ⚠ Topics Requiring Attention
        </h2>

        {weakTopics.length === 0 ? (

          <p className="text-green-600">
            All topics are performing well.
          </p>

        ) : (

          <div className="space-y-5">

            {weakTopics.map((topic) => (

              <div key={topic.topic_id}>

                <p className="font-semibold text-red-600">

                  {topic.topic}

                </p>

                <p className="text-sm text-gray-500">

                  {topic.students_answered}/
                  {topic.total_students}
                  {" "}students answered

                </p>

                <p className="text-sm text-gray-500">

                  {topic.error_rate}% incorrect responses

                </p>

                {topic.weak_questions.map(
                  (question, index) => (

                    <p
                      key={index}
                      className="ml-4 text-sm text-gray-500"
                    >
                      • {question.text}
                      {" "}
                      ({question.accuracy}%)
                    </p>

                  )
                )}

              </div>

            ))}

          </div>

        )}

      </div>

      {/* KPI Cards */}

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <div className="rounded-xl border p-6 text-center">

          <h3 className="text-lg font-medium">
            Weak Topics
          </h3>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {weakTopics.length}
          </p>

        </div>

        <div className="rounded-xl border p-6 text-center">

          <h3 className="text-lg font-medium">
            Students Needing Help
          </h3>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {studentsNeedingHelp.length}
          </p>

        </div>

      </div>

      {/* Topic Participation */}

      <div className="mt-8 rounded-xl border p-6">

        <h2 className="mb-4 text-xl font-bold">
          Topic Participation
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="py-3 text-left">
                  Topic
                </th>
                <th className="py-3 text-left">
                    Action
                </th>

                <th className="py-3 text-left">
                  Performance
                </th>

                <th className="py-3 text-left">
                  Completion
                </th>

                <th className="py-3 text-left">
                  Students
                </th>

              </tr>

            </thead>

            <tbody>

              {topics.map((topic) => (

                <tr
                  key={topic.topic_id}
                  className="border-b"
                >

                    <td className="py-3">
                        {topic.topic}
                    </td>
                    {/* <td className="py-3">

                        <Link
                            href={`/courses/${params.id}/topics/${topic.topic_id}/analytics`}
                            className="font-medium text-blue-600 hover:underline"
                        >
                            {topic.topic}
                        </Link>

                    </td> */}
                    <td className="py-3">

                        <Link
                            href={`/courses/${params.id}/topics/${topic.topic_id}/analytics`}
                            className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
                        >
                            View Analytics
                        </Link>

                    </td>

                  <td className="py-3">
                    {topic.performance}%
                  </td>

                  <td className="py-3">
                    {topic.completion_rate}%
                  </td>

                  <td className="py-3">
                    {topic.students_answered}/
                    {topic.total_students}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    <div className="mt-8 rounded-xl border p-6">

    <h2 className="mb-6 text-xl font-bold">
        Topic Performance Overview
    </h2>

    <div className="h-[450px]">

        <ResponsiveContainer
        width="100%"
        height="100%"
        >

        <ComposedChart
            data={chartData}
        >

            <CartesianGrid
            strokeDasharray="3 3"
            />

            <XAxis
            dataKey="topic"
            />

            <YAxis
            domain={[0, 100]}
            />

            <Tooltip />

            <Legend />

            <Bar
            dataKey="performance"
            name="Performance %"
            />

            <Line
            type="monotone"
            dataKey="completion"
            name="Completion %"
            />

        </ComposedChart>

        </ResponsiveContainer>

    </div>

    </div>
      {/* Students Needing Help */}

      <div className="mt-8 rounded-xl border p-6">

        <h2 className="mb-4 text-xl font-bold">
          👥 Students Needing Help
        </h2>

        {studentsNeedingHelp.length === 0 ? (

          <p className="text-gray-500">
            No students currently need intervention.
          </p>

        ) : (

          <div className="space-y-3">

            {studentsNeedingHelp.map(
              (student, index) => (

                <div
                  key={index}
                  className="rounded border p-4"
                >

                  <p>

                    <strong>
                      {student.student}
                    </strong>

                    {" "}is struggling with{" "}

                    <strong>
                      {student.topic}
                    </strong>

                    {" "}({student.performance}%)

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );
}