import type { createRoomType } from "@repo/types/rooms";

export const room1: createRoomType = {
  name: "the best group chat",
};
export const room2: createRoomType = {
  name: "the second best group chat",
};
export const privateRoom1: createRoomType = {
  name: "secret room",
  isPrivate: true,
};
