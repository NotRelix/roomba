import { createRoomHandler, joinRoomHandler } from "#controllers/rooms";
import { Hono } from "hono";
import messages from "#routes/messages";

const app = new Hono();

app.post("/", ...createRoomHandler);
app.post("/:roomId/join", ...joinRoomHandler);

app.route("/:roomId/messages", messages);

export default app;
