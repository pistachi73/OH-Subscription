CREATE TABLE IF NOT EXISTS "likesOnComments" (
	"commentId" integer NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "likes" integer DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likesOnComments" ADD CONSTRAINT "likesOnComments_commentId_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likesOnComments" ADD CONSTRAINT "likesOnComments_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
