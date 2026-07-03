"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/ui/Toast";

type Course = {
  id: number;
  name: string;
  description: string;
  join_code: string;
  lecturer: {
    first_name: string;
    last_name: string;
  };
  student_count: number;
};

type Topic = {
  id: number;
  name: string;
  description: string;
  material_count: number;
  question_count: number;
};

type StudentAnalytics = {
  topic: string;
  performance: number;
  has_data: boolean;
};

export default function CourseDetailPage() {
  const params = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [studentAnalytics, setStudentAnalytics] = useState<StudentAnalytics[]>([]);
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchCourse = useCallback(async () => {
    try {
      const [courseResponse, topicsResponse] = await Promise.all([
        api.get(`/courses/${params.id}/`),
        api.get(`/courses/${params.id}/topics/`),
      ]);

      if (user?.role === "student") {
        const analyticsResponse = await api.get(
          `/courses/${params.id}/student-analytics/`
        );
        setStudentAnalytics(analyticsResponse.data.analytics);
      }

      setCourse(courseResponse.data.data);
      setTopics(topicsResponse.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params.id, user]);

  const createTopic = async () => {
    if (!topicName.trim()) {
      setNotification({
        type: "error",
        message: "Topic name is required",
      });
      return;
    }

    try {
      await api.post(`/courses/${params.id}/topics/create/`, {
        name: topicName,
        description: topicDescription,
      });

      setShowCreateTopicModal(false);
      setTopicName("");
      setTopicDescription("");
      setNotification({
        type: "success",
        message: "Topic created successfully.",
      });
      fetchCourse();
    } catch (error) {
      console.error(error);
      setNotification({
        type: "error",
        message: "Failed to create topic.",
      });
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchCourse);
  }, [fetchCourse]);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification]);

  if (loading) {
    return (
      <div className="ci-loading-state ci-page min-h-[calc(100vh-73px)]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
        <p className="text-sm font-medium text-slate-600">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="ci-empty-state ci-page min-h-[calc(100vh-73px)]">
        <p className="text-base font-semibold text-slate-950">Course not found</p>
        <p className="text-sm text-slate-600">
          The requested course may have been removed or you may not have access.
        </p>
      </div>
    );
  }

  return (
    <>
      {notification && <Toast message={notification.message} type={notification.type} />}

      <div className="ci-page space-y-10">
        <section className="ci-card p-6 sm:p-8">
          <h1 className="ci-title">{course.name}</h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            {course.description || "No description"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="ci-badge ci-badge-neutral">
              Lecturer: {course.lecturer.first_name} {course.lecturer.last_name}
            </span>
            <span className="ci-badge ci-badge-neutral">Join Code: {course.join_code}</span>
            <span className="ci-badge ci-badge-neutral">Students: {course.student_count}</span>
          </div>
        </section>

        {user?.role === "student" && (
          <section className="ci-card p-6 sm:p-8">
            <h2 className="ci-section-title mb-4">My Learning Progress</h2>

            {studentAnalytics.length === 0 ? (
              <div className="ci-empty-state">
                <p className="text-base font-semibold text-slate-950">
                  No learning data available yet.
                </p>
                <p className="text-sm text-slate-600">
                  Progress will appear once you complete topic activities.
                </p>
              </div>
            ) : (
              <div className="ci-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAnalytics.map((topic) => (
                      <tr key={topic.topic}>
                        <td>{topic.topic}</td>
                        <td>
                          {!topic.has_data ? (
                            <span className="ci-badge ci-badge-neutral">No Data Yet</span>
                          ) : topic.performance < 40 ? (
                            <span className="ci-badge ci-badge-failed">Weak</span>
                          ) : topic.performance < 70 ? (
                            <span className="ci-badge ci-badge-processing">Needs Improvement</span>
                          ) : (
                            <span className="ci-badge ci-badge-ready">Strong</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="ci-section-title">Topics</h2>

            <div className="flex gap-3">
              {user?.role === "lecturer" && (
                <Link
                  href={`/courses/${params.id}/analytics`}
                  className="ci-button-primary"
                >
                  Class Analytics
                </Link>
              )}

              {user?.role === "lecturer" && (
                <button
                  onClick={() => setShowCreateTopicModal(true)}
                  className="ci-button-primary"
                >
                  + Create Topic
                </button>
              )}
            </div>
          </div>

          {topics.length === 0 ? (
            <div className="ci-empty-state">
              <p className="text-base font-semibold text-slate-950">No topics available.</p>
              <p className="text-sm text-slate-600">
                Create the first topic to start organizing materials and questions.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {topics.map((topic) => (
                <article
                  key={topic.id}
                  className="ci-card ci-card-hover p-6 transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold text-slate-950">{topic.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {topic.description || "No description"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
                    <span className="ci-badge ci-badge-neutral">Materials: {topic.material_count}</span>
                    <span className="ci-badge ci-badge-neutral">Questions: {topic.question_count}</span>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {user?.role === "lecturer" ? (
                      <>
                        <Link
                          href={`/courses/${params.id}/topics/${topic.id}/create`}
                          className="ci-button-primary text-center"
                        >
                          Create Questions
                        </Link>
                        <Link
                          href={`/courses/${params.id}/topics/${topic.id}/questions`}
                          className="ci-button-secondary text-center"
                        >
                          Question Bank
                        </Link>
                        <Link
                          href={`/courses/${params.id}/topics/${topic.id}/analytics`}
                          className="ci-button-secondary text-center"
                        >
                          Analytics
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href={`/courses/${params.id}/topics/${topic.id}`}
                          className="ci-button-primary text-center"
                        >
                          Answer Questions
                        </Link>
                        <Link
                          href={`/courses/${params.id}/topics/${topic.id}/student-analytics`}
                          className="ci-button-secondary text-center"
                        >
                          My Performance
                        </Link>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {showCreateTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-6 backdrop-blur-sm">
          <div className="ci-card w-full max-w-md rounded-3xl p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
            <h2 className="mb-4 text-xl font-semibold text-slate-950">Create Topic</h2>

            <input
              placeholder="Topic Name"
              className="mb-3 ci-input"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
            />

            <textarea
              placeholder="Description"
              className="mb-4 ci-input"
              value={topicDescription}
              onChange={(e) => setTopicDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateTopicModal(false)}
                className="ci-button-secondary"
              >
                Cancel
              </button>

              <button onClick={createTopic} className="ci-button-primary">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
