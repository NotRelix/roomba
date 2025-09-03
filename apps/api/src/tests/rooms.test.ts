import room from "#routes/rooms";
import { beforeEach, describe, expect, it } from "vitest";
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

describe("Create rooms test", () => {
  it("should create a room", async () => {
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
    const response = await app.request("/rooms", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(room),
    });
    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.success).toBe(true);
    expect(result.room.name).toBe("the best group chat");
  });

  it("should create multiple rooms", async () => {
    const registerResponse = await app.request("/auth/register", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const registerResult = await registerResponse.json();
    const token = registerResult.token;

    const room1: createRoomType = {
      name: "the best group chat",
    };
    const room2: createRoomType = {
      name: "the 2nd best room",
    };
    const response1 = await app.request("/rooms", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(room1),
    });
    const response2 = await app.request("/rooms", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(room2),
    });
    const result1 = await response1.json();
    const result2 = await response2.json();

    expect(response1.status).toBe(201);
    expect(response2.status).toBe(201);
    expect(result1.room.name).toBe("the best group chat");
    expect(result2.room.name).toBe("the 2nd best room");
  });

  it("should prevent unauthenticated users", async () => {
    const room: createRoomType = {
      name: "the best group chat",
    };
    const response = await app.request("/rooms", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(room),
    });
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.messages[0]).toBe("Unauthorized access");
  });

  it("should prevent fake tokens", async () => {
    const token = "thisisafaketoken";
    const response = await app.request("/rooms", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(room),
    });
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.messages[0]).toBe("Invalid token");
  });
});
