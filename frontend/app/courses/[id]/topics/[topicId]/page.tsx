"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Topic = {
  id: number;
  name: string;
  description: string;
  material_count: number;
  question_count: number;
};

type DiagnosticStatus = {
  isCompleted: boolean;
  totalResponses: number;
  loading: boolean;
  error: string | null;
};

export default function TopicPage() {

  const params = useParams();
  const { user } = useAuth();

  const [topic, setTopic] =
    useState<Topic | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [diagnosticStatus, setDiagnosticStatus] =
    useState<DiagnosticStatus>({
      isCompleted: false,
      totalResponses: 0,
      loading: true,
      error: null,
    });

  // ====================================
  // FETCH TOPIC DATA
  // ====================================

  const fetchTopic = async () => {

    try {

        const [
        topicResponse,
        ] = await Promise.all([

        api.get(
            `/topics/${params.topicId}/`
        ),

        ]);

        setTopic(
        topicResponse.data.data
        );

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }
  };

  // ====================================
  // CHECK DIAGNOSTIC QUIZ STATUS
  // ====================================

  const checkDiagnosticStatus = async () => {
    try {
      setDiagnosticStatus((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const response = await api.get(
        `/topics/${params.topicId}/results/`
      );

      const totalResponses = response.data.total_responses || 0;
      const isCompleted = totalResponses > 0;

      setDiagnosticStatus({
        isCompleted,
        totalResponses,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Error checking diagnostic status:", error);
      // If error (e.g., not enrolled), still allow quiz
      setDiagnosticStatus({
        isCompleted: false,
        totalResponses: 0,
        loading: false,
        error: null,
      });
    }
  };

  useEffect(() => {

    void Promise.resolve().then(fetchTopic);
    // Only check diagnostic status for students
    if (user?.role === "student") {
      void Promise.resolve().then(checkDiagnosticStatus);
    }

  }, [params.topicId, user?.role]);

  if (loading) {

    return (
      <div className="p-10">
        Loading topic...
      </div>
    );
  }

  if (!topic) {

    return (
      <div className="p-10 text-red-500">
        Topic not found
      </div>
    );
  }

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold">
        {topic.name}
      </h1>

      <p className="mt-4 text-gray-600">
        {topic.description || "No description"}
      </p>

      <div className="mt-10 rounded-xl border p-6 shadow-sm">

        {user?.role === "lecturer" ? (

          <div className="grid gap-3 md:grid-cols-3">

            <Link
              href={`/courses/${params.id}/topics/${params.topicId}/create`}
              className="rounded-lg border bg-black px-4 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
            >
              Create Questions
            </Link>

            <Link
              href={`/courses/${params.id}/topics/${params.topicId}/questions`}
              className="rounded-lg border px-4 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
            >
              Question Bank
            </Link>

            <Link
              href={`/courses/${params.id}/topics/${params.topicId}/analytics`}
              className="rounded-lg border px-4 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
            >
              Analytics
            </Link>

          </div>

        ) : (

          <div>
            <h2 className="text-2xl font-bold">
              Diagnostic Quiz
            </h2>
            <p className="mt-3 text-gray-600">
              {diagnosticStatus.isCompleted
                ? "You have completed the diagnostic quiz for this topic."
                : "Answer questions to assess your understanding of this topic."}
            </p>

            {/* QUIZ ACTIONS */}
            <div className="mt-6 flex gap-3">
              {!diagnosticStatus.isCompleted ? (
                <Link
                  href={`/courses/${params.id}/topics/${params.topicId}/quiz`}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Start Diagnostic Quiz
                </Link>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 px-6 py-2 border border-green-200">
                    <span className="text-green-700 font-semibold">✓ Completed</span>
                  </div>
                  <Link
                    href={`/courses/${params.id}/topics/${params.topicId}/results`}
                    className="rounded-lg border px-6 py-2 font-semibold hover:bg-gray-50"
                  >
                    View Results
                  </Link>
                </>
              )}
            </div>
          </div>

        )}

      </div>

    <div className="mt-10">

    <h2 className="mb-6 text-3xl font-bold">
        Materials
    </h2>

    </div>

    </div>
  );
}
