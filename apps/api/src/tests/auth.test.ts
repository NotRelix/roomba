import { resetDb } from "@repo/helpers/db";
import { beforeEach, describe, expect, it } from "vitest";
import { registerUser, validateUser } from "#tests/helpers/auth";
import { registerUser1 } from "#tests/data/user";

beforeEach(async () => {
  await resetDb();
});

describe("Auth validation test", () => {
  it("should validate user", async () => {
    const user = await registerUser(registerUser1);
    const result = await validateUser(user.data.token);

    expect(result.success).toBeTruthy();
    expect(result.data.user).toBeDefined();
  });

  it("should invalidate not logged in users", async () => {
    const fakeToken = "thisisafaketoken";
    await expect(validateUser(fakeToken)).rejects.toThrow();
  });
});
