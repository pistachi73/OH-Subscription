ALTER TABLE "programs" ADD COLUMN "document" tsvector generated always as (to_tsvector('english', title || ' ' || description)) stored;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "programs_document_index" ON "programs" USING GIN ("document");