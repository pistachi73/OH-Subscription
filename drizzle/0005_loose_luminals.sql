DROP INDEX IF EXISTS "slugIdx";--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "programs_slug_index" ON "programs" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "video_slug_index" ON "video" ("slug");