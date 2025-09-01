import { beforeEach, describe, expect, it } from "vitest";
import type { registerType } from "@repo/types/user";
import { Hono } from "hono";
import auth from "#routes/auth";
import { resetDb } from "@repo/helpers/db";

const app = new Hono();
app.route("/auth", auth);

const url = "http://localhost:3000/auth/register";
const data: registerType[] = [
  {
    firstName: "dummy1",
    lastName: "dummy1",
    username: "dummy1",
    email: "dummy1@gmail.com",
    password: "dummypassword",
    confirmPassword: "dummypassword",
  },
  {
    firstName: "dummy2",
    lastName: "dummy2",
    username: "dummy2",
    email: "dummy2@gmail.com",
    password: "dummypassword",
    confirmPassword: "dummypassword",
  },
];

beforeEach(async () => {
  await resetDb();
});

describe("Register handler test", () => {
  it("should add user to database", async () => {
    const response = await app.request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data[0]),
    });

    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.success).toBeTruthy();
    expect(result.user.username).toBe("dummy1");
    expect(result.token).toBeDefined();
  });

  it("should add multiple users", async () => {
    const response1 = await app.request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data[0]),
    });
    const response2 = await app.request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data[1]),
    });

    const result1 = await response1.json();
    const result2 = await response2.json();

    expect(response1.status).toBe(201);
    expect(result1.user.username).toBe("dummy1");

    expect(response2.status).toBe(201);
    expect(result2.user.username).toBe("dummy2");
  });

  it("should prevent duplicate usernames", async () => {
    const duplicatedUsernames = data.map((obj) => ({
      ...obj,
      username: "dummy",
    }));
    const response1 = await app.request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(duplicatedUsernames[0]),
    });
    const response2 = await app.request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(duplicatedUsernames[1]),
    });

    const result1 = await response1.json();
    const result2 = await response2.json();

    expect(response1.status).toBe(201);
    expect(result1.user.username).toBe("dummy");

    expect(response2.status).toBe(400);
    expect(result2.messages[0]).toBe("Username already exists");
  });

  it("should prevent duplicate emails", async () => {
    const duplicatedEmails = data.map((obj) => ({
      ...obj,
      email: "dummy@gmail.com",
    }));
    const response1 = await app.request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(duplicatedEmails[0]),
    });
    const response2 = await app.request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(duplicatedEmails[1]),
    });

    const result1 = await response1.json();
    const result2 = await response2.json();

    expect(response1.status).toBe(201);
    expect(result1.user.username).toBe("dummy1");

    expect(response2.status).toBe(400);
    expect(result2.messages[0]).toBe("Email already exists");
  });

  it("should prevent wrong passwords", async () => {
    const newUser = { ...data[0], confirmPassword: "wrongpassword" };
    const response = await app.request(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(newUser),
    });

    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.messages[0]).toBe("Passwords do not match");
  });
});
