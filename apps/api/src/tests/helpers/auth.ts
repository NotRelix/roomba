import type { registerType } from "@repo/types/user";
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
