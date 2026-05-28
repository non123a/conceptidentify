"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";

type Topic = {
  id: number;
  name: string;
  description: string;
  material_count: number;
  question_count: number;
};
type Material = {
  id: number;
  title: string;
  file: string;
  uploaded_at: string;
  uploaded_by_name: string;
};
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
export default function TopicPage() {

  const params = useParams();

  const [topic, setTopic] =
    useState<Topic | null>(null);
const [materials, setMaterials] =
  useState<Material[]>([]);
const [questions, setQuestions] =
  useState<Question[]>([]);


const [questionText, setQuestionText] =
  useState("");

const [questionType, setQuestionType] =
  useState("open");

const [correctAnswer, setCorrectAnswer] =
  useState("");

const [options, setOptions] =
  useState([
    "",
    "",
    "",
    "",
  ]);

const [correctOption, setCorrectOption] =
  useState(0);

const [creatingQuestion, setCreatingQuestion] =
  useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchTopic();

  }, []);

  const fetchTopic = async () => {

    try {

        const [
        topicResponse,
        materialsResponse,
        questionsResponse,
        ] = await Promise.all([

        api.get(
            `/topics/${params.topicId}/`
        ),

        api.get(
            `/topics/${params.topicId}/materials/`
        ),
        api.get(
            `/topics/${params.topicId}/questions/`
        ),

        ]);

        setTopic(
        topicResponse.data.data
        );

        setMaterials(
        materialsResponse.data.data
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
        const createQuestion = async () => {

        try {

            setCreatingQuestion(true);

            const formData = new FormData();

            formData.append(
            "text",
            questionText
            );

            formData.append(
            "question_type",
            questionType
            );

            if (questionType === "open") {

            formData.append(
                "correct_answer",
                correctAnswer
            );

            } else {

            options.forEach((option) => {

                formData.append(
                "options",
                option
                );

            });

            formData.append(
                "correct_option",
                correctOption.toString()
            );

            }

            await api.post(
            `/topics/${params.topicId}/questions/create/`,
            formData
            );

            setQuestionText("");
            setCorrectAnswer("");

            setOptions([
            "",
            "",
            "",
            "",
            ]);

            fetchTopic();

        } catch (error) {

            console.error(error);

        } finally {

            setCreatingQuestion(false);

        }
        };
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
      <div className="mt-10 rounded-xl border p-6 shadow-sm">

            <h2 className="mb-6 text-3xl font-bold">

                Create Question

            </h2>

            <div className="space-y-4">

                <textarea
                placeholder="Question text"
                value={questionText}
                onChange={(e) =>
                    setQuestionText(e.target.value)
                }
                className="w-full rounded border p-3"
                rows={4}
                />

                <select
                value={questionType}
                onChange={(e) =>
                    setQuestionType(e.target.value)
                }
                className="w-full rounded border p-3"
                >

                <option value="open">
                    Open Question
                </option>

                <option value="mcq">
                    Multiple Choice
                </option>

                </select>

                {questionType === "open" && (

                <textarea
                    placeholder="Reference answer"
                    value={correctAnswer}
                    onChange={(e) =>
                    setCorrectAnswer(
                        e.target.value
                    )
                    }
                    className="w-full rounded border p-3"
                    rows={4}
                />

                )}

                {questionType === "mcq" && (

                <div className="space-y-3">

                    {options.map((option, index) => (

                    <div
                        key={index}
                        className="flex gap-3"
                    >

                        <input
                        type="radio"
                        checked={
                            correctOption === index
                        }
                        onChange={() =>
                            setCorrectOption(index)
                        }
                        />

                        <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {

                            const newOptions = [
                            ...options
                            ];

                            newOptions[index] =
                            e.target.value;

                            setOptions(newOptions);

                        }}
                        className="w-full rounded border p-3"
                        />

                    </div>

                    ))}

                </div>

                )}

                <button
                onClick={createQuestion}
                disabled={creatingQuestion}
                className="rounded bg-black px-6 py-3 text-white"
                >

                {creatingQuestion
                    ? "Creating..."
                    : "Create Question"}

                </button>

            </div>

            </div>

      <p className="mt-4 text-gray-600">
        {topic.description || "No description"}
      </p>

    <div className="mt-10">

    <h2 className="mb-6 text-3xl font-bold">
        Materials
    </h2>
    <div className="mt-16">

        <h2 className="mb-6 text-3xl font-bold">
            Question Bank
        </h2>

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

                <div className="mb-4 flex items-center gap-3">

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

                <h3 className="text-xl font-semibold">

                    {question.text}

                </h3>

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

    {materials.length === 0 ? (

        <div className="rounded-xl border p-6 text-gray-500">

        No materials uploaded.

        </div>

    ) : (

        <div className="grid gap-6">

        {materials.map((material) => (

            <div
            key={material.id}
            className="rounded-xl border p-6 shadow-sm"
            >

            <h3 className="text-2xl font-semibold">
                {material.title}
            </h3>

            <p className="mt-2 text-sm text-gray-500">

                Uploaded by{" "}
                {material.uploaded_by_name}

            </p>

            <a
                href={`http://127.0.0.1:8000${material.file}`}
                target="_blank"
                className="mt-4 inline-block text-blue-600 hover:underline"
            >
                View File
            </a>

            </div>

        ))}

        </div>

    )}

    </div>

    </div>
  );
}