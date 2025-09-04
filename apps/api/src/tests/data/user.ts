import type { registerType } from "@repo/types/user";

export const user1: registerType = {
  firstName: "dummy1",
  lastName: "dummy1",
  username: "dummy1",
  email: "dummy1@gmail.com",
  password: "dummypassword",
  confirmPassword: "dummypassword",
};
export const user2: registerType = {
  firstName: "dummy2",
  lastName: "dummy2",
  username: "dummy2",
  email: "dummy2@gmail.com",
  password: "dummypassword",
  confirmPassword: "dummypassword",
};
export const duplicateUsername: registerType = {
  firstName: "dummy3",
  lastName: "dummy3",
  username: "dummy1",
  email: "dummy3@gmail.com",
  password: "dummypassword",
  confirmPassword: "dummypassword",
};
export const duplicateEmail: registerType = {
  firstName: "dummy4",
  lastName: "dummy4",
  username: "dummy4",
  email: "dummy1@gmail.com",
  password: "dummypassword",
  confirmPassword: "dummypassword",
};
export const wrongPassword: registerType = {
  firstName: "dummy5",
  lastName: "dummy5",
  username: "dummy5",
  email: "dummy5@gmail.com",
  password: "dummypassword",
  confirmPassword: "wrongpassword",
};