import { createMessageDb, getAuthorDb } from "#db/query";
import { useAuth } from "#middlewares/auth";
import type { InsertMessage } from "@repo/shared/types";
import { createMessageValidator } from "@repo/types/message";
import { createFactory } from "hono/factory";

const factory = createFactory();

export const getMessagesHandler = factory.createHandlers(async (c) => {
  return c.json("getting messages");
});

export const createMessageHandler = factory.createHandlers(
  useAuth(),
  async (c) => {
    try {
      const body = await c.req.json();
      const result = createMessageValidator.safeParse(body);

      if (!result.success) {
        return c.json(
          {
            success: false,
            messages: result.error!.issues.map((message) => message.message),
          },
          400
        );
      }

      const user = c.get("user");
      console.log({user});
      const author = await getAuthorDb(user.id);
      if (!author) {
        return c.json(
          {
            success: false,
            messages: ["Invalid user"],
          },
          400
        );
      }

      const newMessage: InsertMessage = {
        message: body.message,
        authorId: user.id,
      };
      const createMessageResult = await createMessageDb(newMessage);
      const { password, ...cleanAuthor } = author;

      return c.json(
        {
          success: true,
          messages: ["Successfully created a message"],
          author: cleanAuthor,
          message: createMessageResult,
        },
        201
      );
    } catch (err) {
      return c.json(
        {
          success: false,
          messages: ["Failed to create message"],
        },
        500
      );
    }
  }
);

export const editMessageHandler = factory.createHandlers(async (c) => {
  return c.json("edit message");
});

export const deleteMessageHandler = factory.createHandlers(async (c) => {
  return c.json("deleting message");
});
