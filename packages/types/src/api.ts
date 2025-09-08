import { SelectMessage, SelectRoom, SelectUser } from "@repo/shared/types";
import { SafeUser } from "@repo/types/user";
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
  user: SafeUser;
  token: string;
};

export type CreateRoomData = {
  user: SafeUser;
  room: SelectRoom;
  isAdmin: boolean;
};

export type EditRoomData = {
  room: SelectRoom;
};

export type JoinRoomData = CreateRoomData;

export type GetMessagesData = {
  messages: MessageWithAuthor[];
};

export type CreateMessageData = {
  author: SafeUser;
  message: SelectMessage | null;
};
