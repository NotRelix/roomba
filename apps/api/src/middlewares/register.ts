import { getEmailDb, getUsernameDb } from "#db/query";
import { registerValidator, type RegisterEnv } from "@repo/types/user";
import { createMiddleware } from "hono/factory";

export const validateRegisterMiddleware = createMiddleware<RegisterEnv>(
  async (c, next) => {
    const body = await c.req.json();
    const result = registerValidator.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          notifs: result.error!.issues.map((message) => message.message),
        },
        400
      );
    }

    const usernameExists = await getUsernameDb(body.username);
    if (usernameExists) {
      return c.json(
        {
          success: false,
          notifs: ["Username already exists"],
        },
        400
      );
    }

    const emailExists = await getEmailDb(body.email);
    if (emailExists) {
      return c.json(
        {
          success: false,
          notifs: ["Email already exists"],
        },
        400
      );
    }

    if (body.password !== body.confirmPassword) {
      return c.json(
        {
          success: false,
          notifs: ["Passwords do not match"],
        },
        400
      );
    }

    c.set("validatedData", result.data);
    await next();
  }
);
