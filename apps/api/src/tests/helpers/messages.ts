import type { createMessageType } from "@repo/types/message";
import { app } from "#index";

export const createMessage = async (
  message: createMessageType,
  roomId: number,
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
