import { VERCEL_HEADERS } from "@/lib/get-headers";
import { headers } from "next/headers";
import type { PropsWithChildren } from "react";
import type { DeviceType } from "./device-only-provider";

type SSRProps = {
  allowedDevices: DeviceType | DeviceType[];
};

const DeviceOnlyServerComponent: React.FC<PropsWithChildren<SSRProps>> = ({
  children,
  allowedDevices,
}) => {
  const deviceType = headers().get(VERCEL_HEADERS.DEVICE_TYPE) as DeviceType;
  return (Array.isArray(allowedDevices) &&
    allowedDevices.includes(deviceType)) ||
    allowedDevices === deviceType
    ? children
    : null;
};

export default DeviceOnlyServerComponent;
