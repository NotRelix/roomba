import { createFactory } from "hono/factory";
import { signToken } from "@repo/helpers/token";
import { useValidateLogin } from "#middlewares/login";
import type { ApiResponse, LoginData } from "@repo/types/api";

const factory = createFactory();

export const loginHandler = factory.createHandlers(
  useValidateLogin(),
  async (c) => {
    try {
      const user = c.get("user");
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
  }
);
