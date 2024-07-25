import DeviceOnlyServerComponent from "@/components/ui/device-only/device-only-server";
import { DesktopProgramFilter } from "./desktop-filter";
import { MobileProgramFilter } from "./mobile-program-filter";

export const ProgramFilter = () => {
  return (
    <>
      <DeviceOnlyServerComponent allowedDevices={["desktop", "tablet"]}>
        <DesktopProgramFilter />
      </DeviceOnlyServerComponent>
      <DeviceOnlyServerComponent allowedDevices="mobile">
        <MobileProgramFilter />
      </DeviceOnlyServerComponent>
    </>
  );
};
