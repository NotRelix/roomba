"use client";

import { FormEvent, useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import Link from "next/link";
import { RegisterType } from "@repo/types/user";
import type { ApiResponse, RegisterData } from "@repo/types/api";
import axios from "axios";

const emptyRegisterData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [formData, setFormData] = useState<RegisterType>(emptyRegisterData);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post<ApiResponse<RegisterData>>(
        `${process.env.NEXT_PUBLIC_API_URL!}/auth/register`,
        formData,
      );
      console.log(data);
    } catch (err) {
      if (!axios.isAxiosError<ApiResponse>(err)) {
        console.error(err);
        return;
      }
      console.log(err.response?.data.notifs);
    }
  };

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="border-1 bg-card flex h-fit w-full max-w-[450px] flex-col gap-6 rounded-lg p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-semibold">Register</h1>
          <p>
            Don't have an account yet?{" "}
            <Link
              className="text-blue-600 underline dark:text-blue-400"
              href={"/login"}
            >
              Login
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col gap-3">
              <Label htmlFor="firstName" className="text-muted-foreground">
                First Name
              </Label>
              <Input
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                type="text"
                id="firstName"
                placeholder="Jimmy"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="lastName" className="text-muted-foreground">
                Last Name
              </Label>
              <Input
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                type="text"
                id="lastName"
                placeholder="James"
              />
            </div>
          </div>
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
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              type="email"
              id="email"
              placeholder="theman@email.com"
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
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="confirmPassword" className="text-muted-foreground">
              Confirm password
            </Label>
            <Input
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              type="password"
              id="confirmPassword"
              placeholder="Enter password again"
            />
          </div>
          <Button
            type="submit"
            variant="ghost"
            className="border-1 mt-2 max-w-48"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
