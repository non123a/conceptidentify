"use client";

import { useEffect, useRef, useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import api from "@/lib/api";
import {
  MATERIAL_FILE_ACCEPT,
  MATERIAL_FILE_HELP_TEXT,
  validateMaterialFile,
} from "@/lib/materialFiles";
import {
  MATERIAL_PROCESSING_MESSAGES,
  MaterialStatus,
  isMaterialTerminal,
} from "@/lib/materialStatus";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [topicId, setTopicId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [materialId, setMaterialId] = useState<number | null>(null);
  const [processingStatus, setProcessingStatus] =
    useState<MaterialStatus | null>(null);
  const [polling, setPolling] = useState(false);
  const pollTimerRef = useRef<number | null>(null);

  const clearPollTimer = () => {
    if (pollTimerRef.current !== null) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const fetchMaterialStatus = async (id: number) => {
    const response = await api.get(`/materials/${id}/status/`);
    const status = response.data.data.processing_status as MaterialStatus;

    setProcessingStatus(status);
    if (isMaterialTerminal(status)) {
      setPolling(false);
      clearPollTimer();
    }
  };

  const startPolling = (id: number) => {
    clearPollTimer();
    setPolling(true);
    void fetchMaterialStatus(id);
    pollTimerRef.current = window.setInterval(() => {
      void fetchMaterialStatus(id);
    }, 4000);
  };

  useEffect(() => {
    return () => clearPollTimer();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const validationError = validateMaterialFile(file);

    if (validationError) {
      setMessage(validationError);
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("topic_id", topicId);
    formData.append("file", file);

    try {
        const response = await api.post(
            "/materials/upload/",
            formData
        );

        const status =
          (response.data.processing_status as MaterialStatus) || "PENDING";

        setMaterialId(response.data.material_id);
        setProcessingStatus(status);
        setMessage("");

        if (response.data.material_id) {
          startPolling(response.data.material_id);
        }

    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    }
  };

  const retryProcessing = async () => {
    if (!materialId) {
      return;
    }

    try {
      await api.post(`/materials/${materialId}/retry-processing/`);
      setProcessingStatus("PENDING");
      setMessage("");
      startPolling(materialId);
    } catch (error) {
      console.error(error);
      setMessage("Retry failed");
    }
  };

  return (
    <RoleGuard allowedRole="lecturer">
    <div className="ci-page">
      <h1 className="mb-6 text-3xl font-bold">
        Upload Material
      </h1>

      <form
        onSubmit={handleUpload}
        className="max-w-lg space-y-4"
      >
        <input
          type="text"
          placeholder="Material Title"
          className="ci-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Topic ID"
          className="ci-input"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
        />

        <input
          type="file"
          accept={MATERIAL_FILE_ACCEPT}
          className="w-full"
          onChange={(e) => {
            const selectedFile =
              e.target.files?.[0];

            if (selectedFile) {
              const validationError =
                validateMaterialFile(selectedFile);

              if (validationError) {
                setFile(null);
                setMessage(validationError);
                e.target.value = "";
                return;
              }

              setMessage("");
              setFile(selectedFile);
            }
          }}
        />

        <p className="text-sm text-gray-500">
          {MATERIAL_FILE_HELP_TEXT}
        </p>

        <button
          type="submit"
          className="ci-button-primary"
          disabled={polling}
        >
          Upload
        </button>
      </form>

      {processingStatus && (
        <div className="mt-4 rounded border bg-white p-4">
          <p className="font-semibold">Processing status: {processingStatus}</p>
          <p className="mt-2 text-sm text-gray-600">
            {MATERIAL_PROCESSING_MESSAGES[processingStatus]}
          </p>
          {processingStatus === "FAILED" && (
            <button
              type="button"
              onClick={retryProcessing}
              className="ci-button-secondary mt-3"
            >
              Retry processing
            </button>
          )}
        </div>
      )}

      {message && (
        <p className="mt-4">
          {message}
        </p>
      )}
    </div>
    </RoleGuard>
  );
}
