ALTER TABLE "programs" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slugIdx" ON "programs" ("slug");