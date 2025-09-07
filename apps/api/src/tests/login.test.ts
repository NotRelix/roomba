import { beforeAll, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";
import { loginUser, registerUser } from "#tests/helpers/auth";
import {
  loginUser1,
  loginWrongPassword,
  loginWrongUsername,
  registerUser1,
} from "#tests/data/user";

beforeAll(async () => {
  await resetDb();
  await registerUser(registerUser1);
});

describe("Login test", () => {
  it("should login user", async () => {
    const result = await loginUser(loginUser1);

    expect(result.data.token).toBeDefined();
  });

  it("should prevent wrong username", async () => {
    await expect(loginUser(loginWrongUsername)).rejects.toThrow(
      "Invalid username or password"
    );
  });

  it("should prevent wrong password", async () => {
    await expect(loginUser(loginWrongPassword)).rejects.toThrow(
      "Invalid username or password"
    );
  });
});
