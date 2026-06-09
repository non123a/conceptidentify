"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

type QuestionResult = {
  question_id: number;
  question: string;
  question_type: string;
  your_answer: string;
  correct_answer: string;
  score: number;
  feedback: string;
  is_correct: boolean;
};

type Analytics = {
  topic: string;
  performance: number;
  completion_rate: number;
  total_questions: number;
  answered: number;
  correct_answers: number;
  incorrect_answers: number;
  weak_questions: QuestionResult[];
  question_results: QuestionResult[];
};

export default function StudentTopicAnalyticsPage() {

  const params = useParams();

  const [loading, setLoading] =
    useState(true);
  const [isReevaluating, setIsReevaluating] =
    useState(false);
  const [topicName, setTopicName] =
    useState("");

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  // useEffect(() => {

  //   fetchAnalytics();

  // }, []);
  useEffect(() => {

  const loadAnalytics = async () => {

    await autoReevaluate();

    await fetchAnalytics();

  };

  loadAnalytics();

}, []);
  const autoReevaluate = async () => {

        try {

          await api.post(
            `/topics/${params.topicId}/reevaluate/`
          );

        } catch (error) {

          console.log(
            "Reevaluation skipped"
          );

        } finally {

          setIsReevaluating(false);

        }

      };
  const fetchAnalytics = async () => {

    try {

      const response = await api.get(
        `/topics/${params.topicId}/student-analytics/`
      );
      
      setTopicName(
        response.data.topic.name
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

  // if (loading) {

  //   return (
  //     <div className="ci-page">
  //       Loading analytics...
  //     </div>
  //   );

  // }
  if (loading) {

    return (
      <div className="ci-page">

        {isReevaluating ? (

          <div>

            <p className="font-semibold">

              Re-evaluating pending answers...

            </p>

            <p className="mt-2 text-gray-500">

              The system is checking previously pending AI evaluations.
              Please wait.

            </p>

          </div>

        ) : (

          <p>

            Loading analytics...

          </p>

        )}

      </div>
    );

  }

  if (!analytics) {

    return (
      <div className="ci-page text-red-600">
        Analytics not available.
      </div>
    );

  }

  return (

    <div className="ci-page">

      <div className="mb-10">

        <h1 className="text-3xl font-bold">

          My Topic Performance

        </h1>

        <p className="mt-3 text-gray-600">

          {topicName}

        </p>

      </div>

      {/* Summary */}

      <div className="grid gap-6 md:grid-cols-4">

        <div className="ci-card p-6">

          <h2 className="text-sm text-gray-500">

            Performance

          </h2>

          <p className="mt-3 text-3xl font-bold">

            {analytics.performance}%

          </p>

        </div>

        <div className="ci-card p-6">

          <h2 className="text-sm text-gray-500">

            Completion

          </h2>

          <p className="mt-3 text-3xl font-bold">

            {analytics.completion_rate}%

          </p>

        </div>

        <div className="ci-card p-6">

          <h2 className="text-sm text-gray-500">

            Correct

          </h2>

          <p className="mt-3 text-3xl font-bold text-green-600">

            {analytics.correct_answers}

          </p>

        </div>

        <div className="ci-card p-6">

          <h2 className="text-sm text-gray-500">

            Incorrect

          </h2>

          <p className="mt-3 text-3xl font-bold text-red-600">

            {analytics.incorrect_answers}

          </p>

        </div>

      </div>

      {/* Questions To Review */}

      <div className="mt-10 rounded-xl border p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-bold">

          Questions To Review

        </h2>

        {analytics.weak_questions.length === 0 ? (

          <p className="text-green-600">

            Great job! No weak questions found.

          </p>

        ) : (

          <div className="space-y-3">

            {analytics.weak_questions.map(
              (question) => (

                <div
                  key={question.question_id}
                  className="rounded border p-4"
                >

                  <p className="font-medium text-red-600">

                    ❌ {question.question}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* Full Breakdown */}

      <div className="mt-10 rounded-xl border p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-bold">

          Question Breakdown

        </h2>

        <div className="space-y-6">

          {analytics.question_results.map(
            (question) => (

              <div
                key={question.question_id}
                className="rounded-lg border p-5"
              >

                <div className="mb-4">

                  {question.is_correct ? (

                    <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">

                      Correct

                    </span>

                  ) : (

                    <span className="rounded bg-red-100 px-3 py-1 text-sm text-red-700">

                      Incorrect

                    </span>

                  )}

                </div>

                <h3 className="text-lg font-semibold">

                  {question.question}

                </h3>

                <div className="mt-5 rounded border bg-gray-50 p-4">

                  <p className="font-medium">

                    Your Answer

                  </p>

                  <p className="mt-2">

                    {question.your_answer || "-"}

                  </p>

                </div>

                <div className="mt-4 rounded border bg-gray-50 p-4">

                  <p className="font-medium">

                    Correct Answer

                  </p>

                  <p className="mt-2">

                    {question.correct_answer || "-"}

                  </p>

                </div>

                {question.feedback && (

                  <div className="mt-4 rounded border bg-blue-50 p-4">

                    <p className="font-medium">

                      AI Feedback

                    </p>

                    <p className="mt-2">

                      {question.feedback}

                    </p>

                  </div>

                )}

              </div>

            )
          )}

        </div>

      </div>

      <div className="mt-10">

        <Link
          href={`/courses/${params.id}`}
          className="ci-button-secondary"
        >
          Back
        </Link>

      </div>

    </div>

  );

}