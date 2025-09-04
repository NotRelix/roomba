import { createRoomDb, joinRoomDb } from "#db/query";
import { useAuth } from "#middlewares/auth";
import { useValidateCreateRoom, useValidJoinRoom } from "#middlewares/rooms";
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
        return c.json(
          { success: false, messages: ["Failed to create a room"] },
          500
        );
      }
      const { password, ...safeUser } = createRoomResult.user;
      const room = createRoomResult.room;

      return c.json(
        {
          success: true,
          messages: ["Successfully created a room"],
          user: safeUser,
          room: room,
        },
        201
      );
    } catch (err) {
      return c.json(
        { success: false, messages: ["Failed to create a room"] },
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
        return c.json(
          {
            success: false,
            messages: ["Failed to join room"],
          },
          400
        );
      }

      const { password, ...safeUser } = joinRoomResult.user;
      const room = joinRoomResult.room;
      return c.json(
        {
          success: true,
          messages: ["Successfully joined a room"],
          user: safeUser,
          room: room,
        },
        200
      );
    } catch (err) {
      return c.json(
        { success: false, messasges: ["Failed to join a room"] },
        500
      );
    }
  }
);
