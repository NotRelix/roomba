import z from "zod";
import { SelectUser } from "@repo/shared/types";

export type userPayloadEnv = {
  Variables: {
    user: userPayloadType;
  };
};

export type RegisterEnv = {
  Variables: {
    validatedData: registerType;
  };
};

export type LoginEnv = {
  Variables: {
    user: SelectUser;
  };
};

export type userPayloadType = {
  id: number;
  sub: string;
  exp: number;
};

export type registerType = z.infer<typeof registerValidator>;

export type loginType = z.infer<typeof loginValidator>;

export type safeUser = Omit<SelectUser, "password">;

export const registerValidator = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name must not be empty")
    .max(16, "First name must be under 16 characters")
    .toLowerCase(),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name must not be empty")
    .max(16, "Last name must be under 16 characters")
    .toLowerCase(),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(16, "Username must be under 16 characters")
    .toLowerCase(),
  email: z.email().trim().min(1, "Email must not be empty").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be under 255 characters"),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters")
    .max(255, "Confirm password must be under 255 characters"),
});

export const loginValidator = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(16, "Username must be under 16 characters")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be under 255 characters"),
});
