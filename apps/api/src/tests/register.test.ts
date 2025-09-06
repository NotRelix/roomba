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

    expect(result.success).toBeTruthy();
    expect(result.user.username).toBe(registerUser1.username);
    expect(result.token).toBeDefined();
  });

  it("should add multiple users", async () => {
    const result1 = await registerUser(registerUser1);
    const result2 = await registerUser(registerUser2);

    expect(result1.user.username).toBe(registerUser1.username);
    expect(result2.user.username).toBe(registerUser2.username);
  });

  it("should prevent duplicate usernames", async () => {
    const result1 = await registerUser(registerUser1);
    const result2 = await registerUser(duplicateUsername);

    expect(result1.user.username).toBe(registerUser1.username);
    expect(result2.notifs[0]).toBe("Username already exists");
  });

  it("should prevent duplicate emails", async () => {
    const result1 = await registerUser(registerUser1);
    const result2 = await registerUser(duplicateEmail);

    expect(result1.user.username).toBe(registerUser1.username);
    expect(result2.notifs[0]).toBe("Email already exists");
  });

  it("should prevent wrong passwords", async () => {
    const result = await registerUser(wrongPassword);

    expect(result.notifs[0]).toBe("Passwords do not match");
  });
});
