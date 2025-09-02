import z from "zod";

export type createMessageType = {
  message: string;
  authorId: number;
};

export const createMessageValidator = z.object({
  message: z
    .string("Invalid message")
    .trim()
    .min(1, "Message must not be empty"),
});
