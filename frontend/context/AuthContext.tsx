"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
    first_name: string;
    last_name: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;

  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; role: string | null; message?: string }>;

  register: (
    data: {
      username: string;
      email: string;
      first_name: string;
      last_name: string;
      role: string;
      password: string;
      confirm_password: string;
    }
  ) => Promise<{
    success: boolean;
    message: string;
  }>;

  // logout: () => void;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {

    try {

      const response = await api.get("/auth/me/");

      setUser((prev) => prev ? prev : response.data.data);

    } catch (error: any) {

      setUser((prev) => prev ? prev : null);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchUser);
  }, []);
  const login = async (
    username: string,
    password: string
    ) => {

    try {

        setLoading(true);

        console.log("[AuthContext] Initiating login with payload:", { username, password: "***" });

        await api.post("/auth/login/", {
        username,
        password,
        });

        // Fetch fresh user from backend
        const meResponse = await api.get("/auth/me/");
        console.log("[AuthContext] Raw response from /auth/me/:", meResponse);

        setUser(meResponse.data.data);

        const returnObj = { success: true, role: meResponse.data.data.role };
        console.log("[AuthContext] Returning from login:", returnObj);
        return returnObj;

    } catch (error: any) {
        console.error("[AuthContext] Login Error:", error);
        return { 
            success: false, 
            role: null, 
            message: error?.response?.data?.message || "Login failed" 
        };

    } finally {

        setLoading(false);

    }
    };
  const register = async (data: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  password: string;
  confirm_password: string;
}) => {

  try {

    const response = await api.post(
      "/auth/register/",
      data
    );

    return {
      success: true,
      message: response.data.message,
    };

  } catch (error: any) {

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Registration failed",
    };
  }
};
  // const logout = async () => {

  //   try {
  //     await api.post("/auth/logout/");
  //   } catch (error) {
  //     console.log("Logout failed", error);
  //   }
  //   setUser(null);
  // };
  const logout = async () => {

  try {

    await api.post(
      "/auth/logout/"
    );

  } catch (error) {

    console.log(
      "Logout failed",
      error
    );

  }

  setUser(null);

  window.location.href =
    "/login";

};


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}
