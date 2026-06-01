"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

type Choice = {
  id: number;
  text: string;
};

type Question = {
  id: number;
  text: string;
  question_type: "mcq" | "open";
  choices: Choice[];
};

type Topic = {
  id: number;
  name: string;
  description: string;
  material_count: number;
  question_count: number;
};

type PracticeData = {
  success: boolean;
  topic: Topic;
  questions: Question[];
};

type PracticeResult = {
  question: string;
  answer: string;
  score: number | null;
  type: "mcq" | "open";
  feedback: string;
  ai_pending: boolean;
};

type ApiError = {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
};

export default function PracticePage() {
  const params = useParams();

  const [practiceData, setPracticeData] =
    useState<PracticeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] =
    useState<Record<string, string>>({});
  const [results, setResults] =
    useState<PracticeResult[] | null>(null);

  const fetchPractice = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<PracticeData>(
        `/topics/${params.topicId}/practice/`
      );

      if (response.data.success) {
        setPracticeData(response.data);
      } else {
        setError("Failed to load practice questions");
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error("Error loading practice questions:", err);
      if (apiError.response?.status === 403) {
        setError("Not enrolled in this course");
      } else {
        setError("Error loading practice questions");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchPractice);
  }, [params.topicId]);

  const handleAnswerChange = (
    questionId: number,
    answer: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId.toString()]: answer,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const response = await api.post(
        `/topics/${params.topicId}/practice/submit/`,
        {
          answers,
        }
      );

      if (response.data.success) {
        setResults(response.data.results || []);
      } else {
        setError(response.data.error || "Failed to submit practice");
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error("Error submitting practice:", err);
      setError(
        apiError.response?.data?.error || "Error submitting practice"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatScore = (result: PracticeResult) => {
    if (result.score === null || result.score === undefined) {
      return "Pending";
    }

    if (result.type === "mcq") {
      return `${(result.score * 100).toFixed(1)}%`;
    }

    return `${result.score.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="p-10">
        <p className="text-gray-600">
          Loading practice questions...
        </p>
      </div>
    );
  }

  if (error && !practiceData) {
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

  if (!practiceData) {
    return (
      <div className="p-10 text-red-500">
        Practice questions not found
      </div>
    );
  }

  const { topic, questions } = practiceData;

  if (results) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {topic.name} - Practice Results
          </h1>
          <p className="text-gray-600">
            Temporary practice feedback
          </p>
        </div>

        {results.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-lg border">
            <p className="text-gray-600">
              No practice answers were evaluated.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result, index) => (
              <div
                key={`${result.question}-${index}`}
                className="border rounded-lg p-6 bg-white shadow-sm"
              >
                <div className="mb-4 flex justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Question {index + 1} ({result.type.toUpperCase()})
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {formatScore(result)}
                  </p>
                </div>

                <p className="text-lg font-semibold text-gray-800">
                  {result.question}
                </p>

                <div className="mt-4 p-3 bg-gray-50 rounded border">
                  <p className="text-sm text-gray-600 mb-1">
                    Your Answer:
                  </p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {result.answer}
                  </p>
                </div>

                {result.feedback && (
                  <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">
                      Feedback:
                    </p>
                    <p className="text-gray-800 text-sm">
                      {result.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex gap-4">
          <button
            type="button"
            onClick={() => {
              setResults(null);
              setAnswers({});
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Practice Again
          </button>
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

  if (questions.length === 0) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          {topic.name} - Practice Questions
        </h1>
        <div className="p-6 bg-gray-50 rounded-lg border">
          <p className="text-gray-600 mb-6">
            No practice questions are available yet.
          </p>
          <Link
            href={`/courses/${params.id}/topics/${params.topicId}`}
            className="inline-block px-6 py-3 border rounded-lg font-semibold hover:bg-gray-50"
          >
            Back to Topic
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {topic.name} - Practice Questions
        </h1>
        <p className="text-gray-600">
          Total Questions: {questions.length}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="border rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Question {index + 1}
                </p>
                <p className="text-lg font-semibold">
                  {question.text}
                </p>
              </div>

              {question.question_type === "open" && (
                <textarea
                  value={answers[question.id.toString()] || ""}
                  onChange={(event) =>
                    handleAnswerChange(
                      question.id,
                      event.target.value
                    )
                  }
                  placeholder="Enter your answer here..."
                  className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {question.question_type === "mcq" && (
                <div className="space-y-3">
                  {question.choices.map((choice) => (
                    <label
                      key={choice.id}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={choice.id.toString()}
                        checked={
                          answers[question.id.toString()] ===
                          choice.id.toString()
                        }
                        onChange={(event) =>
                          handleAnswerChange(
                            question.id,
                            event.target.value
                          )
                        }
                        className="mr-3"
                      />
                      <span>{choice.text}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Practice"}
          </button>

          <Link
            href={`/courses/${params.id}/topics/${params.topicId}`}
            className="px-6 py-3 border rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
