"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

// ====================================
// TYPES
// ====================================

type Topic = {
  id: number;
  name: string;
  description: string;
  material_count: number;
  question_count: number;
};

type StudentResult = {
  id: number;
  question_text: string;
  question_type: "mcq" | "open";
  answer: string;
  score: number;
  feedback: string;
  created_at: string;
};

// type ResultsData = {
//   success: boolean;
//   topic: Topic;
//   total_responses: number;
//   average_score: number;
//   total_score: number;
//   results: StudentResult[];
// };
type ResultsData = {
  success: boolean;
  topic: Topic;
  total_responses: number;
  average_score: number;
  total_score: number;
  pending_count: number;
  results: StudentResult[];
};

type ApiError = {
  response?: {
    status?: number;
  };
};

// ====================================
// PAGE COMPONENT
// ====================================

export default function ResultsPage() {
  const params = useParams();

  // ====================================
  // STATE
  // ====================================

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reevaluating, setReevaluating] =
    useState(false);
  // ====================================
  // FETCH RESULTS
  // ====================================

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ResultsData>(
        `/topics/${params.topicId}/results/`
      );

      if (response.data.success) {
        setResultsData(response.data);
      } else {
        setError("Failed to load results");
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error("Error loading results:", err);
      if (apiError.response?.status === 403) {
        setError("Not enrolled in this course");
      } else if (apiError.response?.status === 404) {
        setError("Results not found");
      } else {
        setError("Error loading results");
      }
    } finally {
      setLoading(false);
    }
  };
  const reevaluatePending = async () => {

    try {

      await api.post(
        `/topics/${params.topicId}/reevaluate/`
      );

      await fetchResults();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to re-evaluate answers."
      );

    }

  };
  useEffect(() => {
    void Promise.resolve().then(fetchResults);
  }, [params.topicId]);

  // ====================================
  // RENDER: LOADING
  // ====================================

  if (loading) {
    return (
      <div className="ci-page">
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  // ====================================
  // RENDER: ERROR
  // ====================================

  if (error && !resultsData) {
    return (
      <div className="ci-page">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          href={`/courses/${params.id}/topics/${params.topicId}`}
          className="text-blue-500 underline"
        >
          Back to Topic
        </Link>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="ci-page text-red-600">Results not found</div>
    );
  }

  const { topic, total_responses, average_score, total_score,pending_count, results } =
    resultsData;

  // ====================================
  // RENDER: NO RESULTS
  // ====================================

  if (total_responses === 0) {
    return (
      <div className="ci-page-narrow">
        <h1 className="text-3xl font-bold mb-8">{topic.name} - Results</h1>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-600 mb-6">No results available.</p>
          <Link
            href={`/courses/${params.id}/topics/${params.topicId}/quiz`}
            className="ci-button-primary"
          >
            Take Quiz
          </Link>
        </div>
      </div>
    );
  }

  // ====================================
  // RENDER: RESULTS PAGE
  // ====================================

  return (
    <div className="ci-page-narrow">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{topic.name} - Results</h1>
        <p className="text-gray-600">View all your quiz responses</p>
      </div>
      {pending_count > 0 && (

        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="font-semibold text-amber-800">

                Pending Evaluation

              </p>

              <p className="text-sm text-amber-700">

                {pending_count} answer(s) are still waiting for AI evaluation.

              </p>

            </div>

            <button
              onClick={reevaluatePending}
              className="ci-button-warning"
            >
              Re-Evaluate
            </button>

          </div>

        </div>

      )}
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Responses */}
        <div className="ci-card p-6">
          <p className="text-sm text-gray-600 mb-2">Total Responses</p>
          <p className="text-3xl font-bold text-gray-800">
            {total_responses}
          </p>
        </div>

        {/* Average Score */}
        <div className="ci-card p-6">
          <p className="text-sm text-gray-600 mb-2">Average Score</p>
          <p className="text-3xl font-bold text-blue-600">
            {(average_score * 100).toFixed(1)}%
          </p>
        </div>

        {/* Total Score */}
        <div className="ci-card p-6">
          <p className="text-sm text-gray-600 mb-2">Total Score</p>
          <p className="text-3xl font-bold text-gray-800">
            {total_score.toFixed(2)}
          </p>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="ci-alert border-red-200 bg-red-50 text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* RESULTS LIST */}
      <div className="space-y-6">
        {results.map((result, index) => (
          <div
            key={result.id}
            className="ci-card p-6"
          >
            {/* QUESTION INFO */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-500">
                  Question {index + 1} ({result.question_type.toUpperCase()})
                </p>
                {result.feedback === "Evaluating..." ? (

                  <p className="text-sm font-semibold text-amber-600">

                    ⏳ Pending Evaluation

                  </p>

                ) : (

                  <p className="text-sm font-semibold">

                    Score:

                    <span className="text-blue-600 ml-1">

                      {(result.score * 100).toFixed(1)}%

                    </span>

                  </p>

                )}
                {/* <p className="text-sm font-semibold">
                  Score:{" "}
                  <span className="text-blue-600 ml-1">
                    {(result.score * 100).toFixed(1)}%
                  </span>
                </p> */}
              </div>
              <p className="text-lg font-semibold text-gray-800">
                {result.question_text}
              </p>
            </div>

            {/* STUDENT ANSWER */}
            <div className="mb-4 p-3 bg-gray-50 rounded border">
              <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
              <p className="text-gray-800 whitespace-pre-wrap">
                {result.answer}
              </p>
            </div>

            {/* FEEDBACK */}
            {result.feedback && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Feedback:</p>
                <p className="text-gray-800 text-sm">{result.feedback}</p>
              </div>
            )}

            {/* SUBMISSION DATE */}
            <div className="mt-4 text-xs text-gray-500">
              Submitted: {new Date(result.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-10 flex gap-4">
        <Link
          href={`/courses/${params.id}/topics/${params.topicId}/quiz`}
          className="ci-button-primary flex-1 text-center"
        >
          Diagnostic Quiz
        </Link>
        <Link
          href={`/courses/${params.id}/topics/${params.topicId}`}
          className="ci-button-secondary"
        >
          Back to Topic
        </Link>
      </div>
    </div>
  );
}
