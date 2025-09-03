CREATE TABLE "rooms" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rooms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_to_rooms" (
	"userId" integer NOT NULL,
	"roomId" integer NOT NULL,
	CONSTRAINT "users_to_rooms_userId_roomId_pk" PRIMARY KEY("userId","roomId")
);
--> statement-breakpoint
ALTER TABLE "users_to_rooms" ADD CONSTRAINT "users_to_rooms_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_rooms" ADD CONSTRAINT "users_to_rooms_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;