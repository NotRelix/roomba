import {
  createMessageHandler,
  deleteMessageHandler,
  editMessageHandler,
  getMessagesHandler,
} from "#controllers/messages";
import { Hono } from "hono";

const app = new Hono();

app.get("/", ...getMessagesHandler);
app.post("/", ...createMessageHandler);
app.patch("/:messageId", ...editMessageHandler);
app.delete("/:messageId", ...deleteMessageHandler);

export default app;
