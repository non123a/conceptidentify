
"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
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
type GeneratedQuestion = {
  question: string;
  type: string;
  choices?: string[];
  correct_answer?: string;
  reference_answer?: string;
};
export default function CreatePage() {

  const params = useParams();

  const [topic, setTopic] =
    useState<Topic | null>(null);

  const [materials, setMaterials] =
    useState<Material[]>([]);
   const [aiPrompt, setAiPrompt] =
  useState("");

const [aiQuestionType, setAiQuestionType] =
  useState("mcq");

const [aiCount, setAiCount] =
  useState(3);

const [generatingAi, setGeneratingAi] =
  useState(false);

const [generatedQuestions, setGeneratedQuestions] =
  useState<GeneratedQuestion[]>([]);
const [selectedQuestions, setSelectedQuestions] =
  useState<number[]>([]);
const [savingGenerated, setSavingGenerated] =
  useState(false);

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
    if (!questionText.trim()) {
    alert("Question text required");
    return;
    }
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
  const generateAiQuestions = async () => {

  try {

    setGeneratingAi(true);
    console.log(
    `/topics/${params.topicId}/generate/`
    );
    const response = await api.get(

      `/topics/${params.topicId}/generate/`,

      {
        params: {
          type: aiQuestionType,
          count: aiCount,
          prompt: aiPrompt,
        },
      }

    );

    setGeneratedQuestions(
      response.data.questions
    );

  } catch (error) {

    console.error(error);

  } finally {

    setGeneratingAi(false);

  }
};
const saveGeneratedQuestions = async () => {

  try {

    setSavingGenerated(true);

    await api.post(

      `/topics/${params.topicId}/bulk-create/`,

      {
        // questions: generatedQuestions,
        questions: generatedQuestions.filter(
        (_, index) =>
            selectedQuestions.includes(index)
        ),
      }

    );

    alert("Questions saved");

    setGeneratedQuestions([]);

  } catch (error) {

    console.error(error);

  } finally {

    setSavingGenerated(false);

  }
};
const removeGeneratedQuestion = (
  index: number
) => {

  const updated =
    generatedQuestions.filter(
      (_, i) => i !== index
    );

  setGeneratedQuestions(updated);

  setSelectedQuestions((prev) =>
    prev.filter((id) => id !== index)
  );
};
const editGeneratedQuestion = (
  question: GeneratedQuestion
) => {

  setQuestionText(
    question.question
  );

  setQuestionType(
    question.type
  );

  if (question.type === "open") {

    setCorrectAnswer(
      question.reference_answer || ""
    );

  }

  if (question.type === "mcq") {

    setOptions(
      question.choices || [
        "",
        "",
        "",
        "",
      ]
    );

    const correctIndex =
      question.choices?.findIndex(
        (choice) =>
          choice === question.correct_answer
      ) || 0;

    setCorrectOption(correctIndex);

  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const toggleQuestionSelection = (
  index: number
) => {

  setSelectedQuestions((prev) =>

    prev.includes(index)

      ? prev.filter((id) => id !== index)

      : [...prev, index]

  );
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
    <RoleGuard allowedRole="lecturer">
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
                      setCorrectOption(0);
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
    <div className="mt-10 rounded-xl border p-6 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">

            AI Question Generation

        </h2>

        <div className="space-y-4">

            <textarea
            placeholder="Custom AI instruction..."
            value={aiPrompt}
            onChange={(e) =>
                setAiPrompt(e.target.value)
            }
            className="w-full rounded border p-3"
            rows={4}
            />

            <div className="grid gap-4 md:grid-cols-2">

            <select
                value={aiQuestionType}
                onChange={(e) =>
                setAiQuestionType(
                    e.target.value
                )
                }
                className="rounded border p-3"
            >

                <option value="mcq">
                Multiple Choice
                </option>

                <option value="open">
                Open Question
                </option>

            </select>

            <input
                type="number"
                min={1}
                max={10}
                value={aiCount}
                onChange={(e) =>
                setAiCount(
                    Number(e.target.value)
                )
                }
                className="rounded border p-3"
            />

            </div>

            <button
            onClick={generateAiQuestions}
            disabled={generatingAi}
            className="rounded bg-black px-6 py-3 text-white"
            >

            {generatingAi
                ? "Generating..."
                : "Generate AI Questions"}

            </button>

        </div>

        </div>
        {generatedQuestions.length > 0 && (

  <div className="mt-10 rounded-xl border p-6 shadow-sm">

    <div className="mb-6 flex items-center justify-between">

      <h2 className="text-2xl font-bold">

        Generated Questions

      </h2>

      <button
        onClick={saveGeneratedQuestions}
        disabled={
        savingGenerated ||
        selectedQuestions.length === 0
        }
        className="rounded bg-green-600 px-5 py-3 text-white"
        
      >

        {savingGenerated
          ? "Saving..."
          : "Approve & Save"
          }
        
          

      </button>

    </div>

    <div className="space-y-6">

      {generatedQuestions.map((question, index) => (

        <div
          key={index}
          className="rounded-lg border p-5"
        >
            <div className="mb-4 flex items-center justify-between">

  <label className="flex items-center gap-2">

    <input
      type="checkbox"
      checked={selectedQuestions.includes(index)}
      onChange={() =>
        toggleQuestionSelection(index)
      }
    />

    <span className="text-sm text-gray-600">

      Select Question

    </span>

  </label>

  <div className="flex gap-2">

    <button
      onClick={() =>
        editGeneratedQuestion(question)
      }
      className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
    >

      Edit

    </button>

    <button
      onClick={() =>
        removeGeneratedQuestion(index)
      }
      className="rounded border px-3 py-1 text-sm text-red-600 hover:bg-red-50"
    >

      Remove

    </button>

  </div>

</div>

          <div className="mb-3">

            <span className="rounded bg-gray-100 px-3 py-1 text-sm">

              {question.type.toUpperCase()}

            </span>

          </div>

          <h3 className="text-lg font-semibold">

            {question.question}

          </h3>

          {question.type === "mcq" && (

            <div className="mt-4 space-y-2">

              {question.choices?.map((choice, i) => (

                <div
                  key={i}
                  className={`rounded border p-3 ${
                    choice === question.correct_answer
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >

                  {choice}

                </div>

              ))}

            </div>

          )}

          {question.type === "open" && (

            <div className="mt-4 rounded border bg-gray-50 p-4">

              <p className="text-sm font-medium text-gray-500">

                Reference Answer

              </p>

              <p className="mt-2 text-gray-700">

                {question.reference_answer}

              </p>

            </div>

          )}

        </div>

      ))}

    </div>

  </div>

)}
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
                  rel="noopener noreferrer"
                >
                  View File
                </a>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  </RoleGuard>
  );
}

