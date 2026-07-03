"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";
import Link from "next/link";
import GuestOnlyRoute from "@/components/GuestOnlyRoute";

type GoogleCredentialResponse = {
  credential?: string | null;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getErrorMessage(error: unknown, fallback: string) {
  const typedError = error as ApiError;
  return typedError?.response?.data?.message || fallback;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    try {
      const response = await api.post("/auth/google/", {
        credential: credentialResponse.credential,
      });

      if (response.data.success) {
        window.location.href = "/dashboard";
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Google login failed"));
    }
  };

  const handleLogin = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        window.location.href = "/dashboard";
        return;
      }

      setError(result.message || "Invalid username or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordFieldId = "login-password";

  return (
    <GuestOnlyRoute>
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_28%),linear-gradient(to_bottom,_#ffffff,_#f8fafc_40%,_#f8fafc)]" />

        <div className="ci-page flex min-h-[calc(100vh-73px)] items-center py-12">
          <div className="grid w-full items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <aside className="hidden lg:flex lg:flex-col lg:justify-between">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Welcome back
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 xl:text-5xl">
                    ConceptIdentify
                  </h1>
                  <p className="max-w-lg text-lg leading-8 text-slate-600">
                    Sign in to review your materials, continue your learning
                    workflow, and access topic-level insights in one place.
                  </p>
                </div>
              </div>

              <div className="ci-card border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  What you can do
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>• Access your lecturer or student dashboard</li>
                  <li>• Continue topic practice and analytics review</li>
                  <li>• Return to your uploaded materials and generated items</li>
                </ul>
              </div>
            </aside>

            <section className="ci-card w-full rounded-3xl border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
              <div className="mx-auto max-w-xl space-y-8">
                <div className="space-y-3 lg:hidden">
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Welcome back
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                      ConceptIdentify
                    </h1>
                    <p className="text-sm leading-7 text-slate-600">
                      Sign in to continue your academic workflow and access
                      topic-level insights.
                    </p>
                  </div>
                </div>

                <header className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Login
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Sign in to your account
                  </h2>
                  <p className="text-sm leading-7 text-slate-600">
                    Use your credentials to access the dashboard and learning
                    tools.
                  </p>
                </header>

                {error ? (
                  <div
                    role="alert"
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700"
                  >
                    {error}
                  </div>
                ) : null}

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="login-username"
                      className="text-sm font-medium text-slate-700"
                    >
                      Username
                    </label>
                    <input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username"
                      className="ci-input h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError("");
                      }}
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={passwordFieldId}
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id={passwordFieldId}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="ci-input h-12 rounded-2xl border-slate-200 bg-white px-4 pr-12 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError("");
                        }}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="absolute inset-y-0 right-3 flex items-center rounded-full px-2 text-slate-500 transition-colors hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                      >
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          {showPassword ? (
                            <>
                              <path
                                d="M3 3l18 18"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                              />
                              <path
                                d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                              />
                              <path
                                d="M9.88 5.08A9.77 9.77 0 0 1 12 5c5.25 0 9.27 3.58 11 7-.68 1.34-1.61 2.74-2.75 4M6.11 6.11C3.65 7.67 1.74 9.99 1 12c1.73 3.42 5.75 7 11 7 1.19 0 2.33-.13 3.39-.37"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                              />
                            </>
                          ) : (
                            <>
                              <path
                                d="M2.75 12S6.5 5 12 5s9.25 7 9.25 7-3.75 7-9.25 7S2.75 12 2.75 12Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                              />
                              <path
                                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                              />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={isSubmitting}
                    className="ci-button-primary w-full rounded-2xl px-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                    type="button"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-3">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Signing in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 text-center">
                  <div className="text-sm text-slate-600">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="font-medium text-sky-700 underline-offset-4 hover:text-sky-800 hover:underline"
                    >
                      Register
                    </Link>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                      Or
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => setError("Google login failed")}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </GuestOnlyRoute>
  );
}
