import { createRoomHandler } from "#controllers/rooms";
import { Hono } from "hono";

const app = new Hono();

app.post("/", ...createRoomHandler);

export default app;
