import { headers } from "next/headers";

import type { DeviceType } from "@/components/ui/device-only/device-only-provider";

export const VERCEL_HEADERS = {
  HOST: "x-nexturl-host",
  URL: "x-url",
  PATHNAME: "x-pathname",
  COUNTRY: "x-geo-country-code",
  DEVICE_TYPE: "x-device-type",
} as const;

export const getHeaders = () => {
  const parsedHeaders = headers();
  const countryCode = parsedHeaders.get(VERCEL_HEADERS.COUNTRY) as string;
  const deviceType = parsedHeaders.get(
    VERCEL_HEADERS.DEVICE_TYPE,
  ) as DeviceType;
  const authorization =
    parsedHeaders.get("authorization") || parsedHeaders.get("Authorization");

  return {
    countryCode,
    deviceType,
    authorization,
  };
};
