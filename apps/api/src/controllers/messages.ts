import { createMessageDb } from "#db/query";
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
    return c.json("getting messages");
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

      const newMessage: InsertMessage = {
        message: body.message,
        authorId: user.id,
      };
      const createMessageResult = await createMessageDb(newMessage);
      const { password, ...cleanAuthor } = author;

      return c.json(
        {
          success: true,
          messages: ["Successfully created a message"],
          author: cleanAuthor,
          message: createMessageResult,
        },
        201
      );
    } catch (err) {
      return c.json(
        {
          success: false,
          messages: ["Failed to create message"],
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
