import { createMessageDb, getMessagesDb } from "#db/query";
import { useAuth } from "#middlewares/auth";
import {
  useValidateCreateMessage,
  useValidateGetMessages,
} from "#middlewares/messages";
import type { InsertMessage } from "@repo/shared/types";
import type {
  ApiResponse,
  CreateMessageData,
  GetMessagesData,
} from "@repo/types/api";
import { createFactory } from "hono/factory";

const factory = createFactory();

export const getMessagesHandler = factory.createHandlers(
  useAuth(),
  useValidateGetMessages(),
  async (c) => {
    try {
      const roomId = c.get("roomId");
      const getMessagesResult = await getMessagesDb(roomId);

      return c.json<ApiResponse<GetMessagesData>>({
        success: true,
        notifs: ["Successfully fetched messages"],
        data: {
          messages: getMessagesResult ?? [],
        },
      });
    } catch (err) {
      return c.json<ApiResponse>({
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
      const roomId = c.get("roomId");

      const newMessage: InsertMessage = {
        message: body.message,
        authorId: user.id,
        roomId: roomId,
      };
      const createMessageResult = await createMessageDb(newMessage);
      const { password, ...cleanAuthor } = author;

      return c.json<ApiResponse<CreateMessageData>>(
        {
          success: true,
          notifs: ["Successfully created a message"],
          data: {
            author: cleanAuthor,
            message: createMessageResult,
          },
        },
        201
      );
    } catch (err) {
      return c.json<ApiResponse>(
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
