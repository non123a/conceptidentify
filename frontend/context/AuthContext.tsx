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

  const fetchUser = async () => {

    try {

      const response = await api.get("/auth/me/");

      setUser(response.data.data);

    } catch {

      setUser(null);

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

        await api.post("/auth/login/", {
        username,
        password,
        });

        // Fetch fresh user from backend
        const meResponse = await api.get("/auth/me/");

        setUser(meResponse.data.data);

        return true;

    } catch (error) {
        console.log(error);
        return false;

    } finally {

        setLoading(false);

    }
    };
  const logout = async () => {

    try {
      await api.post("/auth/logout/");
    } catch (error) {
      console.log("Logout failed", error);
    }
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
