import {
  messagesTable,
  roomsTable,
  usersTable,
  usersToRooms,
} from "./schema.js";

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type SelectRoom = typeof roomsTable.$inferSelect;
export type InsertRoom = typeof roomsTable.$inferInsert;

export type SelectUsersToRooms = typeof usersToRooms.$inferSelect;
export type InsertUsersToRooms = typeof usersToRooms.$inferInsert;

export type SelectMessage = typeof messagesTable.$inferSelect;
export type InsertMessage = typeof messagesTable.$inferInsert;
