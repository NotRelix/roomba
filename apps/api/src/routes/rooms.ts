import { createRoomHandler, joinRoomHandler } from "#controllers/rooms";
import { Hono } from "hono";
import messages from "#routes/messages";

const app = new Hono()
  .post("/", ...createRoomHandler)
  .post("/:roomId/join", ...joinRoomHandler)
  .route("/:roomId/messages", messages);

export default app;
