"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";
import Link from "next/link";
export default function LoginPage() {

  const { login } = useAuth();

  const handleGoogleLogin = async (
    credentialResponse: any
  ) => {

    try {

      const response = await api.post(
        "/auth/google/",
        {
          credential:
            credentialResponse.credential,
        }
      );

      if (
        response.data.success
      ) {

        window.location.href =
          "/dashboard";
      }

    } catch (error: any) {

      setError(
        error?.response?.data?.message ||
        "Google login failed"
      );
    }
  };
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

        {/* <button
          onClick={handleLogin}
          className="w-full rounded bg-black p-3 text-white"
        >
          Login
          
        </button> */}
        <button
          onClick={handleLogin}
          className="w-full rounded bg-black p-3 text-white"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600">
            Don't have an account?
          </span>

          <Link
            href="/register"
            className="ml-1 font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </div>
                <div className="my-4 text-center text-gray-500">
          OR
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() =>
              setError(
                "Google login failed"
              )
            }
          />
        </div>
      </div>

    </div>
  );
}