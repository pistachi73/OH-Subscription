import {
  formatPaymentMethod,
  formatPrice,
  formatProduct,
  formatSubscription,
} from "@/lib/formatters/formatSubscription";
import { api } from "@/trpc/server";

export const getData = async () => {
  const data = await api.payment.getSubscription.query();

  return {
    price: formatPrice(data?.price),
    subscription: formatSubscription(data?.subscription),
    paymentMethod: formatPaymentMethod(data?.paymentMethod),
    product: formatProduct(data?.product),
  };
};
