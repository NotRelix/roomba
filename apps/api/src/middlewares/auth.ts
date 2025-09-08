import type { UserPayloadEnv, UserPayloadType } from "@repo/types/user";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export const authMiddleware = createMiddleware<UserPayloadEnv>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return c.json({ success: false, notifs: ["Unauthorized access"] }, 401);
    }

    try {
      const token = authHeader.split(" ")[1];
      const payload = (await verify(
        token,
        process.env.JWT_SECRET!
      )) as UserPayloadType;

      c.set("user", payload);
      await next();
    } catch (err) {
      return c.json({ success: false, notifs: ["Invalid token"] }, 401);
    }
  }
);
