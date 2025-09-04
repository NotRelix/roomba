import type { createRoomType } from "@repo/types/rooms";
import { app } from "#index";

export const createRoom = async (room: createRoomType, token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await app.request("/rooms", {
    method: "POST",
    headers: new Headers(headers),
    body: JSON.stringify(room),
  });
  const result = await response.json();
  return result;
};
