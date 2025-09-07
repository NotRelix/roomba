import { SelectMessage, SelectUser } from "@repo/shared/types";
import z from "zod";

export type getMessagesEnv = {
  Variables: {
    roomId: number;
  };
};

export type createMessageEnv = {
  Variables: {
    validatedData: createMessageType;
    author: SelectUser;
    roomId: number;
  };
};

export type createMessageType = z.infer<typeof createMessageValidator>;

export type MessageWithAuthor = {
  message: SelectMessage;
  author: SelectUser;
};

export const createMessageValidator = z.object({
  message: z
    .string("Invalid message")
    .trim()
    .min(1, "Message must not be empty"),
});
