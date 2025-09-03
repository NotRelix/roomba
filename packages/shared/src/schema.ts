import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  messages: many(messagesTable),
  usersToRooms: many(usersToRooms),
}));

export const roomsTable = pgTable("rooms", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const roomsRelations = relations(roomsTable, ({ many }) => ({
  usersToRooms: many(usersToRooms),
}));

export const usersToRooms = pgTable(
  "users_to_rooms",
  {
    userId: integer()
      .notNull()
      .references(() => usersTable.id),
    roomId: integer()
      .notNull()
      .references(() => roomsTable.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roomId] })]
);

export const usersToRoomsRelations = relations(usersToRooms, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersToRooms.userId],
    references: [usersTable.id],
  }),
  room: one(roomsTable, {
    fields: [usersToRooms.roomId],
    references: [roomsTable.id],
  }),
}));

export const messagesTable = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  message: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
  authorId: integer().notNull(),
});

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [messagesTable.authorId],
    references: [usersTable.id],
  }),
}));
