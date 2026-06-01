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

type ResultsData = {
  success: boolean;
  topic: Topic;
  total_responses: number;
  average_score: number;
  total_score: number;
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

  useEffect(() => {
    void Promise.resolve().then(fetchResults);
  }, [params.topicId]);

  // ====================================
  // RENDER: LOADING
  // ====================================

  if (loading) {
    return (
      <div className="p-10">
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  // ====================================
  // RENDER: ERROR
  // ====================================

  if (error && !resultsData) {
    return (
      <div className="p-10">
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
      <div className="p-10 text-red-500">Results not found</div>
    );
  }

  const { topic, total_responses, average_score, total_score, results } =
    resultsData;

  // ====================================
  // RENDER: NO RESULTS
  // ====================================

  if (total_responses === 0) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{topic.name} - Results</h1>
        <div className="p-6 bg-gray-50 rounded-lg border text-center">
          <p className="text-gray-600 mb-6">No results available.</p>
          <Link
            href={`/courses/${params.id}/topics/${params.topicId}/quiz`}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    <div className="p-10 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{topic.name} - Results</h1>
        <p className="text-gray-600">View all your quiz responses</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Responses */}
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total Responses</p>
          <p className="text-3xl font-bold text-gray-800">
            {total_responses}
          </p>
        </div>

        {/* Average Score */}
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Average Score</p>
          <p className="text-3xl font-bold text-blue-600">
            {(average_score * 100).toFixed(1)}%
          </p>
        </div>

        {/* Total Score */}
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total Score</p>
          <p className="text-3xl font-bold text-gray-800">
            {total_score.toFixed(2)}
          </p>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* RESULTS LIST */}
      <div className="space-y-6">
        {results.map((result, index) => (
          <div
            key={result.id}
            className="border rounded-lg p-6 bg-white shadow-sm"
          >
            {/* QUESTION INFO */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-500">
                  Question {index + 1} ({result.question_type.toUpperCase()})
                </p>
                <p className="text-sm font-semibold">
                  Score:{" "}
                  <span className="text-blue-600 ml-1">
                    {(result.score * 100).toFixed(1)}%
                  </span>
                </p>
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
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-center"
        >
          Diagnostic Quiz
        </Link>
        <Link
          href={`/courses/${params.id}/topics/${params.topicId}`}
          className="px-6 py-3 border rounded-lg font-semibold hover:bg-gray-50"
        >
          Back to Topic
        </Link>
      </div>
    </div>
  );
}
