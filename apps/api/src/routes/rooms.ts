import { Hono } from "hono";
import messages from "#routes/messages";
import { createRoomDb, editRoomDb, joinRoomDb } from "#db/query";
import type {
  ApiResponse,
  CreateRoomData,
  EditRoomData,
  JoinRoomData,
} from "@repo/types/api";
import { authMiddleware } from "#middlewares/auth";
import {
  validateCreateRoom,
  validateEditRoom,
  validateJoinRoom,
} from "#middlewares/rooms";

const app = new Hono()
  .use(authMiddleware)
  .post("/", validateCreateRoom, async (c) => {
    try {
      const user = c.var.user;
      const body = c.var.validatedData;

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
  })
  .patch("/:roomId", validateEditRoom, async (c) => {
    try {
      const body = c.var.validatedData;
      const roomId = c.var.roomId;

      const editRoomResult = await editRoomDb(roomId, body);
      if (!editRoomResult) {
        return c.json(
          {
            success: false,
            notifs: ["Room not found"],
          },
          404
        );
      }

      return c.json<ApiResponse<EditRoomData>>(
        {
          success: true,
          notifs: ["Successfully edited room"],
          data: {
            room: editRoomResult,
          },
        },
        200
      );
    } catch (err) {
      return c.json<ApiResponse>(
        {
          success: false,
          notifs: ["Failed to edit room"],
        },
        500
      );
    }
  })
  .post("/:roomId/join", validateJoinRoom, async (c) => {
    try {
      const user = c.var.user;
      const roomId = c.var.roomId;

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
  })
  .route("/:roomId/messages", messages);

export default app;
