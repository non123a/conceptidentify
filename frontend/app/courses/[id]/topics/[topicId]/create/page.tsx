
"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { useParams } from "next/navigation";

import api from "@/lib/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast from "@/components/ui/Toast";

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
const [deletingMaterialId, setDeletingMaterialId] =
  useState<number | null>(null);
const [deleteMaterialOpen, setDeleteMaterialOpen] =
  useState(false);
const [selectedMaterialId, setSelectedMaterialId] =
  useState<number | null>(null);
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
const [removeQuestionOpen, setRemoveQuestionOpen] =
  useState(false);
const [selectedGeneratedIndex, setSelectedGeneratedIndex] =
  useState<number | null>(null);

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
  const [notification, setNotification] =
    useState<{
      message: string;
      type: "success" | "error";
    } | null>(null);

  useEffect(() => {
    
    fetchPage();

  }, []);
  useEffect(() => {

    if (!notification) return;

    const timer = setTimeout(() => {

      setNotification(null);

    }, 3000);

    return () => clearTimeout(timer);

  }, [notification]);
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
      setNotification({
        type: "error",
        message: "Question text is required.",
      });
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

      setNotification({
        type: "success",
        message: "Question created successfully.",
      });

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

    setNotification({
        type: "success",
        message: "Question Saved Successfully.",
    });
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

    setNotification({
        type: "success",
        message: "All generated questions approved",
    });

    setGeneratedQuestions([]);
    setSelectedQuestions([]);

  } catch (error) {

    console.error(error);

    setNotification({
        type: "error",
        message: "Failed to approve questions",
    });

  } finally {

    setSavingGenerated(false);

  }

};

const uploadMaterial = async () => {
  if (!materialTitle.trim()) {

    setNotification({
        type: "error",
        message: "Material title is required",
    });

    return;
  }

  if (!materialFile) {

    setNotification({
        type: "error",
        message: "Please select a PDF file",
    });

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

    setNotification({
        type: "success",
        message: "Material uploaded successfully.",
    });

  } catch (error) {

    console.error(error);

    setNotification({
        type: "error",
        message: "Failed to upload material.",
    });

  } finally {

    setUploadingMaterial(false);

  }
};
const handleDeleteMaterialClick = (
  materialId: number
) => {

  setSelectedMaterialId(materialId);
  setDeleteMaterialOpen(true);

};

const handleConfirmDeleteMaterial = async () => {

  if (!selectedMaterialId) return;

  try {

    setDeletingMaterialId(selectedMaterialId);

    await api.delete(
      `/materials/${selectedMaterialId}/delete/`
    );

    setMaterials((prev) =>
      prev.filter(
        (m) => m.id !== selectedMaterialId
      )
    );

  } catch (error) {

    console.error(error);

    setNotification({
        type: "error",
        message: "Failed to delete material.",
    });

  } finally {

    setDeletingMaterialId(null);
    setDeleteMaterialOpen(false);
    setSelectedMaterialId(null);

  }
};

const handleRemoveGeneratedQuestionClick = (
  index: number
) => {

  setSelectedGeneratedIndex(index);
  setRemoveQuestionOpen(true);

};

const handleConfirmRemoveGeneratedQuestion = () => {

  if (selectedGeneratedIndex === null) return;

  const updated =
    generatedQuestions.filter(
      (_, i) => i !== selectedGeneratedIndex
    );

  setGeneratedQuestions(updated);

  setSelectedQuestions((prev) =>
    prev
      .filter((id) => id !== selectedGeneratedIndex)
      .map((id) =>
        id > selectedGeneratedIndex
          ? id - 1
          : id
      )
  );

  setRemoveQuestionOpen(false);
  setSelectedGeneratedIndex(null);
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
      <div className="ci-page">
        Loading...
      </div>
    );
  }

  if (!topic) {

    return (
      <div className="ci-page text-red-600">
        Topic not found
      </div>
    );
  }

  return (
    <RoleGuard allowedRole="lecturer">
    <div className="ci-page">

      <div className="mb-10">

        <h1 className="text-3xl font-bold">
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
  className="mb-3 ci-input"
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

      setNotification({
        type: "error",
        message: "Only PDF files are allowed.",
      });

      return;
    }

    if (file.size > 20 * 1024 * 1024) {

      setNotification({
        type: "error",
        message: "File size must be less than 20MB.",
      });

      return;
    }

    setMaterialFile(file);

  }}
