CREATE TABLE IF NOT EXISTS "userProgresses" (
	"userId" text NOT NULL,
	"programId" integer NOT NULL,
	"videoId" integer NOT NULL,
	"lastWatchedAt" timestamp DEFAULT now(),
	"completed" boolean DEFAULT false,
	"watchedDuration" real DEFAULT 0,
	"progress" integer DEFAULT 0,
	CONSTRAINT "userProgresses_userId_videoId_programId_pk" PRIMARY KEY("userId","videoId","programId"),
	CONSTRAINT "userProgresses_userId_programId_videoId" UNIQUE("userId","programId","videoId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userProgresses" ADD CONSTRAINT "userProgresses_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userProgresses" ADD CONSTRAINT "userProgresses_programId_programs_id_fk" FOREIGN KEY ("programId") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userProgresses" ADD CONSTRAINT "userProgresses_videoId_video_id_fk" FOREIGN KEY ("videoId") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userProgresses_programId_index" ON "userProgresses" USING btree ("programId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userProgresses_videoId_index" ON "userProgresses" USING btree ("videoId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userProgresses_userId_index" ON "userProgresses" USING btree ("userId");