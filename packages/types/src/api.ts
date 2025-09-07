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
