"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define the type for authentication context
interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Create a context with a default value of `undefined`
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(storedUser);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === "test@example.com" && password === "password123") {
      setUser(email);
      localStorage.setItem("user", email);
      return true; // Success
    }
    return false; // Failure
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext safely
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
