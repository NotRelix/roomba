import { beforeEach, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";
import { registerUser } from "#tests/helpers/auth";
import { registerUser1, registerUser2 } from "#tests/data/user";
import { createRoom, joinRoom } from "#tests/helpers/rooms";
import { privateRoom1, room1, room2 } from "#tests/data/rooms";

beforeEach(async () => {
  await resetDb();
});

describe("Create rooms test", () => {
  it("should create a room", async () => {
    const { token } = await registerUser(registerUser1);
    const result = await createRoom(room1, token);

    expect(result.success).toBe(true);
    expect(result.room.name).toBe("the best group chat");
    expect(result.isAdmin).toBeTruthy();
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

    expect(result.notifs[0]).toBe("Unauthorized access");
  });

  it("should prevent fake tokens", async () => {
    const token = "thisisafaketoken";
    const roomResult = await createRoom(room1, token);

    expect(roomResult.notifs[0]).toBe("Invalid token");
  });
});

describe("Join rooms test", () => {
  it("should join the room", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    const roomResult = await createRoom(room1, user1.token);

    const joinRoomResult = await joinRoom(roomResult.room.id, user2.token);

    expect(joinRoomResult.success).toBeTruthy();
    expect(joinRoomResult.room.name).toBe(room1.name);
    expect(joinRoomResult.isAdmin).toBe(false);
  });

  it("should not join an invalid room (string)", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    await createRoom(room1, user1.token);

    const invalidRoomId = "ABC";
    const joinRoomResult = await joinRoom(invalidRoomId, user2.token);

    expect(joinRoomResult.success).toBe(false);
    expect(joinRoomResult.notifs[0]).toBe("Invalid room ID");
  });

  it("should not join an invalid room (very big number)", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    await createRoom(room1, user1.token);

    const invalidRoomId = 100232123123123;
    const joinRoomResult = await joinRoom(invalidRoomId, user2.token);

    expect(joinRoomResult.success).toBe(false);
    expect(joinRoomResult.notifs[0]).toBe("Invalid room ID");
  });

  it("should not join an invalid room (number)", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    await createRoom(room1, user1.token);

    const invalidRoomId = 102093;
    const joinRoomResult = await joinRoom(invalidRoomId, user2.token);

    expect(joinRoomResult.success).toBe(false);
    expect(joinRoomResult.notifs[0]).toBe("Room doesn't exist");
  });

  it("should not join the same room", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    const roomResult = await createRoom(room1, user1.token);

    const joinRoomResult1 = await joinRoom(roomResult.room.id, user2.token);
    const joinRoomResult2 = await joinRoom(roomResult.room.id, user2.token);

    expect(joinRoomResult1.success).toBeTruthy();
    expect(joinRoomResult1.room.name).toBe(room1.name);
    expect(joinRoomResult2.success).toBe(false);
    expect(joinRoomResult2.notifs[0]).toBe("User is already in the room");
  });

  it("should prevent users from joining a private room", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    const roomResult = await createRoom(privateRoom1, user1.token);

    const joinRoomResult = await joinRoom(roomResult.room.id, user2.token);

    expect(joinRoomResult.success).toBe(false);
    expect(joinRoomResult.notifs[0]).toBe("Can't join a private room");
  });
});
