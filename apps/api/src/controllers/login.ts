import { createFactory } from "hono/factory";

const factory = createFactory();

export const loginHandler = factory.createHandlers(async (c) => {
  try {
    return c.json(
      {
        success: true,
        messages: ["Successfully logged in"],
      },
      200
    );
  } catch (err) {
    return c.json(
      {
        success: false,
        messages: ["Failed to login user"],
      },
      500
    );
  }
});
