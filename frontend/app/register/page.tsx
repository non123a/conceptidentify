"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import api from "@/lib/api";

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
  const handleGoogleRegister = async (
    credentialResponse: any
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

    } catch (error: any) {

      console.log(error);

      setError(
        error?.response?.data?.message ||
        "Google login failed"
      );
    }
  };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {

    setError("");
    setSuccess("");

    const result = await register(form);

    if (result.success) {

      setSuccess(result.message);

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } else {

      setError(result.message);

    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6 py-12">

      <div className="ci-card w-full max-w-md p-8">

        <h1 className="mb-6 text-xl font-bold">
          Register
        </h1>

        {error && (
          <p className="mb-4 text-red-500">
            {error}
          </p>
        )}

        {success && (
          <p className="mb-4 text-green-600">
            {success}
          </p>
        )}

        <input
          placeholder="Username"
          className="mb-3 ci-input"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          className="mb-3 ci-input"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          placeholder="First Name"
          className="mb-3 ci-input"
          value={form.first_name}
          onChange={(e) =>
            setForm({
              ...form,
              first_name: e.target.value,
            })
          }
        />

        <input
          placeholder="Last Name"
          className="mb-3 ci-input"
          value={form.last_name}
          onChange={(e) =>
            setForm({
              ...form,
              last_name: e.target.value,
            })
          }
        />

        <select
          className="mb-3 ci-input"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
        >
          <option value="">
            Select Role
          </option>
          <option value="student">
            Student
          </option>

          <option value="lecturer">
            Lecturer
          </option>
        </select>

        <input
          type="password"
          placeholder="Password"
          className="mb-3 ci-input"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="mb-6 ci-input"
          value={form.confirm_password}
          onChange={(e) =>
            setForm({
              ...form,
              confirm_password: e.target.value,
            })
          }
        />

        <button
          onClick={handleRegister}
          className="ci-button-primary w-full"
        >
          Register
        </button>
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">
            Already have an account?
          </span>

          <Link
            href="/login"
            className="ml-1 text-blue-600 hover:underline"
          >
            Login
          </Link>
        </div>
        <div className="mt-4 flex justify-center">

          {form.role ? (

            <GoogleLogin
              onSuccess={handleGoogleRegister}
              onError={() =>
                setError("Google login failed")
              }
            />

          ) : (

            <p className="text-sm text-gray-500">
              Select a role first, To use Google Register
            </p>

          )}

        </div>

      </div>

    </div>
  );
}