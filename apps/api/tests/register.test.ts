import { describe, expect, it } from "vitest";
import type { registerType } from "@repo/types/user";
import { Hono } from "hono";
import auth from "#routes/auth";

const app = new Hono();
app.route("/auth", auth);

describe("Register Handler test", () => {
  it("should add user to database", async () => {
    const url = "http://localhost:3000/auth/register";
    const data: registerType = {
      firstName: "dummy",
      lastName: "dummy",
      username: "dummy",
      email: "dummy@gmail.com",
      password: "dummypassword",
      confirmPassword: "dummypassword",
    };
    const res = await app.request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    console.log(res);
    expect(res.status).toBe(201);
  });
});
