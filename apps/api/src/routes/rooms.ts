import { createRoomHandler } from "#controllers/rooms";
import { Hono } from "hono";
import messages from "#routes/messages";

const app = new Hono();

app.post("/", ...createRoomHandler);

app.route("/:roomId/messages", messages);

export default app;
