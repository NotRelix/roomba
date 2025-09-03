import { beforeEach, describe, expect, it } from "vitest";
import type { createMessageType } from "@repo/types/message";
import { resetDb } from "@repo/helpers/db";
import type { registerType } from "@repo/types/user";
import type { createRoomType } from "@repo/types/rooms";
import { app } from "#index";

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
    const registerResponse = await app.request("/auth/register", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const registerResult = await registerResponse.json();
    const token = registerResult.token;

    const room: createRoomType = {
      name: "the best group chat",
    };
    const roomResponse = await app.request("/rooms", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(room),
    });
    const roomResult = await roomResponse.json();

    const message: createMessageType = {
      message: "this is why we clash",
    };
    const response = await app.request(`/rooms/${roomResult.id}/messages`, {
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
    const registerResponse = await app.request("/auth/register", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const registerResult = await registerResponse.json();
    const token = registerResult.token;

    const room: createRoomType = {
      name: "the best group chat",
    };
    const roomResponse = await app.request("/rooms", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(room),
    });
    const roomResult = await roomResponse.json();

    const message1: createMessageType = {
      message: "this is why we clash",
    };
    const message2: createMessageType = {
      message: "for games like that",
    };
    const response1 = await app.request(`/rooms/${roomResult.id}/messages`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(message1),
    });
    const response2 = await app.request(`/rooms/${roomResult.id}/messages`, {
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

  it("should prevent unauthenticated users", async () => {
    const room: createRoomType = {
      name: "the best group chat",
    };
    const roomResponse = await app.request("/rooms", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(room),
    });
    const roomResult = await roomResponse.json();

    const message: createMessageType = {
      message: "shouldn't be able to send",
    };
    const response = await app.request(`/rooms/${roomResult.id}/messages`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(message),
    });
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.success).toBe(false);
    expect(result.messages[0]).toBe("Unauthorized access");
  });

  it("should prevent fake tokens", async () => {
    const fakeToken = "thisisafaketoken";
    const room: createRoomType = {
      name: "the best group chat",
    };
    const roomResponse = await app.request("/rooms", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${fakeToken}`,
      }),
      body: JSON.stringify(room),
    });
    const roomResult = await roomResponse.json();
    const message: createMessageType = {
      message: "shouldn't be able to send",
    };
    const response = await app.request(`/rooms/${roomResult.id}/messages`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${fakeToken}`,
      }),
      body: JSON.stringify(message),
    });
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.success).toBe(false);
    expect(result.messages[0]).toBe("Invalid token");
  });
});
