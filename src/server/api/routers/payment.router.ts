import { env } from "@/env";
import { getUrl } from "@/lib/utils/get-url";
import { getBaseUrl } from "@/trpc/shared";
import { TRPCError } from "@trpc/server";
import { Stripe } from "stripe";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

export const paymentRouter = createTRPCRouter({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: { user },
    } = ctx;

    const customerId = user.stripeCustomerId;
    const subscriptionId = user.stripeSubscriptionId;

    if (!subscriptionId || !customerId) {
      return null;
    }

    let paymentMethod = undefined;
    let product = undefined;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      return null;
    }

    const defaultPaymentMethodId = subscription.default_payment_method;

    if (typeof defaultPaymentMethodId === "string") {
      paymentMethod = await stripe.paymentMethods.retrieve(
        defaultPaymentMethodId,
      );
    }

    const productId = subscription.items.data[0]?.price.product;

    if (typeof productId === "string") {
      product = await stripe.products.retrieve(productId);
    }

    return {
      subscription,
      paymentMethod,
      product,
      price: subscription.items.data[0]?.price,
    };
  }),

  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;

      const baseUrl = getBaseUrl();

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: session.user.stripeCustomerId,
        line_items: [
          {
            price: input.productId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id as string,
        },
        success_url: getUrl("/account/subscription/"),
        cancel_url: getUrl("/plans/"),
        subscription_data: {
          trial_period_days: 7,
        },
      });

      if (!checkoutSession.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create checkout session",
        });
      }

      return {
        checkoutSession,
      };
    }),

  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { session } = ctx;

    const billingPortalSession = await stripe.billingPortal.sessions.create({
      customer: session.user.stripeCustomerId,
      return_url: getUrl("/account/subscription/"),
    });

    if (!billingPortalSession.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create billing portal session",
      });
    }

    return {
      billingPortalSession,
    };
  }),
});
