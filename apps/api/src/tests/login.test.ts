import { Hono } from "hono";
import auth from "#routes/auth";
import type { loginType, registerType } from "@repo/types/user";
import { beforeAll, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";

const app = new Hono();
app.route("/auth", auth);

const url = "http://localhost:3000/auth";
const dummyData: registerType = {
  firstName: "dummy",
  lastName: "dummy",
  username: "dummy",
  email: "dummy@gmail.com",
  password: "dummypassword",
  confirmPassword: "dummypassword",
};
const data: loginType = {
  username: "dummy",
  password: "dummypassword",
};

beforeAll(async () => {
  await resetDb();
  const response = await app.request(`${url}/register`, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(dummyData),
  });
  const result = await response.json();
  console.log(result);
});

describe("Login test", () => {
  it("should login user", async () => {
    const response = await app.request(`${url}/login`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.success).toBeTruthy();
    expect(result.token).toBeDefined();
  });
});
