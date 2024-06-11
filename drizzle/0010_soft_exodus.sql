ALTER TABLE "user" ADD COLUMN "stripeSubscriptionEndsOn" integer;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "isActive";