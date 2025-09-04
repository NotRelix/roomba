import { beforeEach, describe, expect, it } from "vitest";
import type { createMessageType } from "@repo/types/message";
import { resetDb } from "@repo/helpers/db";
import type { createRoomType } from "@repo/types/rooms";
import { createMessage } from "#tests/helpers/messages";
import { createRoom } from "#tests/helpers/rooms";
import { registerUser } from "#tests/helpers/auth";
import { user1 } from "#tests/data/user";

beforeEach(async () => {
  await resetDb();
});

describe("Create message test", () => {
  it("should create a message", async () => {
    const { token } = await registerUser(user1);
    const room: createRoomType = {
      name: "the best group chat",
    };
    const roomResult = await createRoom(room, token);

    const message: createMessageType = {
      message: "this is why we clash",
    };

    const result = await createMessage(message, roomResult.id, token);

    expect(result.messages[0]).toBe("Successfully created a message");
  });

  it("should create multiple messages", async () => {
    const { token } = await registerUser(user1);
    const room: createRoomType = {
      name: "the best group chat",
    };
    const roomResult = await createRoom(room, token);

    const message1: createMessageType = {
      message: "this is why we clash",
    };
    const message2: createMessageType = {
      message: "for games like that",
    };

    const result1 = await createMessage(message1, roomResult.id, token);
    const result2 = await createMessage(message2, roomResult.id, token);

    expect(result1.message.message).toBe("this is why we clash");
    expect(result2.message.message).toBe("for games like that");
  });

  it("should prevent unauthenticated users", async () => {
    const room: createRoomType = {
      name: "the best group chat",
    };
    const roomResult = await createRoom(room);

    const message: createMessageType = {
      message: "shouldn't be able to send",
    };
    const result = await createMessage(message, roomResult.id);

    expect(result.success).toBe(false);
    expect(result.messages[0]).toBe("Unauthorized access");
  });

  it("should prevent fake tokens", async () => {
    const fakeToken = "thisisafaketoken";
    const room: createRoomType = {
      name: "the best group chat",
    };
    const roomResult = await createRoom(room, fakeToken);

    const message: createMessageType = {
      message: "shouldn't be able to send",
    };
    const result = await createMessage(message, roomResult.id, fakeToken);

    expect(result.success).toBe(false);
    expect(result.messages[0]).toBe("Invalid token");
  });
});
