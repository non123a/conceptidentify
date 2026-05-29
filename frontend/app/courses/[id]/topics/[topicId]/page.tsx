"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Topic = {
  id: number;
  name: string;
  description: string;
  material_count: number;
  question_count: number;
};

export default function TopicPage() {

  const params = useParams();
  const { user } = useAuth();

  const [topic, setTopic] =
    useState<Topic | null>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchTopic = async () => {

    try {

        const [
        topicResponse,
        ] = await Promise.all([

        api.get(
            `/topics/${params.topicId}/`
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

  useEffect(() => {

    void Promise.resolve().then(fetchTopic);

  }, []);
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

      <p className="mt-4 text-gray-600">
        {topic.description || "No description"}
      </p>

      <div className="mt-10 rounded-xl border p-6 shadow-sm">

        {user?.role === "lecturer" ? (

          <div className="grid gap-3 md:grid-cols-3">

            <Link
              href={`/courses/${params.id}/topics/${params.topicId}/create`}
              className="rounded-lg border bg-black px-4 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
            >
              Create Questions
            </Link>

            <Link
              href={`/courses/${params.id}/topics/${params.topicId}/questions`}
              className="rounded-lg border px-4 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
            >
              Question Bank
            </Link>

            <Link
              href={`/courses/${params.id}/topics/${params.topicId}/analytics`}
              className="rounded-lg border px-4 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
            >
              Analytics
            </Link>

          </div>

        ) : (

          <div>
            <h2 className="text-2xl font-bold">
              Topic Quiz
            </h2>
            <p className="mt-3 text-gray-600">
              Answer questions and review your results from this topic.
            </p>
          </div>

        )}

      </div>

    <div className="mt-10">

    <h2 className="mb-6 text-3xl font-bold">
        Materials
    </h2>

    </div>

    </div>
  );
}
