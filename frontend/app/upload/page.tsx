"use client";

import { useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import api from "@/lib/api";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [topicId, setTopicId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file");
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

        setMessage(response.data.message);

    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
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
          className="w-full"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button
          type="submit"
          className="ci-button-primary"
        >
          Upload
        </button>
      </form>

      {message && (
        <p className="mt-4">
          {message}
        </p>
      )}
    </div>
    </RoleGuard>
  );
}
