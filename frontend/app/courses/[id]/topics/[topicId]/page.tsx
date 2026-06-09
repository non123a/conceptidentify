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
  hasAvailableQuestions: boolean;
  questionCount: number;
  practiceCount: number;
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
      hasAvailableQuestions: false,
      questionCount: 0,
      practiceCount: 0,
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
  // CHECK DIAGNOSTIC AND PRACTICE STATUS
  // ====================================

  const checkDiagnosticStatus = async () => {
    try {
      setDiagnosticStatus((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const [
        diagnosticResponse,
        practiceResponse,
      ] = await Promise.all([
        api.get(
          `/topics/${params.topicId}/quiz/`
        ),
        api.get(
          `/topics/${params.topicId}/practice/`
        ),
      ]);

      const questionCount =
        diagnosticResponse.data.questions?.length || 0;
      const practiceCount =
        practiceResponse.data.questions?.length || 0;

      setDiagnosticStatus({
        hasAvailableQuestions: questionCount > 0,
        questionCount,
        practiceCount,
        loading: false,
        error: null,
      });
    } catch (error: unknown) {
      console.error("Error checking diagnostic status:", error);
      // If error (e.g., not enrolled), still allow quiz
      setDiagnosticStatus({
        hasAvailableQuestions: false,
        questionCount: 0,
        practiceCount: 0,
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
      <div className="ci-page">
        Loading topic...
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
    <div className="ci-page">

      <h1 className="text-3xl font-bold">
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
              className="ci-button-primary text-center"
            >
              Create Questions
            </Link>

            <Link
              href={`/courses/${params.id}/topics/${params.topicId}/questions`}
              className="ci-button-secondary text-center"
            >
              Question Bank
            </Link>

            <Link
              href={`/courses/${params.id}/topics/${params.topicId}/analytics`}
              className="ci-button-secondary text-center"
            >
              Analytics
            </Link>

          </div>

        ) : (

          <div>
            <h2 className="text-xl font-bold">
              Student Questions
            </h2>
            <p className="mt-3 text-gray-600">
              {diagnosticStatus.hasAvailableQuestions
                ? "Diagnostic Quiz Available"
                : "Diagnostic Quiz Completed"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {diagnosticStatus.hasAvailableQuestions ? (
                <Link
                  href={`/courses/${params.id}/topics/${params.topicId}/quiz`}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Diagnostic Quiz
                </Link>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-6 py-2 border border-green-200">
                  <span className="text-green-700 font-semibold">Completed</span>
                </div>
              )}

              <Link
                href={`/courses/${params.id}/topics/${params.topicId}/practice`}
                className="ci-button-secondary"
              >
                Practice Questions
                {diagnosticStatus.practiceCount > 0
                  ? ` (${diagnosticStatus.practiceCount})`
                  : ""}
              </Link>

              <Link
                href={`/courses/${params.id}/topics/${params.topicId}/results`}
                className="ci-button-secondary"
              >
                View Diagnostic History
              </Link>
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
