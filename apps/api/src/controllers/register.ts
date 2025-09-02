import { createFactory } from "hono/factory";
import { registerDb } from "#db/query";
import type { InsertUser } from "@repo/shared/types";
import { genSalt, hash } from "bcrypt-ts";
import { signToken } from "@repo/helpers/token";

const factory = createFactory();

export const registerHandler = factory.createHandlers(async (c) => {
  try {
    const body = await c.req.json();
    const salt = await genSalt(10);

    let hashedPassword = await hash(body.password, salt);
    const newUser: InsertUser = {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      password: hashedPassword,
    };

    const insertUserResult = await registerDb(newUser);
    if (!insertUserResult) {
      return c.json(
        {
          success: false,
          messages: ["Failed to register user"],
        },
        500
      );
    }

    const token = await signToken(insertUserResult);
    const { password, ...safeUser } = insertUserResult;
    return c.json(
      {
        success: true,
        messages: ["Successfully registered user"],
        user: safeUser,
        token: token,
      },
      201
    );
  } catch (err) {
    return c.json(
      {
        success: false,
        messages: ["Failed to register user"],
      },
      500
    );
  }
});
