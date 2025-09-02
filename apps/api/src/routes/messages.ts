import {
  createMessageHandler,
  deleteMessageHandler,
  editMessageHandler,
  getMessagesHandler,
} from "#controllers/messages";
import { authMiddleware } from "#middlewares/auth";
import { Hono } from "hono";

const app = new Hono();

app.get("/", ...getMessagesHandler);
app.post("/", authMiddleware, ...createMessageHandler);
app.patch("/:messageId", ...editMessageHandler);
app.delete("/:messageId", ...deleteMessageHandler);

export default app;
