import { useEffect, useState } from "react";
import axios from "axios";
import type { ApiResponse, ValidatedData } from "@repo/types/api";
import { UserPayloadType } from "@repo/types/user";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserPayloadType | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await axios.get<ApiResponse<ValidatedData>>(
        `${process.env.API_URL}/auth/validate`,
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

  return { isAuthenticated, user };
};
