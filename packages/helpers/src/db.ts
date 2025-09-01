import { db } from "@repo/shared/drizzle";
import { usersTable } from "@repo/shared/schema";

export const resetDb = async () => {
  await db.delete(usersTable);
};
