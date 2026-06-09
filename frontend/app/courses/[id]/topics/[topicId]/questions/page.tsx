
"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { useParams } from "next/navigation";

import api from "@/lib/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

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

  const [togglingQuestionId, setTogglingQuestionId] =
    useState<number | null>(null);

  const [deletingQuestionId, setDeletingQuestionId] =
    useState<number | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] =
    useState(false);

  const [selectedQuestionId, setSelectedQuestionId] =
    useState<number | null>(null);

  const [editingQuestionId, setEditingQuestionId] =
    useState<number | null>(null);

  const [savingQuestionId, setSavingQuestionId] =
    useState<number | null>(null);

  const [editText, setEditText] =
    useState("");

  const [editCorrectAnswer, setEditCorrectAnswer] =
    useState("");

  const [editChoices, setEditChoices] =
    useState<string[]>([]);

  const [editCorrectOption, setEditCorrectOption] =
    useState(0);

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

  const toggleQuestionStatus = async (
    questionId: number
  ) => {

    try {

      setTogglingQuestionId(questionId);

      const response = await api.post(
        `/questions/${questionId}/toggle/`
      );

      setQuestions((currentQuestions) =>
        currentQuestions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                is_approved:
                  response.data.is_approved,
              }
            : question
        )
      );

    } catch (error) {

      console.error(error);

    } finally {

      setTogglingQuestionId(null);

    }
  };

  const handleDeleteQuestionClick = (
    questionId: number
  ) => {

    setSelectedQuestionId(questionId);
    setDeleteConfirmOpen(true);

  };

  const handleConfirmDeleteQuestion = async () => {

    if (!selectedQuestionId) return;

    try {

      setDeletingQuestionId(selectedQuestionId);

      await api.delete(
        `/questions/${selectedQuestionId}/delete/`
      );

      setQuestions((currentQuestions) =>
        currentQuestions.filter(
          (question) =>
            question.id !== selectedQuestionId
        )
      );

    } catch (error) {

      console.error(error);

    } finally {

      setDeletingQuestionId(null);
      setDeleteConfirmOpen(false);
      setSelectedQuestionId(null);

    }
  };

  const startEditQuestion = (
    question: Question
  ) => {

    setEditingQuestionId(question.id);
    setEditText(question.text);
    setEditCorrectAnswer(
      question.correct_answer || ""
    );
    setEditChoices(
      question.choices.map((choice) =>
        choice.text
      )
    );

    const correctIndex =
      question.choices.findIndex(
        (choice) => choice.is_correct
      );

    setEditCorrectOption(
      correctIndex >= 0 ? correctIndex : 0
    );
  };

  const cancelEditQuestion = () => {

    setEditingQuestionId(null);
    setEditText("");
    setEditCorrectAnswer("");
    setEditChoices([]);
    setEditCorrectOption(0);
  };

  const saveQuestionEdit = async (
    question: Question
  ) => {

    try {

      setSavingQuestionId(question.id);

      const payload =
        question.question_type === "mcq"
          ? {
              text: editText,
              choices: editChoices,
              correct_option: editCorrectOption,
            }
          : {
              text: editText,
              correct_answer: editCorrectAnswer,
            };

      await api.put(
        `/questions/${question.id}/edit/`,
        payload
      );

      cancelEditQuestion();
      fetchPage();

    } catch (error) {

      console.error(error);

    } finally {

      setSavingQuestionId(null);

    }
  };

  if (loading) {

    return (
      <RoleGuard allowedRole="lecturer">
      <div className="ci-page">
        Loading questions...
      </div>
      </RoleGuard>
    );
  }

  if (!topic) {

    return (
      <RoleGuard allowedRole="lecturer">
      <div className="ci-page text-red-600">
        Topic not found
      </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRole="lecturer">
    <div className="ci-page">

      <div className="mb-10">

        <h1 className="text-3xl font-bold">
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
              className="ci-card p-6"
            >

              <div className="mb-4 flex flex-wrap items-center gap-3">

                <span className="rounded bg-gray-100 px-3 py-1 text-sm">

                  {question.question_type.toUpperCase()}

                </span>

                <span
                  className={`rounded px-3 py-1 text-sm ${
                    question.is_approved
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >

                  {question.is_approved
                    ? "Approved"
                    : "Pending"}

                </span>

                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700">

                  {question.created_by}

                </span>

                <button
                  type="button"
                  onClick={() =>
                    toggleQuestionStatus(
                      question.id
                    )
                  }
                  disabled={
                    togglingQuestionId ===
                    question.id
                  }
                  className="ci-button-primary min-h-0 px-3 py-1 text-sm disabled:opacity-50"
                >

                  {togglingQuestionId ===
                  question.id
                    ? "Updating..."
                    : question.is_approved
                      ? "Unapprove"
                      : "Approve"}

                </button>

                <button
                  type="button"
                  onClick={() =>
                    startEditQuestion(question)
                  }
                  className="rounded border px-3 py-1 text-sm"
                >

                  Edit

                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteQuestionClick(
                      question.id
                    )
                  }
                  disabled={
                    deletingQuestionId ===
                    question.id
                  }
                  className="ci-button-danger min-h-0 px-3 py-1 text-sm disabled:opacity-50"
                >

                  {deletingQuestionId ===
                  question.id
                    ? "Deleting..."
                    : "Delete"}

                </button>

              </div>

              {editingQuestionId ===
              question.id ? (

                <div className="space-y-4">

                  <textarea
                    value={editText}
                    onChange={(event) =>
                      setEditText(
                        event.target.value
                      )
                    }
                    className="ci-input"
                    rows={4}
                  />

                  {question.question_type ===
                    "open" && (

                    <textarea
                      value={editCorrectAnswer}
                      onChange={(event) =>
                        setEditCorrectAnswer(
                          event.target.value
                        )
                      }
                      className="ci-input"
                      rows={4}
                    />

                  )}

                  {question.question_type ===
                    "mcq" && (

                    <div className="space-y-3">

                      {editChoices.map(
                        (choice, index) => (

                          <div
                            key={index}
                            className="flex gap-3"
                          >

                            <input
                              type="radio"
                              checked={
                                editCorrectOption ===
                                index
                              }
                              onChange={() =>
                                setEditCorrectOption(
                                  index
                                )
                              }
                            />

                            <input
                              type="text"
                              value={choice}
                              onChange={(event) => {
                                const nextChoices = [
                                  ...editChoices,
                                ];

                                nextChoices[index] =
                                  event.target.value;

                                setEditChoices(
                                  nextChoices
                                );
                              }}
                              className="ci-input"
                            />

                          </div>

                        )
                      )}

                    </div>

                  )}

                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        saveQuestionEdit(
                          question
                        )
                      }
                      disabled={
                        savingQuestionId ===
                        question.id
                      }
                      className="ci-button-primary min-h-0 px-4 py-2 text-sm disabled:opacity-50"
                    >

                      {savingQuestionId ===
                      question.id
                        ? "Saving..."
                        : "Save"}

                    </button>

                    <button
                      type="button"
                      onClick={cancelEditQuestion}
                      className="ci-button-secondary min-h-0 px-4 py-2 text-sm"
                    >

                      Cancel

                    </button>

                  </div>

                </div>

              ) : (

              <>

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

              </>

              )}

            </div>

          ))}

        </div>

      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Question"
        description="This question will be permanently removed from the topic question bank."
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        loading={
          deletingQuestionId !== null
        }
        onConfirm={
          handleConfirmDeleteQuestion
        }
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setSelectedQuestionId(null);
        }}
      />

    </div>
    </RoleGuard>
  );
}
