import type { loginType, registerType } from "@repo/types/user";

// Register User
export const registerUser1: registerType = {
  firstName: "dummy1",
  lastName: "dummy1",
  username: "dummy1",
  email: "dummy1@gmail.com",
  password: "dummypassword",
  confirmPassword: "dummypassword",
};
export const registerUser2: registerType = {
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

// Login User
export const loginUser1: loginType = {
  username: "dummy1",
  password: "dummypassword",
};
export const loginUser2: loginType = {
  username: "dummy2",
  password: "dummypassword",
};
export const loginWrongUsername: loginType = {
  username: "wrongusername",
  password: "dummypassword",
};
export const loginWrongPassword: loginType = {
  username: "dummy1",
  password: "wrongpassword",
};
