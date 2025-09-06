import { createMessageDb, getMessagesDb } from "#db/query";
import { useAuth } from "#middlewares/auth";
import {
  useValidateCreateMessage,
  useValidateGetMessages,
} from "#middlewares/messages";
import type { InsertMessage } from "@repo/shared/types";
import { createFactory } from "hono/factory";

const factory = createFactory();

export const getMessagesHandler = factory.createHandlers(
  useAuth(),
  useValidateGetMessages(),
  async (c) => {
    try {
      const roomId = Number(c.req.param("roomId"));
      const getMessagesResult = await getMessagesDb(roomId);
    } catch (err) {
      return c.json({
        success: false,
        notifs: ["Failed to get messages"],
      });
    }
  }
);

export const createMessageHandler = factory.createHandlers(
  useAuth(),
  useValidateCreateMessage(),
  async (c) => {
    try {
      const user = c.get("user");
      const body = c.get("validatedData");
      const author = c.get("author");
      const roomId = Number(c.req.param("roomId"));

      const newMessage: InsertMessage = {
        message: body.message,
        authorId: user.id,
        roomId: roomId,
      };
      const createMessageResult = await createMessageDb(newMessage);
      const { password, ...cleanAuthor } = author;

      return c.json(
        {
          success: true,
          author: cleanAuthor,
          message: createMessageResult,
          notifs: ["Successfully created a message"],
        },
        201
      );
    } catch (err) {
      return c.json(
        {
          success: false,
          notifs: ["Failed to create message"],
        },
        500
      );
    }
  }
);

export const editMessageHandler = factory.createHandlers(async (c) => {
  return c.json("edit message");
});

export const deleteMessageHandler = factory.createHandlers(async (c) => {
  return c.json("deleting message");
});
