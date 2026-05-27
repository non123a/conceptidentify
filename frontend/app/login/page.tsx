"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {

  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async () => {

    console.log("BUTTON CLICKED");

    const success = await login(
      username,
      password
    );

    console.log("LOGIN RESULT:", success);

    if (success) {

      console.log("REDIRECTING");

      window.location.href = "/dashboard";

    } else {

      setError("Invalid username or password");

    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded bg-white p-8 shadow">

        <h1 className="mb-6 text-2xl font-bold">
          Login
        </h1>

        {error && (
          <p className="mb-4 text-red-500">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="mb-4 w-full rounded border p-3"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded border p-3"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          className="w-full rounded bg-black p-3 text-white"
        >
          Login
        </button>

      </div>

    </div>
  );
}