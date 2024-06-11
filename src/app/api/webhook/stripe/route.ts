import { env } from "@/env";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

type Metadata = {
  userId: string;
};

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

const webhookHandler = async (req: NextRequest) => {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // On error, log and return the error message.
      if (err instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);

      return NextResponse.json(
        {
          error: {
            message: `Webhook Error: ${errorMessage}`,
          },
        },
        { status: 400 },
      );
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id);

    // getting to the data we want from the event
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session & {
          metadata: Metadata;
        };
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );

        const userId = session.metadata.userId;
        const stripeSubscriptionId = subscription.id;
        const stripeSubscriptionEndsOn = new Date(
          subscription.current_period_end * 1000,
        );

        await db
          .update(users)
          .set({
            stripeSubscriptionId,
            stripeSubscriptionEndsOn,
          })
          .where(eq(users.id, userId));

        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;

        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string,
        );

        const subscriptionId = subscription.id;
        const stripeSubscriptionEndsOn = new Date(
          subscription.current_period_end * 1000,
        );

        await db
          .update(users)
          .set({
            stripeSubscriptionEndsOn,
          })
          .where(eq(users.stripeSubscriptionId, subscriptionId));

        break;
      }

      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      {
        error: {
          message: "Method Not Allowed",
        },
      },
      { status: 405 },
    ).headers.set("Allow", "POST");
  }
};

export { webhookHandler as POST };
