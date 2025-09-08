import type { createMessageType } from "@repo/types/message";
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
  message: createMessageType,
  roomId: number | string,
  token?: string
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await app.request(`/rooms/${roomId}/messages`, {
    method: "POST",
    headers: new Headers(headers),
    body: JSON.stringify(message),
  });

  const result = await response.json();
  return result;
};
