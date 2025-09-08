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
    const user = await registerUser(registerUser1);

    const result = await createRoom(room1, user.data.token);

    expect(result.success).toBeTruthy();
    expect(result.data.room.name).toBe("the best group chat");
    expect(result.data.isAdmin).toBeTruthy();
  });

  it("should create multiple rooms", async () => {
    const user = await registerUser(registerUser1);

    const result1 = await createRoom(room1, user.data.token);
    const result2 = await createRoom(room2, user.data.token);

    expect(result1.data.room.name).toBe(room1.name);
    expect(result2.data.room.name).toBe(room2.name);
  });

  it("should prevent unauthenticated users", async () => {
    await expect(createRoom(room1)).rejects.toThrow("Unauthorized access");
  });

  it("should prevent fake tokens", async () => {
    const fakeToken = "thisisafaketoken";
    await expect(createRoom(room1, fakeToken)).rejects.toThrow("Invalid token");
  });
});

describe("Join rooms test", () => {
  it("should join the room", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    const roomResult = await createRoom(room1, user1.data.token);

    const joinRoomResult = await joinRoom(
      roomResult.data.room.id,
      user2.data.token
    );

    expect(joinRoomResult.success).toBeTruthy();
    expect(joinRoomResult.data.room.name).toBe(room1.name);
    expect(joinRoomResult.data.isAdmin).toBeFalsy();
    expect(joinRoomResult.data.room.id).toBe(roomResult.data.room.id);
  });

  it("should not join an invalid room (string)", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    await createRoom(room1, user1.data.token);

    const invalidRoomId = "ABC";
    await expect(joinRoom(invalidRoomId, user2.data.token)).rejects.toThrow(
      "Invalid room ID"
    );
  });

  it("should not join an invalid room (very big number)", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    await createRoom(room1, user1.data.token);

    const invalidRoomId = 100232123123123;
    await expect(joinRoom(invalidRoomId, user2.data.token)).rejects.toThrow(
      "Invalid room ID"
    );
  });

  it("should not join an invalid room (number)", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    await createRoom(room1, user1.data.token);

    const invalidRoomId = 102093;
    await expect(joinRoom(invalidRoomId, user2.data.token)).rejects.toThrow(
      "Room doesn't exist"
    );
  });

  it("should not join the same room", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    const roomResult = await createRoom(room1, user1.data.token);

    const joinRoomResult1 = await joinRoom(
      roomResult.data.room.id,
      user2.data.token
    );

    expect(joinRoomResult1.success).toBeTruthy();
    expect(joinRoomResult1.data.room.name).toBe(room1.name);
    await expect(
      joinRoom(roomResult.data.room.id, user2.data.token)
    ).rejects.toThrow("User is already in the room");
  });

  it("should prevent users from joining a private room", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    const roomResult = await createRoom(privateRoom1, user1.data.token);

    await expect(
      joinRoom(roomResult.data.room.id, user2.data.token)
    ).rejects.toThrow("Can't join a private room");
  });
});
