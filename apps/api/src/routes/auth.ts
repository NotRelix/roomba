import { Hono } from "hono";
import { genSalt, hash } from "bcrypt-ts";
import type { InsertUser } from "@repo/shared/types";
import { registerDb } from "#db/query";
import type {
  ApiResponse,
  LoginData,
  RegisterData,
  ValidatedData,
} from "@repo/types/api";
import { signToken } from "@repo/helpers/token";
import { validateRegisterMiddleware } from "#middlewares/register";
import { validateLoginMiddleware } from "#middlewares/login";
import { authMiddleware } from "#middlewares/auth";

const app = new Hono()
  .post("/register", validateRegisterMiddleware, async (c) => {
    try {
      const body = c.var.validatedData;
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
  })
  .post("/login", validateLoginMiddleware, async (c) => {
    try {
      const user = c.var.user;
      const token = await signToken(user);
      return c.json<ApiResponse<LoginData>>(
        {
          success: true,
          notifs: ["Successfully logged in"],
          data: { token },
        },
        200
      );
    } catch (err) {
      return c.json<ApiResponse>(
        {
          success: false,
          notifs: ["Failed to login user"],
        },
        500
      );
    }
  })
  .get("/validate", authMiddleware, async (c) => {
    try {
      const user = c.var.user;
      return c.json<ApiResponse<ValidatedData>>(
        {
          success: true,
          notifs: ["Successfully validated user"],
          data: {
            user,
          },
        },
        200
      );
    } catch (err) {
      return c.json<ApiResponse>(
        {
          success: false,
          notifs: ["Failed to validate user"],
        },
        500
      );
    }
  });

export default app;
