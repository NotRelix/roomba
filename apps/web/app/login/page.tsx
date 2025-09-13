"use client";

import { FormEvent, useContext, useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import Link from "next/link";
import { LoginType } from "@repo/types/user";
import type { ApiResponse, LoginData } from "@repo/types/api";
import axios from "axios";
import { MessageContext } from "@repo/ui/providers/message-provider";
import { useRouter } from "next/navigation";
import { useAuth } from "@repo/ui/hooks/auth";
import { isNotAuth } from "#components/is-auth";

const emptyLoginData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Login = () => {
  const [formData, setFormData] = useState<LoginType>(emptyLoginData);
  const { setErrors, setSuccess } = useContext(MessageContext)!;
  const { login } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post<ApiResponse<LoginData>>(
        `${process.env.NEXT_PUBLIC_API_URL!}/auth/login`,
        formData,
      );

      if (!data.success) {
        setErrors(data.notifs);
        return;
      }

      login(data.data.token);
      setSuccess(data.notifs);
      router.push("/");
    } catch (err) {
      if (!axios.isAxiosError<ApiResponse>(err)) {
        console.error(err);
        return;
      }
      setErrors(err.response?.data.notifs!);
    }
  };

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="border-1 bg-card flex h-fit w-full max-w-[450px] flex-col gap-6 rounded-lg p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-semibold">Login</h1>
          <p>
            Already have an account?{" "}
            <Link
              className="text-blue-600 underline dark:text-blue-400"
              href={"/register"}
            >
              Login
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="username" className="text-muted-foreground">
              Username
            </Label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              type="text"
              id="username"
              placeholder="themanwhocantbemoved"
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="password" className="text-muted-foreground">
              Password
            </Label>
            <Input
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              type="password"
              id="password"
              placeholder="Enter password"
              required
            />
          </div>
          <Button
            type="submit"
            variant="ghost"
            className="border-1 mt-2 max-w-48"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default isNotAuth(Login);
