import type { InsertUser, SelectUser } from "@repo/shared/types";
import { db } from "./drizzle.js";
import { usersTable } from "@repo/shared/schema";

export const registerDb = async (
  newUser: InsertUser
): Promise<SelectUser | null> => {
  const user = await db.insert(usersTable).values(newUser).returning();
  return user[0] ?? null;
};
