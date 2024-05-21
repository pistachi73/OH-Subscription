CREATE TABLE IF NOT EXISTS "test" (
	"title" text NOT NULL,
	"description" text NOT NULL,
	"document" tsvector generated always as (to_tsvector('english', title || ' ' || description)) stored
);
--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "document" "tsvector";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "test_document_index" ON "test" USING GIN ("document");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "programs_document_index" ON "programs" ("document");		