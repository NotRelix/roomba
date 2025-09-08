import type { CreateMessageType } from "@repo/types/message";
import app, { type AppType } from "#index";
import { testClient } from "hono/testing";

const client = testClient<AppType>(app);

export const getMessages = async (roomId: number | string, token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await client.rooms[":roomId"].messages.$get(
    { param: { roomId: String(roomId) } },
    { headers }
  );

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.notifs[0]);
  }
  return result;
};

export const createMessage = async (
  message: CreateMessageType,
  roomId: number | string,
  token?: string
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await client.rooms[":roomId"].messages.$post(
    {
      param: { roomId: String(roomId) },
      // @ts-expect-error
      json: message,
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
