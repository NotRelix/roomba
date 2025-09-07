import type { loginType, registerType } from "@repo/types/user";
import { app } from "#index";
import { testClient } from "hono/testing";

const client = testClient(app);

export const registerUser = async (user: registerType) => {
  const registerResponse = await app.request("/auth/register", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(user),
  });
  const registerResult = await registerResponse.json();
  return registerResult;
};

export const loginUser = async (user: loginType) => {
  const response = await client.auth.login.$post({ json: user });
  return response.json();
};
