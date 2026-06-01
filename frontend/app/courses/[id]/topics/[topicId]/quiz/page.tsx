"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

// ====================================
// PAGE COMPONENT
// ====================================

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  // ====================================
  // STATE
  // ====================================

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    } catch (err: any) {
      console.error("Error loading quiz:", err);
      if (err.response?.status === 403) {
        setError("Not enrolled in this course");
      } else if (err.response?.status === 404) {
        setError("Quiz not found");
      } else {
        setError("Error loading quiz");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
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
        // Redirect to results page
        router.push(
          `/courses/${params.id}/topics/${params.topicId}/results`
        );
      } else {
        setError(response.data.error || "Failed to submit quiz");
      }
    } catch (err: any) {
      console.error("Error submitting quiz:", err);
      if (err.response?.status === 403) {
        setError("Not enrolled in this course");
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || "Invalid submission");
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
      <div className="p-10">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  // ====================================
  // RENDER: ERROR
  // ====================================

  if (error && !quizData) {
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

  if (!quizData) {
    return (
      <div className="p-10 text-red-500">Quiz not found</div>
    );
  }

  const { topic, questions } = quizData;

  // ====================================
  // RENDER: QUIZ FORM
  // ====================================

  return (
    <div className="p-10 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {topic.name}
        </h1>
        <p className="text-gray-600">
          Total Questions: {questions.length}
        </p>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* QUIZ FORM */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="border rounded-lg p-6 bg-white shadow-sm"
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
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
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
