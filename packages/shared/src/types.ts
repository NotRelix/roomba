import { messagesTable, usersTable } from "./schema.js";

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type SelectMessage = typeof messagesTable.$inferSelect;
export type InsertMessage = typeof messagesTable.$inferInsert;
