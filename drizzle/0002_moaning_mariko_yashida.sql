CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories_programs" (
	"programId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	CONSTRAINT "categories_programs_categoryId_programId_pk" PRIMARY KEY("categoryId","programId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_programs" ADD CONSTRAINT "categories_programs_programId_programs_id_fk" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_programs" ADD CONSTRAINT "categories_programs_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
