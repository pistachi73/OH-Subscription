ALTER TABLE "likesOnComments" RENAME TO "likes";--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likesOnComments_commentId_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likesOnComments_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" ALTER COLUMN "commentId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "programId" integer;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "videoId" integer;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "shotId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_commentId_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_programId_programs_id_fk" FOREIGN KEY ("programId") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_videoId_video_id_fk" FOREIGN KEY ("videoId") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_shotId_shots_id_fk" FOREIGN KEY ("shotId") REFERENCES "public"."shots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likes_videoId_index" ON "likes" USING btree ("videoId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likes_programId_index" ON "likes" USING btree ("programId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likes_shotId_index" ON "likes" USING btree ("shotId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likes_commentId_index" ON "likes" USING btree ("commentId");