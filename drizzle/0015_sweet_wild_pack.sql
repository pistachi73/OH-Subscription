ALTER TABLE "comments" ADD COLUMN "shotId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_shotId_shots_id_fk" FOREIGN KEY ("shotId") REFERENCES "public"."shots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
