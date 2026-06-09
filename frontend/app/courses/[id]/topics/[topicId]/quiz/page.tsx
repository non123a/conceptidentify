"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

// ====================================
// TYPES
// ====================================

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

type QuizData = {
  success: boolean;
  topic: Topic;
  questions: Question[];
};

type SubmissionResult = {
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

// ====================================
// PAGE COMPONENT
// ====================================

export default function QuizPage() {
  const params = useParams();
  useAuth();

  // ====================================
  // STATE
  // ====================================

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResults, setSubmittedResults] =
    useState<SubmissionResult[] | null>(null);

  // Store answers: { [questionId]: answer }
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // ====================================
  // FETCH QUIZ
  // ====================================

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<QuizData>(
        `/topics/${params.topicId}/quiz/`
      );

      if (response.data.success) {
        setQuizData(response.data);
      } else {
        setError("Failed to load quiz");
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error("Error loading quiz:", err);
      if (apiError.response?.status === 403) {
        setError("Not enrolled in this course");
      } else if (apiError.response?.status === 404) {
        setError("Quiz not found");
      } else {
        setError("Error loading quiz");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchQuiz);
  }, [params.topicId]);

  // ====================================
  // HANDLE ANSWER CHANGE
  // ====================================

  const handleAnswerChange = (
    questionId: number,
    answer: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId.toString()]: answer,
    }));
  };

  // ====================================
  // SUBMIT QUIZ
  // ====================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quizData) {
      setError("Quiz data not loaded");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Build payload
      const payload = {
        answers: answers,
      };

      const response = await api.post(
        `/topics/${params.topicId}/submit/`,
        payload
      );

      if (response.data.success) {
        setSubmittedResults(response.data.results || []);
      } else {
        setError(response.data.error || "Failed to submit quiz");
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error("Error submitting quiz:", err);
      if (apiError.response?.status === 403) {
        setError("Not enrolled in this course");
      } else if (apiError.response?.status === 400) {
        setError(apiError.response.data?.error || "Invalid submission");
      } else {
        setError("Error submitting quiz");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================
  // RENDER: LOADING
  // ====================================

  if (loading) {
    return (
      <div className="ci-page">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  // ====================================
  // RENDER: ERROR
  // ====================================

  if (error && !quizData) {
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

  if (!quizData) {
    return (
      <div className="ci-page text-red-600">Quiz not found</div>
    );
  }

  const { topic, questions } = quizData;

  const formatScore = (result: SubmissionResult) => {
    if (result.score === null || result.score === undefined) {
      return "Pending";
    }

    if (result.type === "mcq") {
      return `${(result.score * 100).toFixed(1)}%`;
    }

    return `${result.score.toFixed(1)}%`;
  };

  if (submittedResults) {
    return (
      <div className="ci-page-narrow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {topic.name} - Diagnostic Results
          </h1>
          <p className="text-gray-600">
            Current submission results
          </p>
        </div>

        {submittedResults.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-gray-600">
              No submitted answers were evaluated.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {submittedResults.map((result, index) => (
              <div
                key={`${result.question}-${index}`}
                className="ci-card p-6"
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
          <Link
            href={`/courses/${params.id}/topics/${params.topicId}`}
            className="ci-button-secondary"
          >
            Back to Topic
          </Link>
          <Link
            href={`/courses/${params.id}/topics/${params.topicId}/results`}
            className="ci-button-secondary"
          >
            View Diagnostic History
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="ci-page-narrow">
        <h1 className="text-3xl font-bold mb-6">
          {topic.name} - Diagnostic Quiz
        </h1>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-gray-600 mb-6">
            No unanswered diagnostic questions are available.
          </p>
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

  // ====================================
  // RENDER: QUIZ FORM
  // ====================================

  return (
    <div className="ci-page-narrow">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {topic.name}
        </h1>
        <p className="text-gray-600">
          Total Questions: {questions.length}
        </p>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="ci-alert border-red-200 bg-red-50 text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* QUIZ FORM */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="ci-card p-6"
            >
              {/* QUESTION NUMBER & TEXT */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Question {index + 1}
                </p>
                <p className="text-lg font-semibold">
                  {question.text}
                </p>
              </div>

              {/* OPEN-ENDED QUESTION */}
              {question.question_type === "open" && (
                <div>
                  <textarea
                    value={answers[question.id.toString()] || ""}
                    onChange={(e) =>
                      handleAnswerChange(
                        question.id,
                        e.target.value
                      )
                    }
                    placeholder="Enter your answer here..."
                    className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* MCQ QUESTION */}
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
                        onChange={(e) =>
                          handleAnswerChange(
                            question.id,
                            e.target.value
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

        {/* SUBMIT BUTTON */}
        <div className="mt-10 flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="ci-button-primary flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>

          <Link
            href={`/courses/${params.id}/topics/${params.topicId}`}
            className="ci-button-secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
