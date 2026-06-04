"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {

  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "student",
    password: "",
    confirm_password: "",
  });

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded bg-white p-8 shadow">

        <h1 className="mb-6 text-2xl font-bold">
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
          className="mb-3 w-full rounded border p-3"
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
          className="mb-3 w-full rounded border p-3"
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
          className="mb-3 w-full rounded border p-3"
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
          className="mb-3 w-full rounded border p-3"
          value={form.last_name}
          onChange={(e) =>
            setForm({
              ...form,
              last_name: e.target.value,
            })
          }
        />

        <select
          className="mb-3 w-full rounded border p-3"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
        >
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
          className="mb-3 w-full rounded border p-3"
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
          className="mb-6 w-full rounded border p-3"
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
          className="w-full rounded bg-black p-3 text-white"
        >
          Register
        </button>

      </div>

    </div>
  );
}