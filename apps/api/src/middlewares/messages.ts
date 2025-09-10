import { getAuthorDb, getUserInRoomDb } from "#db/query";
import type { ApiResponse } from "@repo/types/api";
import {
  createMessageValidator,
  type CreateMessageEnv,
  type GetMessagesEnv,
} from "@repo/types/message";
import { createMiddleware } from "hono/factory";

const INT_MAX = 2 ** 31 - 1;

export const validateGetMessages = createMiddleware<GetMessagesEnv>(
  async (c, next) => {
    const roomId = Number(c.req.param("roomId"));

    if (roomId >= INT_MAX || isNaN(roomId)) {
      return c.json(
        {
          success: false,
          notifs: ["Invalid room ID"],
        },
        400
      );
    }

    const user = c.var.user;
    const userId = Number(user.userId);
    const isUserJoined = await getUserInRoomDb(userId, roomId);
    if (!isUserJoined) {
      return c.json(
        {
          success: false,
          notifs: ["Forbidden access"],
        },
        403
      );
    }

    c.set("roomId", roomId);
    await next();
  }
);

export const validateCreateMessage = createMiddleware<CreateMessageEnv>(
  async (c, next) => {
    const body = await c.req.json();
    const roomId = Number(c.req.param("roomId"));
    const result = createMessageValidator.safeParse(body);

    if (roomId >= INT_MAX || isNaN(roomId)) {
      return c.json<ApiResponse>(
        {
          success: false,
          notifs: ["Invalid room ID"],
        },
        400
      );
    }

    if (!result.success) {
      return c.json<ApiResponse>(
        {
          success: false,
          notifs: result.error!.issues.map((message) => message.message),
        },
        400
      );
    }

    const user = c.var.user;
    const userId = Number(user.userId);
    const author = await getAuthorDb(userId);
    if (!author) {
      return c.json<ApiResponse>(
        {
          success: false,
          notifs: ["Invalid user"],
        },
        400
      );
    }

    const isUserJoined = await getUserInRoomDb(userId, roomId);
    if (!isUserJoined) {
      return c.json<ApiResponse>(
        {
          success: false,
          notifs: ["Forbidden access"],
        },
        403
      );
    }

    c.set("validatedData", result.data);
    c.set("author", author);
    c.set("roomId", roomId);
    await next();
  }
);
