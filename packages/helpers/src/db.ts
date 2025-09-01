import { db } from "@repo/shared/drizzle";
import { messagesTable, usersTable } from "@repo/shared/schema";

export const resetDb = async () => {
  await db.delete(usersTable);
  await db.delete(messagesTable);
};
