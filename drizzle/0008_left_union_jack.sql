DROP INDEX IF EXISTS "programs_document_index";--> statement-breakpoint
ALTER TABLE "programs" DROP COLUMN IF EXISTS "document";