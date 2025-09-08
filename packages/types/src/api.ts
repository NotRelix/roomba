import { SelectMessage, SelectRoom, SelectUser } from "@repo/shared/types";
import { safeUser } from "@repo/types/user";
import { MessageWithAuthor } from "./message.js";

export type ApiSuccess<T = void> = {
  success: true;
  notifs: string[];
  data: T;
};

export type ApiError = {
  success: false;
  notifs: string[];
};

export type ApiResponse<T = void> = ApiSuccess<T> | ApiError;

export type LoginData = {
  token: string;
};

export type RegisterData = {
  user: safeUser;
  token: string;
};

export type CreateRoomData = {
  user: safeUser;
  room: SelectRoom;
  isAdmin: boolean;
};

export type JoinRoomData = CreateRoomData;

export type GetMessagesData = {
  messages: MessageWithAuthor[];
};

export type CreateMessageData = {
  author: safeUser;
  message: SelectMessage | null;
};
