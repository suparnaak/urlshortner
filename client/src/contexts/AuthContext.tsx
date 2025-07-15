// client/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        if (err.response?.status !== 401) {
          console.error("Auth check failed:", err);
        }
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setError(null);
    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setUser(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      window.location.href = "/"; 
    } catch (err: any) {
      setError("Logout failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, setError, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
