
"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";

type Choice = {
  id: number;
  text: string;
  is_correct: boolean;
};

type Question = {
  id: number;
  text: string;
  question_type: string;
  created_by: string;
  is_approved: boolean;
  correct_answer: string;
  created_at: string;
  choices: Choice[];
};

type Topic = {
  id: number;
  name: string;
  description: string;
};

export default function QuestionsPage() {

  const params = useParams();

  const [topic, setTopic] =
    useState<Topic | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchPage();

  }, []);

  const fetchPage = async () => {

    try {

      const [
        topicResponse,
        questionsResponse,
      ] = await Promise.all([

        api.get(
          `/topics/${params.topicId}/`
        ),

        api.get(
          `/topics/${params.topicId}/questions/`
        ),

      ]);

      setTopic(
        topicResponse.data.data
      );

      setQuestions(
        questionsResponse.data.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {

    return (
      <div className="p-10">
        Loading questions...
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

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Question Bank
        </h1>

        <p className="mt-3 text-gray-600">

          {topic.name}

        </p>

      </div>

      {questions.length === 0 ? (

        <div className="rounded-xl border p-6 text-gray-500">

          No questions available.

        </div>

      ) : (

        <div className="space-y-6">

          {questions.map((question) => (

            <div
              key={question.id}
              className="rounded-xl border p-6 shadow-sm"
            >

              <div className="mb-4 flex flex-wrap items-center gap-3">

                <span className="rounded bg-gray-100 px-3 py-1 text-sm">

                  {question.question_type.toUpperCase()}

                </span>

                <span
                  className={`rounded px-3 py-1 text-sm ${
                    question.is_approved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >

                  {question.is_approved
                    ? "Approved"
                    : "Pending"}

                </span>

                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700">

                  {question.created_by}

                </span>

              </div>

              <h2 className="text-xl font-semibold">

                {question.text}

              </h2>

              {question.question_type === "mcq" && (

                <div className="mt-4 space-y-2">

                  {question.choices.map((choice) => (

                    <div
                      key={choice.id}
                      className={`rounded border p-3 ${
                        choice.is_correct
                          ? "border-green-500 bg-green-50"
                          : ""
                      }`}
                    >

                      {choice.text}

                    </div>

                  ))}

                </div>

              )}

              {question.question_type === "open" && (

                <div className="mt-4 rounded border bg-gray-50 p-4">

                  <p className="text-sm font-medium text-gray-500">

                    Reference Answer

                  </p>

                  <p className="mt-2 text-gray-700">

                    {question.correct_answer}

                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

