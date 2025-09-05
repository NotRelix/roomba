import { db } from "@repo/shared/drizzle";
import {
  messagesTable,
  roomsTable,
  usersTable,
  usersToRooms,
} from "@repo/shared/schema";

export const resetDb = async () => {
  try {
    await db.delete(usersToRooms);
    await db.delete(messagesTable);
    await db.delete(usersTable);
    await db.delete(roomsTable);
  } catch (err) {
    console.error(err);
  }
};
