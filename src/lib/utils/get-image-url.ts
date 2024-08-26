import { env } from "@/env";

export const getImageUrl = (image: string) => {
  return `${env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${image}`;
};
