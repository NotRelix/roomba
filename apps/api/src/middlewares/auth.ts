import type { userPayloadType } from "@repo/types/user";
import type { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return c.json({ success: false, messages: ["Unauthorized access"] }, 401);
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
    return c.json({ success: false, messages: ["Invalid token"] }, 401);
  }
};
