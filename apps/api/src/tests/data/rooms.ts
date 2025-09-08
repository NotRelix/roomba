import type { CreateRoomType } from "@repo/types/rooms";

export const room1: CreateRoomType = {
  name: "the best group chat",
};
export const room2: CreateRoomType = {
  name: "the second best group chat",
};
export const privateRoom1: CreateRoomType = {
  name: "secret room",
  isPrivate: true,
};
