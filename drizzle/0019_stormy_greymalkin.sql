ALTER TABLE "programs" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "programs" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
ALTER TABLE "programs" DROP COLUMN IF EXISTS "document";