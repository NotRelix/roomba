import { message1, message2 } from "#tests/data/messages";
import { room1 } from "#tests/data/rooms";
import { registerUser1 } from "#tests/data/user";
import { registerUser } from "#tests/helpers/auth";
import { createMessage, getMessages } from "#tests/helpers/messages";
import { createRoom } from "#tests/helpers/rooms";
import { resetDb } from "@repo/helpers/db";
import { beforeEach, describe, expect, it } from "vitest";

beforeEach(async () => {
  await resetDb();
});

describe("Get messages test", () => {
  it("should prevent fake tokens", async () => {
    const fakeToken = "thisisafaketoken";
    const { token } = await registerUser(registerUser1);
    const roomResult = await createRoom(room1, token);
    await createMessage(message1, roomResult.room.id, token);
    const result = await getMessages(roomResult.room.id, fakeToken);

    expect(result.success).toBe(false);
  });

  it("should prevent unauthenticated users", async () => {
    const { token } = await registerUser(registerUser1);
    const roomResult = await createRoom(room1, token);
    await createMessage(message1, roomResult.room.id, token);
    const result = await getMessages(roomResult.room.id);

    expect(result.success).toBe(false);
  });

  it("should get message", async () => {
    const { token } = await registerUser(registerUser1);
    const roomResult = await createRoom(room1, token);
    await createMessage(message1, roomResult.room.id, token);
    const result = await getMessages(roomResult.room.id, token);

    expect(result.success).toBeTruthy();
    expect(result.messages.length).toBe(1);
  });

  it("should get multiple messages", async () => {
    const { token } = await registerUser(registerUser1);
    const roomResult = await createRoom(room1, token);
    await createMessage(message1, roomResult.room.id, token);
    await createMessage(message2, roomResult.room.id, token);
    await createMessage(message1, roomResult.room.id, token);
    const result = await getMessages(roomResult.room.id, token);

    expect(result.success).toBeTruthy();
    expect(result.messages.length).toBe(3);
    expect(result.messages[0].message.message).toBe(message1.message);
    expect(result.messages[1].message.message).toBe(message2.message);
    expect(result.messages[2].message.message).toBe(message1.message);
  });
});
