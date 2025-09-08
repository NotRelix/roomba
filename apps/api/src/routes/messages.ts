import { createMessageDb, getMessagesDb } from "#db/query";
import { authMiddleware } from "#middlewares/auth";
import {
  validateCreateMessage,
  validateGetMessages,
} from "#middlewares/messages";
import type { InsertMessage } from "@repo/shared/types";
import type {
  ApiResponse,
  CreateMessageData,
  GetMessagesData,
} from "@repo/types/api";
import { Hono } from "hono";

const app = new Hono()
  .get("/", authMiddleware, validateGetMessages, async (c) => {
    try {
      const roomId = c.var.roomId;
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
  })
  .post("/", authMiddleware, validateCreateMessage, async (c) => {
    try {
      const user = c.var.user;
      const body = c.var.validatedData;
      const author = c.var.author;
      const roomId = c.var.roomId;

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
  })
  .patch("/:messageId", authMiddleware, async (c) => {
    return c.json({
      success: true,
      notifs: ["Successfully edited message"],
    });
  })
  .delete("/:messageId", authMiddleware, async (c) => {
    return c.json({
      success: true,
      notifs: ["Successfully deleted message"],
    });
  });

export default app;
