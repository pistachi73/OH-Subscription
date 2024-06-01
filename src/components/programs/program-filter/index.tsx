import { DesktopProgramFilter } from "./desktop-program-filter";
import { MobileProgramFilter } from "./mobile-program-filter";

import { DeviceOnly } from "@/components/ui/device-only/device-only";

export const ProgramFilter = () => {
  return (
    <>
      <DeviceOnly allowedDevices={["desktop", "tablet"]}>
        <DesktopProgramFilter />
      </DeviceOnly>
      <DeviceOnly allowedDevices="mobile">
        <MobileProgramFilter />
      </DeviceOnly>
    </>
  );
};
