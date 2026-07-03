"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import api from "@/lib/api";
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

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGoogleRegister = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    try {
      const response = await api.post(
        "/auth/google/",
        {
          credential:
            credentialResponse.credential,
          role: form.role,
        }
      );

      console.log(response.data);

      // if (response.data.pending) {

      //   setSuccess(response.data.message);
      //   return;
      // }
      if (response.data.pending) {
        setSuccess(
          response.data.message
        );

        setTimeout(() => {
          window.location.href =
            "/login";
        }, 2000);

        return;
      }

      window.location.href = "/dashboard";
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Google login failed"));
    }
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const result = await register(form);

      if (result.success) {
        setSuccess(result.message);

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);

        return;
      }

      setError(result.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordFieldId = "register-password";
  const confirmPasswordFieldId = "register-confirm-password";

  return (
    <GuestOnlyRoute>
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_28%),linear-gradient(to_bottom,_#ffffff,_#f8fafc_40%,_#f8fafc)]" />

        <div className="ci-page flex min-h-[calc(100vh-73px)] items-center py-12">
          <div className="grid w-full items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <aside className="hidden lg:flex lg:flex-col lg:justify-between">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Create your account
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 xl:text-5xl">
                    Join ConceptIdentify
                  </h1>
                  <p className="max-w-lg text-lg leading-8 text-slate-600">
                    Register to manage materials, generate questions, and track
                    concept-level learning outcomes in a modern academic
                    workspace.
                  </p>
                </div>
              </div>

              <div className="ci-card border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Built for
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>• Students practicing concept mastery</li>
                  <li>• Lecturers reviewing generated learning material</li>
                  <li>• Academic teams tracking learning analytics</li>
                </ul>
              </div>
            </aside>

            <section className="ci-card w-full rounded-3xl border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
              <div className="mx-auto max-w-xl space-y-8">
                <div className="space-y-3 lg:hidden">
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Create your account
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                      Join ConceptIdentify
                    </h1>
                    <p className="text-sm leading-7 text-slate-600">
                      Register to access materials, practice tools, and
                      learning analytics.
                    </p>
                  </div>
                </div>

                <header className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Register
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Create your account
                  </h2>
                  <p className="text-sm leading-7 text-slate-600">
                    Use the form below to set up your profile and start using
                    the platform.
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

                {success ? (
                  <div
                    role="status"
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
                  >
                    {success}
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="register-username">
                      Username
                    </label>
                    <input
                      id="register-username"
                      placeholder="Enter your username"
                      className="ci-input h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      value={form.username}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          username: e.target.value,
                        })
                      }
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="register-email">
                      Email
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      className="ci-input h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="register-first-name">
                      First Name
                    </label>
                    <input
                      id="register-first-name"
                      placeholder="First name"
                      className="ci-input h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      value={form.first_name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          first_name: e.target.value,
                        })
                      }
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="register-last-name">
                      Last Name
                    </label>
                    <input
                      id="register-last-name"
                      placeholder="Last name"
                      className="ci-input h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      value={form.last_name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          last_name: e.target.value,
                        })
                      }
                      autoComplete="family-name"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="register-role">
                      Role
                    </label>
                    <select
                      id="register-role"
                      className="ci-input h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                      value={form.role}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Select role
                      </option>
                      <option value="student">
                        Student
                      </option>
                      <option value="lecturer">
                        Lecturer
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor={passwordFieldId}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id={passwordFieldId}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="ci-input h-12 rounded-2xl border-slate-200 bg-white px-4 pr-12 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                        value={form.password}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            password: e.target.value,
                          })
                        }
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
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
                            <path
                              d="M3 3l18 18M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58M9.88 5.08A9.77 9.77 0 0 1 12 5c5.25 0 9.27 3.58 11 7-.68 1.34-1.61 2.74-2.75 4M6.11 6.11C3.65 7.67 1.74 9.99 1 12c1.73 3.42 5.75 7 11 7 1.19 0 2.33-.13 3.39-.37"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                            />
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

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor={confirmPasswordFieldId}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id={confirmPasswordFieldId}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="ci-input h-12 rounded-2xl border-slate-200 bg-white px-4 pr-12 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]"
                        value={form.confirm_password}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            confirm_password: e.target.value,
                          })
                        }
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        aria-label={
                          showConfirmPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showConfirmPassword}
                        onClick={() =>
                          setShowConfirmPassword((visible) => !visible)
                        }
                        className="absolute inset-y-0 right-3 flex items-center rounded-full px-2 text-slate-500 transition-colors hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                      >
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          {showConfirmPassword ? (
                            <path
                              d="M3 3l18 18M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58M9.88 5.08A9.77 9.77 0 0 1 12 5c5.25 0 9.27 3.58 11 7-.68 1.34-1.61 2.74-2.75 4M6.11 6.11C3.65 7.67 1.74 9.99 1 12c1.73 3.42 5.75 7 11 7 1.19 0 2.33-.13 3.39-.37"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                            />
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
                    onClick={handleRegister}
                    disabled={isSubmitting}
                    className="ci-button-primary w-full rounded-2xl px-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-3">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating account...
                      </span>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>

                <div className="border-t border-slate-200 pt-6 text-center">
                  <div className="text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-sky-700 underline-offset-4 hover:text-sky-800 hover:underline"
                    >
                      Login
                    </Link>
                  </div>

                  <div className="mt-5 flex items-center gap-4 text-slate-400">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                      Or
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="mt-5 flex justify-center">
                    {form.role ? (
                      <GoogleLogin
                        onSuccess={handleGoogleRegister}
                        onError={() => setError("Google login failed")}
                      />
                    ) : (
                      <p className="max-w-sm text-sm leading-6 text-slate-500">
                        Select a role first to use Google Register.
                      </p>
                    )}
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
