import { beforeEach, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";
import { createMessage } from "#tests/helpers/messages";
import { createRoom } from "#tests/helpers/rooms";
import { registerUser } from "#tests/helpers/auth";
import { registerUser1, registerUser2 } from "#tests/data/user";
import { room1 } from "#tests/data/rooms";
import { message1, message2 } from "#tests/data/messages";

beforeEach(async () => {
  await resetDb();
});

describe("Create message test", () => {
  it("should create a message", async () => {
    const { token } = await registerUser(registerUser1);
    const roomResult = await createRoom(room1, token);
    const result = await createMessage(message1, roomResult.room.id, token);

    expect(result.messages[0]).toBe("Successfully created a message");
  });

  it("should create multiple messages", async () => {
    const { token } = await registerUser(registerUser1);
    const roomResult = await createRoom(room1, token);
    const result1 = await createMessage(message1, roomResult.room.id, token);
    const result2 = await createMessage(message2, roomResult.room.id, token);

    expect(result1.message.message).toBe(message1.message);
    expect(result2.message.message).toBe(message2.message);
  });

  it("should prevent unauthenticated users", async () => {
    const { token } = await registerUser(registerUser1);
    const roomResult = await createRoom(room1, token);
    const result = await createMessage(message1, roomResult.room.id);

    expect(result.success).toBe(false);
    expect(result.messages[0]).toBe("Unauthorized access");
  });

  it("should prevent fake tokens", async () => {
    const { token } = await registerUser(registerUser1);
    const fakeToken = "thisisafaketoken";
    const roomResult = await createRoom(room1, token);
    const result = await createMessage(message1, roomResult.room.id, fakeToken);

    expect(result.success).toBe(false);
    expect(result.messages[0]).toBe("Invalid token");
  });

  it("should prevent sending messages when not in the room", async () => {
    const user1 = await registerUser(registerUser1);
    const user2 = await registerUser(registerUser2);

    const roomResult = await createRoom(room1, user1.token);
    const messageResult1 = await createMessage(
      message1,
      roomResult.room.id,
      user1.token
    );
    const messageResult2 = await createMessage(
      message2,
      roomResult.room.id,
      user2.token
    );

    expect(messageResult1.success).toBeTruthy();
    expect(messageResult1.message.message).toBe(message1.message);
    expect(messageResult2.success).toBe(false);
    expect(messageResult2.messages[0]).toBe("Forbidden access");
  });
});
