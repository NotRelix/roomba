"use client";

import type { ApiResponse, ValidatedData } from "@repo/types/api";
import { UserPayloadType } from "@repo/types/user";
import axios from "axios";
import { createContext, type ReactNode, useEffect, useState } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  username: string | undefined;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserPayloadType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await axios.get<ApiResponse<ValidatedData>>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/validate`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        setIsAuthenticated(false);
        return;
      }

      setUser(response.data.data.user);
      setIsAuthenticated(true);
    };

    validateToken();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username: user?.sub, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
