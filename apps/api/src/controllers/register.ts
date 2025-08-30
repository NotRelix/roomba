import { createFactory } from "hono/factory";
import { registerValidator } from "@repo/types/user";
import { getEmailDb, getUsernameDb, registerDb } from "../db/query.js";
import type { InsertUser } from "@repo/shared/types";
import { genSalt, hash } from "bcrypt-ts";
import { signToken } from "@repo/helpers/token";

const factory = createFactory();

export const registerHandler = factory.createHandlers(async (c) => {
  try {
    const body = await c.req.json();
    const result = registerValidator.safeParse(body);
    const salt = await genSalt(10);

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
          messages: ["Password do not match"],
        },
        400
      );
    }

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
