CREATE TABLE IF NOT EXISTS "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"commentId" integer,
	"programId" integer,
	"videoId" integer,
	"shotId" integer,
	"isLike" boolean DEFAULT true NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "like_userId_programId" UNIQUE("userId","programId"),
	CONSTRAINT "like_userId_shotId" UNIQUE("userId","shotId"),
	CONSTRAINT "like_userId_commentId" UNIQUE("userId","commentId"),
	CONSTRAINT "like_userId_videoId" UNIQUE("userId","videoId")
);
--> statement-breakpoint
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