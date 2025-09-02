import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
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
