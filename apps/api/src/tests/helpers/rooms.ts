import type { createRoomType } from "@repo/types/rooms";
import app, { type AppType } from "#index";
import { testClient } from "hono/testing";

const client = testClient<AppType>(app);

export const createRoom = async (room: createRoomType, token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await client.rooms.$post({ json: room }, { headers });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.notifs[0]);
  }
  return result;
};

export const joinRoom = async (roomId: number | string, token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await app.request(`/rooms/${roomId}/join`, {
    method: "POST",
    headers: new Headers(headers),
  });

  const result = await response.json();
  return result;
};
