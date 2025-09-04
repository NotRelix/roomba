import { beforeEach, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";
import { registerUser } from "#tests/helpers/auth";
import {
  user1,
  user2,
  duplicateEmail,
  duplicateUsername,
  wrongPassword,
} from "#tests/data/user";

beforeEach(async () => {
  await resetDb();
});

describe("Register test", () => {
  it("should add user to database", async () => {
    const result = await registerUser(user1);

    expect(result.success).toBeTruthy();
    expect(result.user.username).toBe(user1.username);
    expect(result.token).toBeDefined();
  });

  it("should add multiple users", async () => {
    const result1 = await registerUser(user1);
    const result2 = await registerUser(user2);

    expect(result1.user.username).toBe(user1.username);
    expect(result2.user.username).toBe(user2.username);
  });

  it("should prevent duplicate usernames", async () => {
    const result1 = await registerUser(user1);
    const result2 = await registerUser(duplicateUsername);

    expect(result1.user.username).toBe(user1.username);
    expect(result2.messages[0]).toBe("Username already exists");
  });

  it("should prevent duplicate emails", async () => {
    const result1 = await registerUser(user1);
    const result2 = await registerUser(duplicateEmail);

    expect(result1.user.username).toBe(user1.username);
    expect(result2.messages[0]).toBe("Email already exists");
  });

  it("should prevent wrong passwords", async () => {
    const result = await registerUser(wrongPassword);

    expect(result.messages[0]).toBe("Passwords do not match");
  });
});
