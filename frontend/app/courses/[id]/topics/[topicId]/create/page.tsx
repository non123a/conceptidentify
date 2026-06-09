
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
  const [materialTitle, setMaterialTitle] =
  useState("");

const [materialFile, setMaterialFile] =
  useState<File | null>(null);

const [uploadingMaterial, setUploadingMaterial] =
  useState(false);
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
  const [generateError, setGenerateError] =
    useState("");
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

  } catch (error: any) {

    // console.error(error);

    if (
      error.response?.status === 503
    ) {

      setGenerateError(
        "AI service is currently experiencing high traffic. Please try again in a few moments."
      );

      return;

    }

    setGenerateError(
      "Question generation failed."
    );
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
const approveAllGeneratedQuestions = async () => {

  try {

    setSavingGenerated(true);

    await api.post(
      `/topics/${params.topicId}/bulk-create/`,
      {
        questions: generatedQuestions,
      }
    );

    alert(
      "All generated questions approved"
    );

    setGeneratedQuestions([]);
    setSelectedQuestions([]);

  } catch (error) {

    console.error(error);

    alert(
      "Failed to approve questions"
    );

  } finally {

    setSavingGenerated(false);

  }

};

const uploadMaterial = async () => {
  if (!materialTitle.trim()) {

    alert(
      "Material title is required."
    );

    return;
  }

  if (!materialFile) {

    alert(
      "Please select a PDF file."
    );

    return;
  }

  try {

    setUploadingMaterial(true);

    const formData = new FormData();

    formData.append(
      "title",
      materialTitle
    );

    formData.append(
      "topic_id",
      params.topicId as string
    );

    formData.append(
      "file",
      materialFile
    );

    await api.post(
      "/materials/upload/",
      formData
    );

    setMaterialTitle("");
    setMaterialFile(null);

    await fetchPage();

    alert(
      "Material uploaded"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Upload failed"
    );

  } finally {

    setUploadingMaterial(false);

  }
};
const deleteMaterial = async (
  materialId: number
) => {

  const confirmed = window.confirm(
    "Delete this material?"
  );

  if (!confirmed) return;

  try {

    await api.delete(
      `/materials/${materialId}/delete/`
    );

    setMaterials((prev) =>
      prev.filter(
        (m) => m.id !== materialId
      )
    );

  } catch (error) {

    console.error(error);

    alert(
      "Failed to delete material"
    );

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







{/* -------------------------------------------------------------------------- */}
<div className="grid gap-6 xl:grid-cols-4">

  {/* LEFT PANEL */}
  <div className="xl:col-span-1">

      <div>

        {/* <h2 className="mb-6 text-3xl font-bold">
          Materials
        </h2> */}
        <div className="mb-6 rounded-xl border p-6">

  <h3 className="mb-4 text-xl font-semibold">

    Upload Material

  </h3>

<input
  type="text"
  placeholder="Material Title"
  value={materialTitle}
  onChange={(e) =>
    setMaterialTitle(
      e.target.value
    )
  }
  className="mb-3 w-full rounded border p-3"
/>
{materialFile && (

  <p className="mt-2 text-sm text-gray-500">

    Selected:
    {" "}
    {materialFile.name}

  </p>

)}

  <input
  type="file"
  accept=".pdf"
  className="mb-4 w-full"
  onChange={(e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {

      alert(
        "Only PDF files are allowed."
      );

      return;
    }

    if (file.size > 20 * 1024 * 1024) {

      alert(
        "File size must be less than 20MB."
      );

      return;
    }

    setMaterialFile(file);

  }}
/>
  <button
    onClick={uploadMaterial}
    disabled={uploadingMaterial}
    className="rounded bg-black px-5 py-3 text-white"
  >

    {uploadingMaterial
      ? "Uploading..."
      : "Upload Material"}

  </button>

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

                <div className="mt-4 flex gap-4">

                  <a
                    href={`http://127.0.0.1:8000${material.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View File
                  </a>

                  <button
                    onClick={() =>
                      deleteMaterial(material.id)
                    }
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

  </div>

  {/* MIDDLE PANEL */}
  <div className="xl:col-span-1">
    <div className="rounded-xl border p-6 shadow-sm">

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
        <div className="mt-6 rounded-xl border p-6 shadow-sm">

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
  </div>

  {/* RIGHT PANEL */}
  <div className="xl:col-span-2">
    
    <div className="rounded-xl border p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        Generated Questions
      </h2>
      {generateError && (

        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">

          <p className="font-semibold text-red-700">

            AI service unavailable

          </p>

          <p className="mt-1 text-sm text-red-600">

            {generateError}

          </p>

        </div>

      )}
      {generatedQuestions.length > 0 && (

          <div className="text-gray-500">

            <div className="mb-6 flex items-center justify-between">


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
                <button
                  onClick={approveAllGeneratedQuestions}
                  disabled={
                    savingGenerated ||
                    generatedQuestions.length === 0
                  }
                  className="rounded bg-blue-600 px-5 py-3 text-white"
                >
                  Approve All
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
    </div>
  </div>

</div>






    </div>
  </RoleGuard>
  );
}

