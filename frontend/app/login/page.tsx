"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";
import Link from "next/link";
import {
  isAuthenticatedAppPath,
  LAST_AUTHENTICATED_PATH_KEY,
} from "@/components/Navbar";

const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

export default function LoginPage() {

  const { user, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const lastAuthenticatedPath =
      window.sessionStorage.getItem(
        LAST_AUTHENTICATED_PATH_KEY
      );

    const redirectPath =
      lastAuthenticatedPath &&
      isAuthenticatedAppPath(
        lastAuthenticatedPath
      )
        ? lastAuthenticatedPath
        : DEFAULT_AUTHENTICATED_PATH;

    router.replace(redirectPath);
  }, [loading, router, user]);

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

  if (loading || user) {
    return (
      <div className="ci-page">
        Loading...
      </div>
    );
  }

  const handleLogin = async () => {

    console.log("BUTTON CLICKED");

    const result = await login(
      username,
      password
    );

    console.log("LOGIN RESULT:", result);

    if (result.success) {

      console.log("REDIRECTING");

      window.location.href = "/dashboard";

    } else {

      setError(result.message || "Invalid username or password");

    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6 py-12">

      <div className="ci-card w-full max-w-md p-8">

        <h1 className="mb-6 text-xl font-bold">
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
          className="mb-4 ci-input"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 ci-input"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {/* <button
          onClick={handleLogin}
          className="ci-button-primary w-full"
        >
          Login
          
        </button> */}
        <button
          onClick={handleLogin}
          className="ci-button-primary w-full"
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
