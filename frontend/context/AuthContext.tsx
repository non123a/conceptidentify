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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {

    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    try {

      const response = await api.get("/auth/me/");

      setUser(response.data.data);

    } catch (error) {

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

    } finally {

      setLoading(false);

    }
  };

//   const login = async (
//     username: string,
//     password: string
//   ) => {

//     try {

//       const response = await api.post("/auth/login/", {
//         username,
//         password,
//       });

//       const data = response.data.data;

//       localStorage.setItem("access", data.access);
//       localStorage.setItem("refresh", data.refresh);

//       setUser(data.user);

//       return true;

//     } catch (error) {

//       return false;

//     }
//   };
  const login = async (
    username: string,
    password: string
    ) => {

    try {

        setLoading(true);

        const response = await api.post("/auth/login/", {
        username,
        password,
        });

        const data = response.data.data;

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        // Fetch fresh user from backend
        const meResponse = await api.get("/auth/me/");

        setUser(meResponse.data.data);

        return true;

    } catch (error) {
        console.log(error.response?.data);
        return false;

    } finally {

        setLoading(false);

    }
    };
  const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
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