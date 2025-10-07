import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;          
  loginLoading: boolean;     
  registerLoading: boolean;  
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
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.user);
      } catch (err: any) {
        if (err.response?.status !== 401) {
          console.error("Auth check failed:", err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setError(null);
    setRegisterLoading(true);
    
    try {
      await authService.register({
        name,
        email,
        password,
        confirmPassword,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setRegisterLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    setLoginLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    
    try {
      await authService.logout();
      setUser(null);
      window.location.href = "/";
    } catch (err: any) {
      const errorMessage = "Logout failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginLoading,
        registerLoading,
        error,
        setError,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};