import type { loginType, registerType } from "@repo/types/user";
import { beforeAll, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";
import { loginUser, registerUser } from "#tests/helpers/auth";

const dummyData: registerType = {
  firstName: "dummy",
  lastName: "dummy",
  username: "dummy",
  email: "dummy@gmail.com",
  password: "dummypassword",
  confirmPassword: "dummypassword",
};

beforeAll(async () => {
  await resetDb();
  await registerUser(dummyData);
});

describe("Login test", () => {
  it("should login user", async () => {
    const data: loginType = {
      username: "dummy",
      password: "dummypassword",
    };

    const result = await loginUser(data);
    expect(result.success).toBeTruthy();
    expect(result.token).toBeDefined();
  });

  it("should prevent wrong username", async () => {
    const data: loginType = {
      username: "dummy1",
      password: "dummypassword",
    };

    const result = await loginUser(data);
    expect(result.messages[0]).toBe("Invalid username or password");
  });

  it("should prevent wrong password", async () => {
    const data: loginType = {
      username: "dummy",
      password: "dummypassword1",
    };

    const result = await loginUser(data);
    expect(result.messages[0]).toBe("Invalid username or password");
  });
});
