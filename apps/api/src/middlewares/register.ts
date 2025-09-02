import { getEmailDb, getUsernameDb } from "#db/query";
import { registerValidator } from "@repo/types/user";
import type { Context, Next } from "hono";

export const validateRegister = async (c: Context, next: Next) => {
  const body = await c.req.json();
  const result = registerValidator.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        success: false,
        messages: result.error!.issues.map((message) => message.message),
      },
      400
    );
  }

  const usernameExists = await getUsernameDb(body.username);
  if (usernameExists) {
    return c.json(
      {
        success: false,
        messages: ["Username already exists"],
      },
      400
    );
  }

  const emailExists = await getEmailDb(body.email);
  if (emailExists) {
    return c.json(
      {
        success: false,
        messages: ["Email already exists"],
      },
      400
    );
  }

  if (body.password !== body.confirmPassword) {
    return c.json(
      {
        success: false,
        messages: ["Passwords do not match"],
      },
      400
    );
  }

  await next();
};
