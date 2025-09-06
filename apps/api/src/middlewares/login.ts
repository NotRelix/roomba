import { getUsernameDb } from "#db/query";
import { loginValidator, type loginEnv } from "@repo/types/user";
import { compare } from "bcrypt-ts";
import type { MiddlewareHandler, Context, Next } from "hono";
import { createMiddleware } from "hono/factory";

export const useValidateLogin = (): MiddlewareHandler<loginEnv> => {
  return createMiddleware<loginEnv>(async (c: Context, next: Next) => {
    const body = await c.req.json();
    const result = loginValidator.safeParse(body);
    const errorMessage = {
      success: false,
      notifs: ["Invalid username or password"],
    };

    if (!result.success) {
      return c.json(
        {
          success: false,
          notifs: result.error!.issues.map((message) => message.message),
        },
        400
      );
    }

    const user = await getUsernameDb(body.username);
    if (!user) {
      return c.json(errorMessage, 401);
    }

    const isPasswordMatch = await compare(body.password, user.password);
    if (!isPasswordMatch) {
      return c.json(errorMessage, 401);
    }

    c.set("user", user);
    await next();
  });
};
