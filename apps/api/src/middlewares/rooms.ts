import { getRoomDb, getUserInRoomDb } from "#db/query";
import { createRoomValidator, type createRoomEnv } from "@repo/types/rooms";
import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";

const INT_MAX = 2 ** 31 - 1;

export const useValidJoinRoom = (): MiddlewareHandler => {
  return createMiddleware(async (c: Context, next: Next) => {
    const user = c.get("user");
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

    const doesRoomExist = await getRoomDb(roomId);
    if (!doesRoomExist) {
      return c.json(
        {
          success: false,
          notifs: ["Room doesn't exist"],
        },
        404
      );
    }

    const isRoomPrivate = doesRoomExist.isPrivate;
    if (isRoomPrivate) {
      return c.json(
        {
          success: false,
          notifs: ["Can't join a private room"],
        },
        400
      );
    }

    const isUserJoined = await getUserInRoomDb(user.id, roomId);
    if (isUserJoined) {
      return c.json(
        {
          success: false,
          notifs: ["User is already in the room"],
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
          notifs: result.error!.issues.map((message) => message.message),
        },
        400
      );
    }

    c.set("validatedData", result.data);
    await next();
  });
};
