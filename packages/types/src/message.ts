import { SelectMessage, SelectUser } from "@repo/shared/types";
import z from "zod";
import { UserPayloadType } from "./user.js";

export type GetMessagesEnv = {
  Variables: {
    user: UserPayloadType;
    roomId: number;
  };
};

export type CreateMessageEnv = {
  Variables: {
    user: UserPayloadType;
    validatedData: CreateMessageType;
    author: SelectUser;
    roomId: number;
  };
};

export type CreateMessageType = z.infer<typeof createMessageValidator>;

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
