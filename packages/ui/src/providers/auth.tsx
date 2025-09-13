"use client";

import type { ApiResponse, ValidatedData } from "@repo/types/api";
import { UserPayloadType } from "@repo/types/user";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  username: string | undefined;
  login: (str: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: any;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserPayloadType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const validateToken = async () => {
      setIsAuthLoading(true);
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
      if (!token) {
        setIsAuthenticated(false);
        setIsAuthLoading(false);
        return;
      }

      try {
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
          setUser(null);
          return;
        }

        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    validateToken();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username: user?.sub,
        login,
        logout,
      }}
    >
      {isAuthLoading ? null : children}
    </AuthContext.Provider>
  );
};
