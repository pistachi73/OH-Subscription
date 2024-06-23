ALTER TABLE "shots" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shotsEmbeddingIndex" ON "shots" USING hnsw ("embedding" vector_cosine_ops);