import type { userPayloadEnv, userPayloadType } from "@repo/types/user";
import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export const useAuth = (): MiddlewareHandler<userPayloadEnv> => {
  return createMiddleware<userPayloadEnv>(async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return c.json({ success: false, notifs: ["Unauthorized access"] }, 401);
    }

    try {
      const token = authHeader.split(" ")[1];
      const payload = (await verify(
        token,
        process.env.JWT_SECRET!
      )) as userPayloadType;

      c.set("user", payload);
      await next();
    } catch (err) {
      return c.json({ success: false, notifs: ["Invalid token"] }, 401);
    }
  });
};
