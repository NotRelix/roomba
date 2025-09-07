import type { loginType, registerType } from "@repo/types/user";
import auth from "#routes/auth";
import { testClient } from "hono/testing";

const client = testClient(auth);

export const registerUser = async (user: registerType) => {
  const response = await client.register.$post({ json: user });
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.notifs[0]);
  }
  return result;
};

export const loginUser = async (user: loginType) => {
  const response = await client.login.$post({ json: user });
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.notifs[0]);
  }
  return result;
};
