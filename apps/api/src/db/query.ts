import type {
  InsertMessage,
  InsertRoom,
  InsertUser,
  SelectMessage,
  SelectRoom,
  SelectUser,
  SelectUsersToRooms,
} from "@repo/shared/types";
import { db } from "@repo/shared/drizzle";
import {
  messagesTable,
  roomsTable,
  usersTable,
  usersToRooms,
} from "@repo/shared/schema";
import { and, eq } from "drizzle-orm";
import type { MessageWithAuthor } from "@repo/types/message";

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

export const getUserInRoomDb = async (
  userId: number,
  roomId: number
): Promise<SelectUsersToRooms | null> => {
  const [user] = await db
    .select()
    .from(usersToRooms)
    .where(
      and(eq(usersToRooms.userId, userId), eq(usersToRooms.roomId, roomId))
    );
  return user ?? null;
};

export const getRoomDb = async (roomId: number): Promise<SelectRoom | null> => {
  const [room] = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.id, roomId));
  return room ?? null;
};

export const joinRoomDb = async (
  userId: number,
  roomId: number
): Promise<{ user: SelectUser; room: SelectRoom; isAdmin: boolean } | null> => {
  await db
    .insert(usersToRooms)
    .values({
      roomId: roomId,
      userId: userId,
    })
    .returning();
  const [joined] = await db
    .select({
      user: usersTable,
      room: roomsTable,
      isAdmin: usersToRooms.isAdmin,
    })
    .from(usersToRooms)
    .where(
      and(eq(usersToRooms.userId, userId), eq(usersToRooms.roomId, roomId))
    )
    .innerJoin(usersTable, eq(usersToRooms.userId, usersTable.id))
    .innerJoin(roomsTable, eq(usersToRooms.roomId, roomsTable.id));
  return joined ?? null;
};

export const createRoomDb = async (
  userId: number,
  body: InsertRoom
): Promise<{ user: SelectUser; room: SelectRoom; isAdmin: boolean } | null> => {
  const result = await db.transaction(async (tx) => {
    const [room] = await tx.insert(roomsTable).values(body).returning();
    const [insertResult] = await tx
      .insert(usersToRooms)
      .values({
        roomId: room.id,
        userId: userId,
        isAdmin: true,
      })
      .returning();

    const [joined] = await tx
      .select({
        user: usersTable,
        room: roomsTable,
        isAdmin: usersToRooms.isAdmin,
      })
      .from(usersToRooms)
      .where(
        and(
          eq(usersToRooms.userId, userId),
          eq(usersToRooms.roomId, insertResult.roomId)
        )
      )
      .innerJoin(usersTable, eq(usersToRooms.userId, usersTable.id))
      .innerJoin(roomsTable, eq(usersToRooms.roomId, roomsTable.id));

    return joined;
  });
  return result ?? null;
};

export const getMessagesDb = async (
  roomId: number
): Promise<MessageWithAuthor[] | null> => {
  const messages = await db
    .select({
      message: messagesTable,
      author: usersTable,
    })
    .from(messagesTable)
    .where(eq(messagesTable.roomId, roomId))
    .innerJoin(usersTable, eq(messagesTable.authorId, usersTable.id));
  return messages ?? null;
};

export const createMessageDb = async (
  newMessage: InsertMessage
): Promise<SelectMessage | null> => {
  const message = await db.insert(messagesTable).values(newMessage).returning();
  return message[0] ?? null;
};
