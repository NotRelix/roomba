import z from "zod";

export type createRoomEnv = {
  Variables: {
    validatedData: createRoomType;
  };
};

export type createRoomType = z.infer<typeof createRoomValidator>;

export const createRoomValidator = z.object({
  name: z.string("Invalid room").trim().min(1, "Room name must not be empty"),
  isPrivate: z.boolean("Invalid room type").default(false).optional(),
});
