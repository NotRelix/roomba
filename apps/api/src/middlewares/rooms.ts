import { getRoomDb, getUserInRoomDb } from "#db/query";
import {
  createRoomValidator,
  editRoomValidator,
  type JoinRoomEnv,
  type CreateRoomEnv,
  type EditRoomEnv,
} from "@repo/types/rooms";
import { createMiddleware } from "hono/factory";

const INT_MAX = 2 ** 31 - 1;

export const validateJoinRoom = createMiddleware<JoinRoomEnv>(
  async (c, next) => {
    const user = c.var.user;
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

    c.set("roomId", roomId);
    await next();
  }
);

export const validateCreateRoom = createMiddleware<CreateRoomEnv>(
  async (c, next) => {
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
  }
);

export const validateEditRoom = createMiddleware<EditRoomEnv>(
  async (c, next) => {
    const body = await c.req.json();
    const roomId = Number(c.req.param("roomId"));
    const result = editRoomValidator.safeParse(body);

    if (roomId >= INT_MAX || isNaN(roomId)) {
      return c.json(
        {
          success: false,
          notifs: ["Invalid room ID"],
        },
        400
      );
    }

    if (!result.success) {
      return c.json(
        {
          success: false,
          notifs: result.error!.issues.map((message) => message.message),
        },
        400
      );
    }

    const room = await getRoomDb(roomId);
    if (!room) {
      return c.json(
        {
          success: false,
          notifs: ["Room not found"],
        },
        404
      );
    }

    c.set("validatedData", result.data);
    c.set("roomId", roomId);
    await next();
  }
);
