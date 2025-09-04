import { getAuthorDb, getUserInRoomDb } from "#db/query";
import {
  createMessageValidator,
  type createMessageEnv,
} from "@repo/types/message";
import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";

const INT_MAX = 2 ** 31 - 1;

export const useValidateCreateMessage =
  (): MiddlewareHandler<createMessageEnv> => {
    return createMiddleware<createMessageEnv>(
      async (c: Context, next: Next) => {
        const body = await c.req.json();
        const roomId = Number(c.req.param("roomId"));
        const result = createMessageValidator.safeParse(body);

        if (roomId >= INT_MAX || isNaN(roomId)) {
          return c.json(
            {
              success: false,
              messages: ["Invalid room ID"],
            },
            400
          );
        }

        if (!result.success) {
          return c.json(
            {
              success: false,
              messages: result.error!.issues.map((message) => message.message),
            },
            400
          );
        }

        const user = c.get("user");
        const author = await getAuthorDb(user.id);
        if (!author) {
          return c.json(
            {
              success: false,
              messages: ["Invalid user"],
            },
            400
          );
        }

        const isUserJoined = await getUserInRoomDb(user.id, roomId);
        if (!isUserJoined) {
          return c.json(
            {
              success: false,
              messages: ["Forbidden access"],
            },
            403
          );
        }

        c.set("validatedData", result.data);
        c.set("author", author);
        await next();
      }
    );
  };
