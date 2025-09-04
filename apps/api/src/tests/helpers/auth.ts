import type { loginType, registerType } from "@repo/types/user";
import { app } from "#index";

export const registerUser = async (user: registerType) => {
  const registerResponse = await app.request("/auth/register", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(user),
  });
  const registerResult = await registerResponse.json();
  const token = registerResult.token;
  return token;
};

export const loginUser = async (user: loginType) => {
  const response = await app.request("/auth/login", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(user),
  });
  const result = await response.json();
  return result;
};
