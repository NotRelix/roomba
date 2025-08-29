import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { UserValidator } from "@repo/types/user"

const factory = createFactory();

export const registerHandler = factory.createHandlers(
  zValidator("json", UserValidator),
  async (c) => {
    const body = await c.req.valid("json");
    return c.json({
      success: true,
      body: body,
      message: "you've passed by the register handler",
    });
  }
);
