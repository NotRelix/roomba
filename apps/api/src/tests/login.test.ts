import { Hono } from "hono";
import auth from "#routes/auth";
import type { loginType, registerType } from "@repo/types/user";
import { beforeAll, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";

const app = new Hono();
app.route("/auth", auth);

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
  await app.request("/auth/register", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(dummyData),
  });
});

describe("Login test", () => {
  it("should login user", async () => {
    const data: loginType = {
      username: "dummy",
      password: "dummypassword",
    };
    const response = await app.request("/auth/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.token).toBeDefined();
  });

  it("should prevent wrong username", async () => {
    const data: loginType = {
      username: "dummy1",
      password: "dummypassword",
    };
    const response = await app.request("/auth/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    expect(response.status).toBe(401);
    expect(result.messages[0]).toBe("Invalid username or password");
  });

  it("should prevent wrong password", async () => {
    const data: loginType = {
      username: "dummy",
      password: "dummypassword1",
    };
    const response = await app.request("/auth/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    expect(response.status).toBe(401);
    expect(result.messages[0]).toBe("Invalid username or password");
  });
});
