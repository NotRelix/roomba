"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { ApiResponse, ValidatedData } from "@repo/types/api";
import { UserPayloadType } from "@repo/types/user";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserPayloadType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const logout = () => {
    localStorage.removeItem("token");
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

  return { isAuthenticated, user, logout };
};
