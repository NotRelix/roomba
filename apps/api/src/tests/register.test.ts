import { beforeEach, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";
import { registerUser } from "#tests/helpers/auth";
import {
  registerUser1,
  registerUser2,
  duplicateEmail,
  duplicateUsername,
  wrongPassword,
} from "#tests/data/user";

beforeEach(async () => {
  await resetDb();
});

describe("Register test", () => {
  it("should add user to database", async () => {
    const result = await registerUser(registerUser1);

    expect(result.data.user.username).toBe(registerUser1.username);
    expect(result.data.token).toBeDefined();
  });

  it("should add multiple users", async () => {
    const result1 = await registerUser(registerUser1);
    const result2 = await registerUser(registerUser2);

    expect(result1.data.user.username).toBe(registerUser1.username);
    expect(result2.data.user.username).toBe(registerUser2.username);
  });

  it("should prevent duplicate usernames", async () => {
    await registerUser(registerUser1);

    await expect(registerUser(duplicateUsername)).rejects.toThrow(
      "Username already exists"
    );
  });

  it("should prevent duplicate emails", async () => {
    await registerUser(registerUser1);

    await expect(registerUser(duplicateEmail)).rejects.toThrow(
      "Email already exists"
    );
  });

  it("should prevent wrong passwords", async () => {
    await expect(registerUser(wrongPassword)).rejects.toThrow(
      "Passwords do not match"
    );
  });
});
