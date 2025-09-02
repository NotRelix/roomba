import "dotenv/config";
import { sign } from "hono/jwt";
import type { SelectUser } from "@repo/shared/types";
import type { userPayloadType } from "@repo/types/user";

export const signToken = async (user: SelectUser) => {
  const payload: userPayloadType = {
    id: user.id,
    sub: user.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 60 sec x 60 min = 1 hour
  };
  const secret = process.env.JWT_SECRET!;
  const token = await sign(payload, secret);
  return token;
};
