import { db } from "@repo/shared/drizzle";
import {
  messagesTable,
  roomsTable,
  usersTable,
  usersToRooms,
} from "@repo/shared/schema";
import { sql } from "drizzle-orm";

export const resetDb = async () => {
  try {
    await db.execute(
      sql`
        TRUNCATE TABLE 
        ${usersToRooms}, 
        ${messagesTable}, 
        ${usersTable}, 
        ${roomsTable} 
        RESTART IDENTITY CASCADE
      `
    );
  } catch (err) {
    console.error(err);
  }
};
