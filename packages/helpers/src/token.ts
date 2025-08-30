import "dotenv/config"
import { sign } from "hono/jwt";
import type { SelectUser } from "@repo/shared/types"

export const signToken = async (user: SelectUser) => {
  const payload = {
    id: user.id,
    sub: user.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // 60 sec x 5 min = 5 minutes
  };
  const secret = process.env.JWT_SECRET!;
  const token = await sign(payload, secret);
  return token;
};
