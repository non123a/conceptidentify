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

export default function TopicPage() {

  const params = useParams();

  const [topic, setTopic] =
    useState<Topic | null>(null);


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

    </div>

    </div>
  );
}