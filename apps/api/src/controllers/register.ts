import { createFactory } from "hono/factory";
import { UserValidator } from "@repo/types/user";

const factory = createFactory();

export const registerHandler = factory.createHandlers(async (c) => {
  const body = await c.req.json();
  const result = UserValidator.safeParse(body);
  if (!result.success) {
    return c.json(
      {
        success: false,
        messages: result.error!.issues.map((message) => message.message),
      },
      400
    );
  }
  return c.json(
    {
      success: true,
      messages: ["Successfully registered user"],
    },
    201
  );
});
