ALTER TABLE "programs" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "shots" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;