/>
  <button
    onClick={uploadMaterial}
    disabled={uploadingMaterial}
    className="ci-button-primary"
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
                className="ci-card p-6"
              >

                <h3 className="text-xl font-semibold">
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
                      handleDeleteMaterialClick(
                        material.id
                      )
                    }
                    disabled={
                      deletingMaterialId ===
                      material.id
                    }
                    className="text-red-600 hover:underline"
                  >
                    {deletingMaterialId ===
                    material.id
                      ? "Deleting..."
                      : "Delete"}
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
    <div className="ci-card p-6">

        <h2 className="mb-6 text-xl font-bold">

            AI Question Generation

        </h2>

        <div className="space-y-4">

            <textarea
            placeholder="Custom AI instruction..."
            value={aiPrompt}
            onChange={(e) =>
                setAiPrompt(e.target.value)
            }
            className="ci-input"
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
            className="ci-button-primary"
            >

            {generatingAi
                ? "Generating..."
                : "Generate AI Questions"}

            </button>

        </div>

        </div>
        <div className="mt-6 rounded-xl border p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-bold">

            Manual Question Creation

          </h2>

          <div className="space-y-4">

            <textarea
              placeholder="Question text"
              value={questionText}
              onChange={(e) =>
                setQuestionText(e.target.value)
              }
              className="ci-input"
              rows={4}
            />

            <select
              value={questionType}
              onChange={(e) =>
                setQuestionType(e.target.value)
              }
              className="ci-input"
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
                className="ci-input"
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
                      className="ci-input"
                    />

                  </div>

                ))}

              </div>

            )}

            <button
              onClick={createQuestion}
              disabled={creatingQuestion}
              className="ci-button-primary"
            >

              {creatingQuestion
                ? "Creating..."
                : "Create Question"}

            </button>

          </div>

        </div>
  </div>
{/* {notification && (

  <div
    className={`mb-6 rounded-lg border p-4 ${
      notification.type === "success"
        ? "border-green-300 bg-green-50 text-green-700"
        : "border-red-300 bg-red-50 text-red-700"
    }`}
  >

    {notification.message}

  </div>

)} */}
{notification && (

  <Toast
    message={notification.message}
    type={notification.type}
  />

)}
  {/* RIGHT PANEL */}
  <div className="xl:col-span-2">
    
    <div className="ci-card p-6">

      <h2 className="mb-6 text-xl font-bold">
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
                className="ci-button-primary"
                
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
                  className="ci-button-primary"
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
                handleRemoveGeneratedQuestionClick(
                  index
                )
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
      <ConfirmDialog
        open={deleteMaterialOpen}
        title="Delete Material"
        description="This material and its uploaded file reference will be removed from the topic."
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        loading={
          deletingMaterialId !== null
        }
        onConfirm={
          handleConfirmDeleteMaterial
        }
        onCancel={() => {
          setDeleteMaterialOpen(false);
          setSelectedMaterialId(null);
        }}
      />

      <ConfirmDialog
        open={removeQuestionOpen}
        title="Remove Generated Question"
        description="This generated draft question will be removed from the review list."
        confirmText="Remove"
        cancelText="Cancel"
        danger={true}
        loading={false}
        onConfirm={
          handleConfirmRemoveGeneratedQuestion
        }
        onCancel={() => {
          setRemoveQuestionOpen(false);
          setSelectedGeneratedIndex(null);
        }}
      />

    </div>
  </RoleGuard>
  );
}
