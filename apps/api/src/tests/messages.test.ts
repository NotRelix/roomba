import { beforeEach, describe, expect, it } from "vitest";
import { resetDb } from "@repo/helpers/db";
import { createMessage } from "#tests/helpers/messages";
import { createRoom } from "#tests/helpers/rooms";
import { registerUser } from "#tests/helpers/auth";
import { registerUser1 } from "#tests/data/user";
import { room1 } from "#tests/data/rooms";
import { message1, message2 } from "#tests/data/messages";

beforeEach(async () => {
  await resetDb();
});

describe("Create message test", () => {
  it("should create a message", async () => {
    const { token } = await registerUser(registerUser1);
    const roomResult = await createRoom(room1, token);
    const result = await createMessage(message1, roomResult.id, token);

    expect(result.messages[0]).toBe("Successfully created a message");
  });

  it("should create multiple messages", async () => {
    const { token } = await registerUser(registerUser1);
    const roomResult = await createRoom(room1, token);
    const result1 = await createMessage(message1, roomResult.id, token);
    const result2 = await createMessage(message2, roomResult.id, token);

    expect(result1.message.message).toBe(message1.message);
    expect(result2.message.message).toBe(message2.message);
  });

  it("should prevent unauthenticated users", async () => {
    const roomResult = await createRoom(room1);
    const result = await createMessage(message1, roomResult.id);

    expect(result.success).toBe(false);
    expect(result.messages[0]).toBe("Unauthorized access");
  });

  it("should prevent fake tokens", async () => {
    const fakeToken = "thisisafaketoken";
    const roomResult = await createRoom(room1, fakeToken);
    const result = await createMessage(message1, roomResult.id, fakeToken);

    expect(result.success).toBe(false);
    expect(result.messages[0]).toBe("Invalid token");
  });
});
