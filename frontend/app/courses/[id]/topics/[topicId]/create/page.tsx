
"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";

type Topic = {
  id: number;
  name: string;
  description: string;
};

type Material = {
  id: number;
  title: string;
  file: string;
  uploaded_at: string;
  uploaded_by_name: string;
};

export default function CreatePage() {

  const params = useParams();

  const [topic, setTopic] =
    useState<Topic | null>(null);

  const [materials, setMaterials] =
    useState<Material[]>([]);

  const [loading, setLoading] =
    useState(true);

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

  useEffect(() => {

    fetchPage();

  }, []);

  const fetchPage = async () => {

    try {

      const [
        topicResponse,
        materialsResponse,
      ] = await Promise.all([

        api.get(
          `/topics/${params.topicId}/`
        ),

        api.get(
          `/topics/${params.topicId}/materials/`
        ),

      ]);

      setTopic(
        topicResponse.data.data
      );

      setMaterials(
        materialsResponse.data.data
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

      alert("Question created");

    } catch (error) {

      console.error(error);

    } finally {

      setCreatingQuestion(false);

    }
  };

  if (loading) {

    return (
      <div className="p-10">
        Loading...
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
          Create Questions
        </h1>

        <p className="mt-3 text-gray-600">

          {topic.name}

        </p>

      </div>

      <div className="rounded-xl border p-6 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">

          Manual Question Creation

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

      <div className="mt-10">

        <h2 className="mb-6 text-3xl font-bold">
          Materials
        </h2>

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

