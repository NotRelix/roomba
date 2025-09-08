import { createRoomDb, joinRoomDb } from "#db/query";
import { useAuth } from "#middlewares/auth";
import { useValidateCreateRoom, useValidJoinRoom } from "#middlewares/rooms";
import type {
  ApiResponse,
  CreateRoomData,
  JoinRoomData,
} from "@repo/types/api";
import { createFactory } from "hono/factory";

const factory = createFactory();

export const createRoomHandler = factory.createHandlers(
  useAuth(),
  useValidateCreateRoom(),
  async (c) => {
    try {
      const user = c.get("user");
      const body = c.get("validatedData");

      const createRoomResult = await createRoomDb(user.id, body);
      if (!createRoomResult) {
        return c.json<ApiResponse>(
          { success: false, notifs: ["Failed to create a room"] },
          500
        );
      }

      const { password, ...safeUser } = createRoomResult.user;
      return c.json<ApiResponse<CreateRoomData>>(
        {
          success: true,
          notifs: ["Successfully created a room"],
          data: {
            user: safeUser,
            room: createRoomResult.room,
            isAdmin: createRoomResult.isAdmin,
          },
        },
        201
      );
    } catch (err) {
      return c.json<ApiResponse>(
        { success: false, notifs: ["Failed to create a room"] },
        500
      );
    }
  }
);

export const joinRoomHandler = factory.createHandlers(
  useAuth(),
  useValidJoinRoom(),
  async (c) => {
    try {
      const user = c.get("user");
      const roomId = Number(c.req.param("roomId"));

      const joinRoomResult = await joinRoomDb(user.id, roomId);
      if (!joinRoomResult) {
        return c.json<ApiResponse>(
          {
            success: false,
            notifs: ["Failed to join room"],
          },
          400
        );
      }

      const { password, ...safeUser } = joinRoomResult.user;
      return c.json<ApiResponse<JoinRoomData>>(
        {
          success: true,
          notifs: ["Successfully joined a room"],
          data: {
            user: safeUser,
            room: joinRoomResult.room,
            isAdmin: joinRoomResult.isAdmin,
          },
        },
        200
      );
    } catch (err) {
      return c.json<ApiResponse>(
        { success: false, notifs: ["Failed to join a room"] },
        500
      );
    }
  }
);
