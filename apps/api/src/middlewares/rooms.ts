import { getRoomDb, getUserInRoomDb } from "#db/query";
import { createRoomValidator, type createRoomEnv } from "@repo/types/rooms";
import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";

export const useValidJoinRoom = (): MiddlewareHandler => {
  return createMiddleware(async (c: Context, next: Next) => {
    const user = c.get("user");
    const roomId = Number(c.req.param("roomId"));

    const doesRoomExist = await getRoomDb(roomId);
    if (!doesRoomExist) {
      return c.json(
        {
          success: false,
          messages: ["Room doesn't exist"],
        },
        404
      );
    }

    const isUserJoined = await getUserInRoomDb(user.id, roomId);
    if (isUserJoined) {
      return c.json(
        {
          success: false,
          messages: ["User is already in the room"],
        },
        400
      );
    }

    await next();
  });
};

export const useValidateCreateRoom = (): MiddlewareHandler<createRoomEnv> => {
  return createMiddleware<createRoomEnv>(async (c: Context, next: Next) => {
    const body = await c.req.json();
    const result = createRoomValidator.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          messages: result.error!.issues.map((message) => message.message),
        },
        400
      );
    }

    c.set("validatedData", result.data);
    await next();
  });
};
