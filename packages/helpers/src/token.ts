import "dotenv/config";
import { sign } from "hono/jwt";
import type { SelectUser } from "@repo/shared/types";
import type { UserPayloadType } from "@repo/types/user";

export const signToken = async (user: SelectUser) => {
  const payload: UserPayloadType = {
    userId: String(user.id),
    sub: user.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 60 sec x 60 min x 24 hours * 7 days = 7 days
  };
  const secret = process.env.SESSION_SECRET!;
  const token = await sign(payload, secret);
  return token;
};
