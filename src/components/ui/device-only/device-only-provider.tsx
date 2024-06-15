"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
export type DeviceSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type DeviceType = "mobile" | "tablet" | "desktop";

type CountProviderProps = { children: React.ReactNode; deviceType: DeviceType };

const DeviceTypeContext = createContext<
  | {
      deviceSize: DeviceSize[];
      deviceType: DeviceType;
      isMobile: boolean;
    }
  | undefined
>(undefined);

export const SCREENS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

const getIsMobileUsingViewport = (
  serverDeviceType: DeviceType,
  viewportWidth: number,
): { deviceType: DeviceType; deviceSize: DeviceSize[] } => {
  const deviceType =
    viewportWidth < SCREENS.SM
      ? "mobile"
      : viewportWidth < SCREENS.LG
        ? "tablet"
        : "desktop";

  const isLandscape = window.matchMedia("(orientation: landscape").matches;

  if (serverDeviceType === "mobile" && isLandscape) {
    return {
      deviceType: "mobile",
      deviceSize: ["xs", "sm"],
    };
  }

  switch (true) {
    case viewportWidth < SCREENS.SM:
      return { deviceType, deviceSize: ["xs"] };
    case viewportWidth < SCREENS.MD:
      return { deviceType, deviceSize: ["xs", "sm"] };
    case viewportWidth < SCREENS.LG:
      return { deviceType, deviceSize: ["xs", "sm", "md"] };
    case viewportWidth < SCREENS.XL:
      return { deviceType, deviceSize: ["xs", "sm", "md", "lg"] };
    case viewportWidth < SCREENS["2XL"]:
      return { deviceType, deviceSize: ["xs", "sm", "md", "lg", "xl"] };
    default:
      return {
        deviceType,
        deviceSize: ["xs", "sm", "md", "lg", "xl", "2xl"],
      };
  }
};

export const DeviceOnlyProvider = ({
  children,
  deviceType: serverDeviceType,
}: CountProviderProps) => {
  const [deviceTypeState, setDeviceType] =
    useState<DeviceType>(serverDeviceType);
  const [deviceSizeState, setDeviceSize] = useState<DeviceSize[]>(
    serverDeviceType === "mobile"
      ? ["xs"]
      : serverDeviceType === "tablet"
        ? ["xs", "sm", "md"]
        : ["xs", "sm", "md", "lg", "xl", "2xl"],
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth) {
        const { deviceType, deviceSize } = getIsMobileUsingViewport(
          serverDeviceType,
          window.innerWidth,
        );

        setDeviceType(deviceType);
        setDeviceSize(deviceSize);
      }
    };

    const { deviceType, deviceSize } = getIsMobileUsingViewport(
      serverDeviceType,
      window.innerWidth,
    );

    setDeviceType(deviceType);
    setDeviceSize(deviceSize);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const value = useMemo(
    () => ({
      deviceType: deviceTypeState,
      deviceSize: deviceSizeState,
      isMobile: deviceTypeState === "mobile",
    }),
    [deviceTypeState, deviceSizeState],
  );
  return (
    <DeviceTypeContext.Provider value={value}>
      {children}
    </DeviceTypeContext.Provider>
  );
};

export const useDeviceType = () => {
  const context = useContext(DeviceTypeContext);
  if (context === undefined) {
    throw new Error("useDeviceType must be used within a DeviceTypeProvider");
  }
  return context;
};
