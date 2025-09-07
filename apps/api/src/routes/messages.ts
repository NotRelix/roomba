import {
  createMessageHandler,
  deleteMessageHandler,
  editMessageHandler,
  getMessagesHandler,
} from "#controllers/messages";
import { Hono } from "hono";

const app = new Hono()
  .get("/", ...getMessagesHandler)
  .post("/", ...createMessageHandler)
  .patch("/:messageId", ...editMessageHandler)
  .delete("/:messageId", ...deleteMessageHandler);

export default app;
