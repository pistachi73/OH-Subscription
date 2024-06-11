ALTER TABLE "user" ADD COLUMN "stripeCustomerId" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripeSubscriptionId" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isActive" boolean DEFAULT false;