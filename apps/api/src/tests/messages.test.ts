import { Hono } from "hono";
import auth from "#routes/auth";
import messages from "#routes/messages";
import { beforeEach, describe, expect, it } from "vitest";
import type { createMessageType } from "@repo/types/message";
import { resetDb } from "@repo/helpers/db";
import type { registerType } from "@repo/types/user";

const messageRoute = new Hono();
messageRoute.route("/messages", messages);

const authRoute = new Hono();
authRoute.route("/auth", auth);

const data: registerType = {
  firstName: "dummy1",
  lastName: "dummy1",
  username: "dummy1",
  email: "dummy1@gmail.com",
  password: "dummypassword",
  confirmPassword: "dummypassword",
};

beforeEach(async () => {
  await resetDb();
});

describe("Create message test", () => {
  it("should create a message", async () => {
    const registerResponse = await authRoute.request("/auth/register", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const registerResult = await registerResponse.json();
    const token = registerResult.token;

    const message: createMessageType = {
      message: "this is why we clash",
    };
    const response = await messageRoute.request("/messages", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(message),
    });

    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.messages[0]).toBe("Successfully created a message");
  });

  it("should create multiple messages", async () => {
    const registerResponse = await authRoute.request("/auth/register", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const registerResult = await registerResponse.json();
    const token = registerResult.token;

    const message1: createMessageType = {
      message: "this is why we clash",
    };
    const message2: createMessageType = {
      message: "for games like that",
    };
    const response1 = await messageRoute.request("/messages", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(message1),
    });
    const response2 = await messageRoute.request("/messages", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(message2),
    });

    const result1 = await response1.json();
    const result2 = await response2.json();

    expect(response1.status).toBe(201);
    expect(response2.status).toBe(201);
    expect(result1.message.message).toBe("this is why we clash");
    expect(result2.message.message).toBe("for games like that");
  });
});
