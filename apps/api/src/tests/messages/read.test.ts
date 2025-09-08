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
    const user = await registerUser(registerUser1);

    const roomResult = await createRoom(room1, user.data.token);
    await createMessage(message1, roomResult.data.room.id, user.data.token);
    const result = await getMessages(roomResult.data.room.id, fakeToken);
    expect(result.success).toBeFalsy();
  });

  it("should prevent unauthenticated users", async () => {
    const user = await registerUser(registerUser1);

    const roomResult = await createRoom(room1, user.data.token);
    await createMessage(message1, roomResult.data.room.id, user.data.token);
    const result = await getMessages(roomResult.data.room.id);

    expect(result.success).toBeFalsy();
  });

  it("should get message", async () => {
    const user = await registerUser(registerUser1);

    const roomResult = await createRoom(room1, user.data.token);
    await createMessage(message1, roomResult.data.room.id, user.data.token);
    const result = await getMessages(roomResult.data.room.id, user.data.token);

    expect(result.success).toBeTruthy();
    expect(result.data.messages.length).toBe(1);
  });

  it("should get multiple messages", async () => {
    const user = await registerUser(registerUser1);

    const roomResult = await createRoom(room1, user.data.token);
    await createMessage(message1, roomResult.data.room.id, user.data.token);
    await createMessage(message2, roomResult.data.room.id, user.data.token);
    await createMessage(message1, roomResult.data.room.id, user.data.token);
    const result = await getMessages(roomResult.data.room.id, user.data.token);

    expect(result.success).toBeTruthy();
    expect(result.data.messages.length).toBe(3);
    expect(result.data.messages[0].message.message).toBe(message1.message);
    expect(result.data.messages[1].message.message).toBe(message2.message);
    expect(result.data.messages[2].message.message).toBe(message1.message);
  });
});
