import { beforeEach, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";
import { registerUser } from "#tests/helpers/auth";
import { registerUser1 } from "#tests/data/user";
import { createRoom } from "#tests/helpers/rooms";
import { room1, room2 } from "#tests/data/rooms";

beforeEach(async () => {
  await resetDb();
});

describe("Create rooms test", () => {
  it("should create a room", async () => {
    const { token } = await registerUser(registerUser1);
    const result = await createRoom(room1, token);

    expect(result.success).toBe(true);
    expect(result.room.name).toBe("the best group chat");
  });

  it("should create multiple rooms", async () => {
    const { token } = await registerUser(registerUser1);
    const result1 = await createRoom(room1, token);
    const result2 = await createRoom(room2, token);

    expect(result1.room.name).toBe(room1.name);
    expect(result2.room.name).toBe(room2.name);
  });

  it("should prevent unauthenticated users", async () => {
    const result = await createRoom(room1);

    expect(result.messages[0]).toBe("Unauthorized access");
  });

  it("should prevent fake tokens", async () => {
    const token = "thisisafaketoken";
    const roomResult = await createRoom(room1, token);

    expect(roomResult.messages[0]).toBe("Invalid token");
  });
});
