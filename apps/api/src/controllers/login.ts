import { loginValidator } from "@repo/types/user";
import { createFactory } from "hono/factory";
import { getUsernameDb } from "../db/query.js";
import { compare } from "bcrypt-ts";
import { sign } from "hono/jwt";
import "dotenv/config"

const factory = createFactory();

export const loginHandler = factory.createHandlers(async (c) => {
  try {
    const body = await c.req.json();
    const result = loginValidator.safeParse(body);
    const errorMessage = {
      success: false,
      messages: ["Invalid username or password"],
    };

    if (!result.success) {
      return c.json(
        {
          success: false,
          messages: result.error!.issues.map((message) => message.message),
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

    const payload = {
      id: user.id,
      sub: user.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // 60 sec x 5 min = 5 minutes
    };
    const secret = process.env.JWT_SECRET!;
    const token = await sign(payload, secret);

    return c.json(
      {
        success: true,
        messages: ["Successfully logged in"],
        token: token,
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
