import type {
  InsertMessage,
  InsertUser,
  SelectMessage,
  SelectUser,
} from "@repo/shared/types";
import { db } from "@repo/shared/drizzle";
import { messagesTable, usersTable } from "@repo/shared/schema";
import { eq } from "drizzle-orm";

export const getUsernameDb = async (
  username: string
): Promise<SelectUser | null> => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  return user[0] ?? null;
};

export const getEmailDb = async (email: string): Promise<SelectUser | null> => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return user[0] ?? null;
};

export const registerDb = async (
  newUser: InsertUser
): Promise<SelectUser | null> => {
  const user = await db.insert(usersTable).values(newUser).returning();
  return user[0] ?? null;
};

export const getAuthorDb = async (
  authorId: number
): Promise<SelectUser | null> => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, authorId));
  return user[0] ?? null;
};

export const createMessageDb = async (
  newMessage: InsertMessage
): Promise<SelectMessage | null> => {
  const message = await db.insert(messagesTable).values(newMessage).returning();
  return message[0] ?? null;
};
