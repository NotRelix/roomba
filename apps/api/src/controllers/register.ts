import { createFactory } from "hono/factory";

const factory = createFactory();

export const registerHandler = factory.createHandlers(async (c) => {
  return c.json({
    success: true,
    message: "you've passed by the register handler",
  });
});
