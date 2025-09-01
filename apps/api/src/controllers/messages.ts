import { createFactory } from "hono/factory";

const factory = createFactory();

export const getMessagesHandler = factory.createHandlers(async (c) => {
  return c.json("getting messages");
});

export const createMessageHandler = factory.createHandlers(async (c) => {
  return c.json("creating message");
});

export const editMessageHandler = factory.createHandlers(async (c) => {
  return c.json("edit message");
});

export const deleteMessageHandler = factory.createHandlers(async (c) => {
  return c.json("deleting message");
});
