import type Stripe from "stripe";

const currencySymbols: Record<Partial<Stripe.Price["currency"]>, string> = {
  eur: "€",
  usd: "$",
};

export const formatSubscription = (subscription?: Stripe.Subscription) => {
  if (!subscription) return null;
  return {
    id: subscription.id,
    status: subscription.status,
    created: new Date(subscription.created * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  };
};

export const formatPaymentMethod = (paymentMethod?: Stripe.PaymentMethod) => {
  if (!paymentMethod) return null;
  return {
    id: paymentMethod.id,
    type: paymentMethod.type,
    card: {
      last4: paymentMethod?.card?.last4,
    },
  };
};

export const formatProduct = (product?: Stripe.Product) => {
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,

    images: product.images[0],
  };
};

export const formatPrice = (price?: Stripe.Price) => {
  if (!price) return null;
  return {
    id: price.id,
    currency: currencySymbols[price.currency],
    price:
      price.unit_amount && price.recurring?.interval
        ? `${price.unit_amount / 100}${currencySymbols[price.currency]}/${
            price.recurring?.interval
          }`
        : undefined,
    unitAmount: (price.unit_amount ?? 0) / 100,
    recurring: {
      interval: price.recurring?.interval,
      trial_period_days: price.recurring?.trial_period_days,
    },
  };
};
