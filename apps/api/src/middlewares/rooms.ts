import { createRoomValidator } from "@repo/types/rooms";
import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";

export const useValidateCreateRoom = (): MiddlewareHandler => {
  return createMiddleware(async (c: Context, next: Next) => {
    const body = await c.req.json();
    const result = createRoomValidator.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          messages: result.error!.issues.map((message) => message.message),
        },
        400
      );
    }

    await next();
  });
};
