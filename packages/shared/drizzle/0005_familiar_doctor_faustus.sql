ALTER TABLE "users_to_rooms" DROP CONSTRAINT "users_to_rooms_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_rooms" DROP CONSTRAINT "users_to_rooms_roomId_rooms_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_rooms" ADD CONSTRAINT "users_to_rooms_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_rooms" ADD CONSTRAINT "users_to_rooms_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;