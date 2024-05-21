import { headers } from "next/headers";

import type { DeviceType } from "@/components/ui/device-only/device-only-provider";

export const getHeaders = () => {
  const parsedHeaders = headers();
  const countryCode = parsedHeaders.get("x-geo-country-code");
  const deviceType = parsedHeaders.get("x-device-type") as DeviceType;
  const authorization =
    parsedHeaders.get("authorization") || parsedHeaders.get("Authorization");

  return {
    countryCode,
    deviceType,
    authorization,
  };
};
