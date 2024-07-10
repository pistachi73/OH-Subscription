"use server";

import { VERCEL_HEADERS } from "@/lib/get-headers";
import { headers } from "next/headers";
import type { DeviceType } from "../ui/device-only/device-only-provider";

export const getChapter = async () => {
  const deviceType = headers().get(VERCEL_HEADERS.DEVICE_TYPE) as DeviceType;

  const isMobile = deviceType === "mobile";

  if (isMobile) {
    return import("./mobile").then((mod) => mod.MobileChapter);
  }

  return import("./desktop").then((mod) => mod.DesktopChapter);
};
