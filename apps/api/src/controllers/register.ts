import { createFactory } from "hono/factory";
import { registerDb } from "#db/query";
import type { InsertUser } from "@repo/shared/types";
import { genSalt, hash } from "bcrypt-ts";
import { signToken } from "@repo/helpers/token";
import { useValidateRegister } from "#middlewares/register";
import type { ApiResponse, RegisterData } from "@repo/types/api";

const factory = createFactory();

export const registerHandler = factory.createHandlers(
  useValidateRegister(),
  async (c) => {
    try {
      const body = c.get("validatedData");
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
        return c.json<ApiResponse>(
          {
            success: false,
            notifs: ["Failed to register user"],
          },
          500
        );
      }

      const token = await signToken(insertUserResult);
      const { password, ...safeUser } = insertUserResult;
      return c.json<ApiResponse<RegisterData>>(
        {
          success: true,
          notifs: ["Successfully registered user"],
          data: {
            user: safeUser,
            token: token,
          },
        },
        201
      );
    } catch (err) {
      return c.json<ApiResponse>(
        {
          success: false,
          notifs: ["Failed to register user"],
        },
        500
      );
    }
  }
);
