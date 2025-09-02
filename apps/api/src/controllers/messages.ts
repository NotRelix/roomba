import { createMessageValidator } from "@repo/types/message";
import { createFactory } from "hono/factory";

const factory = createFactory();

export const getMessagesHandler = factory.createHandlers(async (c) => {
  return c.json("getting messages");
});

export const createMessageHandler = factory.createHandlers(async (c) => {
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

    return c.json(
      {
        success: true,
        messages: ["Successfully created a message"],
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
});

export const editMessageHandler = factory.createHandlers(async (c) => {
  return c.json("edit message");
});

export const deleteMessageHandler = factory.createHandlers(async (c) => {
  return c.json("deleting message");
});
