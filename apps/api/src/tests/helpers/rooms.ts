import type { CreateRoomType } from "@repo/types/rooms";
import app, { type AppType } from "#index";
import { testClient } from "hono/testing";
import type { InsertRoom } from "@repo/shared/types";

const client = testClient<AppType>(app);

export const createRoom = async (room: CreateRoomType, token?: string) => {
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

  const response = await client.rooms[":roomId"].join.$post(
    { param: { roomId: String(roomId) } },
    {
      headers: headers,
    }
  );

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.notifs[0]);
  }
  return result;
};

export const editRoom = async (
  roomId: number | string,
  newRoom: InsertRoom,
  token?: string
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await client.rooms[":roomId"].$patch(
    {
      param: { roomId: String(roomId) },
      // @ts-expect-error
      json: newRoom,
    },
    {
      headers,
    }
  );

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.notifs[0]);
  }

  return result;
};
