
"use client";
import RoleGuard from "@/components/RoleGuard";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";

type Topic = {
  id: number;
  name: string;
  description: string;
};

export default function AnalyticsPage() {

  const params = useParams();

  const [topic, setTopic] =
    useState<Topic | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchPage();

  }, []);

  const fetchPage = async () => {

    try {

      const response = await api.get(
        `/topics/${params.topicId}/`
      );

      setTopic(
        response.data.data
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
        Loading analytics...
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
          Topic Analytics
        </h1>

        <p className="mt-3 text-gray-600">

          {topic.name}

        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Average Score
          </h2>

          <p className="mt-4 text-4xl font-bold">
            --
          </p>

        </div>

        <div className="rounded-xl border p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Questions Attempted
          </h2>

          <p className="mt-4 text-4xl font-bold">
            --
          </p>

        </div>

        <div className="rounded-xl border p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Weak Concepts
          </h2>

          <p className="mt-4 text-4xl font-bold">
            --
          </p>

        </div>

        <div className="rounded-xl border p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Student Participation
          </h2>

          <p className="mt-4 text-4xl font-bold">
            --
          </p>

        </div>

      </div>

      <div className="mt-10 rounded-xl border p-10 shadow-sm">

        <h2 className="text-2xl font-bold">

          Performance Visualization

        </h2>

        <div className="mt-8 flex h-80 items-center justify-center rounded-lg border border-dashed text-gray-400">

          Chart visualization will be implemented here.

        </div>

      </div>

    </div>
    </RoleGuard>
  );
}

