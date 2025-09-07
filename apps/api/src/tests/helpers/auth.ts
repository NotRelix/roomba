import type { loginType, registerType } from "@repo/types/user";
import { app } from "#index";
import { testClient } from "hono/testing";

const client = testClient(app);

export const registerUser = async (user: registerType) => {
  const response = await client.auth.register.$post({ json: user });
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.notifs[0]);
  }
  return result;
};

export const loginUser = async (user: loginType) => {
  const response = await client.auth.login.$post({ json: user });
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.notifs[0]);
  }
  return result;
};
