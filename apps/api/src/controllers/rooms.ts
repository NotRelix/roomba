import { useAuth } from "#middlewares/auth";
import { useValidateCreateRoom } from "#middlewares/rooms";
import { createFactory } from "hono/factory";

const factory = createFactory();

export const createRoomHandler = factory.createHandlers(
  useAuth(),
  useValidateCreateRoom(),
  async (c) => {
    try {
      return c.json(
        { success: true, messages: ["Successfully created a room"] },
        201
      );
    } catch (err) {
      return c.json(
        { success: true, messages: ["Failed to create a room"] },
        500
      );
    }
  }
);
