import z from "zod";

export type createRoomType = z.infer<typeof createRoomValidator>;

export const createRoomValidator = z.object({
  name: z.string("Invalid room").trim().min(1, "Room name must not be empty"),
});
