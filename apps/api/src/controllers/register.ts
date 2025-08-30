import { createFactory } from "hono/factory";
import { UserValidator } from "@repo/types/user";
import { registerDb } from "../db/query.js";
import type { InsertUser } from "@repo/shared/types";

const factory = createFactory();

export const registerHandler = factory.createHandlers(async (c) => {
  try {
    const body = await c.req.json();
    const result = UserValidator.safeParse(body);
    if (!result.success) {
      return c.json(
        {
          success: false,
          messages: result.error!.issues.map((message) => message.message),
        },
        400
      );
    }
    const newUser: InsertUser = {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      password: body.password,
    };
    const insertUserResult = await registerDb(newUser);
    return c.json(
      {
        success: true,
        messages: ["Successfully registered user"],
        user: insertUserResult,
      },
      201
    );
  } catch (err) {
    return c.json({
      success: false,
      messages: ["Failed to register user"],
    });
  }
});
