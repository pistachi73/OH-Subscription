"use client";

import { DesktopHeader } from "./desktop-header";
import { useCanRenderHeader } from "./helpers";
import { MobileHeader } from "./mobile-header";

import { DeviceOnly } from "@/components/ui/device-only/device-only";

export const Header = () => {
  const { canRenderHeader: canRender } = useCanRenderHeader();

  if (!canRender) {
    return null;
  }

  return (
    <>
      <DeviceOnly allowedDevices={["mobile"]}>
        <MobileHeader />
      </DeviceOnly>
      <DeviceOnly allowedDevices={["tablet", "desktop"]}>
        <DesktopHeader />
      </DeviceOnly>
    </>
  );
};
