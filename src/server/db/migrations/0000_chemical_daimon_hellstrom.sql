CREATE TABLE IF NOT EXISTS "ohs_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "ohs_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL GENERATED ALWAYS AS (regexp_replace(
    regexp_replace(
      lower("ohs_category"."name"), -- Lowercase and remove accents in one step
      '[^a-z0-9\-_]+', '-', 'gi' -- Replace non-alphanumeric characters with hyphens
    ),
    '(^-+|-+$)', '', 'g' -- Remove leading and trailing hyphens
  )) STORED
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_category_program" (
	"program_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "ohs_category_program_category_id_program_id_pk" PRIMARY KEY("category_id","program_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_category_shot" (
	"shot_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "ohs_category_shot_category_id_shot_id_pk" PRIMARY KEY("category_id","shot_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"program_id" integer,
	"video_id" integer,
	"shot_id" integer,
	"parent_comment_id" integer,
	"content" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_like" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"comment_id" integer,
	"program_id" integer,
	"video_id" integer,
	"shot_id" integer,
	"is_like" boolean DEFAULT true NOT NULL,
	CONSTRAINT "ohs_like_user_id_program_id_unique" UNIQUE("user_id","program_id"),
	CONSTRAINT "ohs_like_user_id_shot_id_unique" UNIQUE("user_id","shot_id"),
	CONSTRAINT "ohs_like_user_id_comment_id_unique" UNIQUE("user_id","comment_id"),
	CONSTRAINT "ohs_like_user_id_video_id_unique" UNIQUE("user_id","video_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_password_reset_token" (
	"token" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "ohs_password_reset_token_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_program" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL GENERATED ALWAYS AS (regexp_replace(
    regexp_replace(
      lower("ohs_program"."title"), -- Lowercase and remove accents in one step
      '[^a-z0-9\-_]+', '-', 'gi' -- Replace non-alphanumeric characters with hyphens
    ),
    '(^-+|-+$)', '', 'g' -- Remove leading and trailing hyphens
  )) STORED,
	"description" text NOT NULL,
	"level" text NOT NULL,
	"total_chapters" integer DEFAULT 0 NOT NULL,
	"duration" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false,
	"thumbnail" text,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_shot" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL GENERATED ALWAYS AS (regexp_replace(
    regexp_replace(
      lower("ohs_shot"."title"), -- Lowercase and remove accents in one step
      '[^a-z0-9\-_]+', '-', 'gi' -- Replace non-alphanumeric characters with hyphens
    ),
    '(^-+|-+$)', '', 'g' -- Remove leading and trailing hyphens
  )) STORED,
	"description" text NOT NULL,
	"transcript" text,
	"playbackId" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_teacher" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"bio" text NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_teacher_program" (
	"program_id" integer NOT NULL,
	"teacherId" integer NOT NULL,
	CONSTRAINT "ohs_teacher_program_teacherId_program_id_pk" PRIMARY KEY("teacherId","program_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_two_factor_confirmation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_two_factor_token" (
	"token" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "ohs_two_factor_token_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"image" text,
	"password" text,
	"role" text DEFAULT 'USER',
	"is_two_factor_enabled" boolean DEFAULT false,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_subscription_ends_on" timestamp,
	CONSTRAINT "ohs_user_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "ohs_user_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_user_progress" (
	"user_id" text NOT NULL,
	"program_id" integer NOT NULL,
	"video_id" integer NOT NULL,
	"last_watched_at" timestamp DEFAULT now(),
	"completed" boolean DEFAULT false,
	"watched_duration" real DEFAULT 0,
	"progress" integer DEFAULT 0,
	CONSTRAINT "ohs_user_progress_user_id_video_id_program_id_pk" PRIMARY KEY("user_id","video_id","program_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_verification_token" (
	"token" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "ohs_verification_token_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_video" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL GENERATED ALWAYS AS (regexp_replace(
    regexp_replace(
      lower("ohs_video"."title"), -- Lowercase and remove accents in one step
      '[^a-z0-9\-_]+', '-', 'gi' -- Replace non-alphanumeric characters with hyphens
    ),
    '(^-+|-+$)', '', 'g' -- Remove leading and trailing hyphens
  )) STORED,
	"description" text NOT NULL,
	"playback_id" text NOT NULL,
	"duration" integer NOT NULL,
	"thumbnail" text,
	"transcript" text,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ohs_video_program" (
	"program_id" integer NOT NULL,
	"video_id" integer NOT NULL,
	"video_slug" text NOT NULL,
	"program_slug" text NOT NULL,
	"chapter_number" integer NOT NULL,
	"is_free" boolean DEFAULT false,
	CONSTRAINT "ohs_video_program_video_id_program_id_pk" PRIMARY KEY("video_id","program_id"),
	CONSTRAINT "ohs_video_program_video_id_program_id_chapter_number_unique" UNIQUE("video_id","program_id","chapter_number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_account" ADD CONSTRAINT "ohs_account_userId_ohs_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ohs_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_category_program" ADD CONSTRAINT "ohs_category_program_program_id_ohs_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."ohs_program"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_category_program" ADD CONSTRAINT "ohs_category_program_category_id_ohs_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ohs_category"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_category_shot" ADD CONSTRAINT "ohs_category_shot_shot_id_ohs_shot_id_fk" FOREIGN KEY ("shot_id") REFERENCES "public"."ohs_shot"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_category_shot" ADD CONSTRAINT "ohs_category_shot_category_id_ohs_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ohs_category"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_comment" ADD CONSTRAINT "ohs_comment_user_id_ohs_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ohs_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_comment" ADD CONSTRAINT "ohs_comment_program_id_ohs_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."ohs_program"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_comment" ADD CONSTRAINT "ohs_comment_video_id_ohs_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."ohs_video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_comment" ADD CONSTRAINT "ohs_comment_shot_id_ohs_shot_id_fk" FOREIGN KEY ("shot_id") REFERENCES "public"."ohs_shot"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_like" ADD CONSTRAINT "ohs_like_user_id_ohs_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ohs_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_like" ADD CONSTRAINT "ohs_like_comment_id_ohs_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."ohs_comment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_like" ADD CONSTRAINT "ohs_like_program_id_ohs_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."ohs_program"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_like" ADD CONSTRAINT "ohs_like_video_id_ohs_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."ohs_video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_like" ADD CONSTRAINT "ohs_like_shot_id_ohs_shot_id_fk" FOREIGN KEY ("shot_id") REFERENCES "public"."ohs_shot"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_teacher_program" ADD CONSTRAINT "ohs_teacher_program_program_id_ohs_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."ohs_program"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_teacher_program" ADD CONSTRAINT "ohs_teacher_program_teacherId_ohs_teacher_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."ohs_teacher"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_two_factor_confirmation" ADD CONSTRAINT "ohs_two_factor_confirmation_user_id_ohs_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ohs_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_user_progress" ADD CONSTRAINT "ohs_user_progress_user_id_ohs_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ohs_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_user_progress" ADD CONSTRAINT "ohs_user_progress_program_id_ohs_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."ohs_program"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_user_progress" ADD CONSTRAINT "ohs_user_progress_video_id_ohs_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."ohs_video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_video_program" ADD CONSTRAINT "ohs_video_program_program_id_ohs_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."ohs_program"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ohs_video_program" ADD CONSTRAINT "ohs_video_program_video_id_ohs_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."ohs_video"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_category_slug_index" ON "ohs_category" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_comment_video_id_index" ON "ohs_comment" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_comment_program_id_index" ON "ohs_comment" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_comment_shot_id_index" ON "ohs_comment" USING btree ("shot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_comment_parent_comment_id_index" ON "ohs_comment" USING btree ("parent_comment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_like_video_id_index" ON "ohs_like" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_like_program_id_index" ON "ohs_like" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_like_shot_id_index" ON "ohs_like" USING btree ("shot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_like_comment_id_index" ON "ohs_like" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_program_slug_index" ON "ohs_program" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_program_embedding_index" ON "ohs_program" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_shot_embedding_index" ON "ohs_shot" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_user_stripe_subscription_id_index" ON "ohs_user" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_user_progress_program_id_index" ON "ohs_user_progress" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_user_progress_video_id_index" ON "ohs_user_progress" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_user_progress_user_id_index" ON "ohs_user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_video_slug_index" ON "ohs_video" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_video_program_video_slug_index" ON "ohs_video_program" USING btree ("video_slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ohs_video_program_program_slug_index" ON "ohs_video_program" USING btree ("program_slug");