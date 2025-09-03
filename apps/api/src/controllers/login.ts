import { createFactory } from "hono/factory";
import { signToken } from "@repo/helpers/token";
import { useValidateLogin } from "#middlewares/login";

const factory = createFactory();

export const loginHandler = factory.createHandlers(
  useValidateLogin(),
  async (c) => {
    try {
      const user = c.get("user");
      const token = await signToken(user);
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
  }
);
