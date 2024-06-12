CREATE TABLE IF NOT EXISTS "categories_shots" (
	"shotId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	CONSTRAINT "categories_shots_categoryId_shotId_pk" PRIMARY KEY("categoryId","shotId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shots" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"playbackId" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"transcript" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_shots" ADD CONSTRAINT "categories_shots_shotId_shots_id_fk" FOREIGN KEY ("shotId") REFERENCES "public"."shots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_shots" ADD CONSTRAINT "categories_shots_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
