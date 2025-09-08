import z from "zod";
import { UserPayloadType } from "./user.js";

export type CreateRoomEnv = {
  Variables: {
    validatedData: CreateRoomType;
  };
};

export type JoinRoomEnv = {
  Variables: {
    user: UserPayloadType;
    roomId: number;
  };
};

export type CreateRoomType = z.infer<typeof createRoomValidator>;

export const createRoomValidator = z.object({
  name: z.string("Invalid room").trim().min(1, "Room name must not be empty"),
  isPrivate: z.boolean("Invalid room type").default(false).optional(),
});
