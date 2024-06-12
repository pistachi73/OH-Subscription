import DeviceOnlyServerComponent from "../ui/device-only/device-only-server";
import { DesktopHeader } from "./desktop-header";
import { MobileHeader } from "./mobile-header";

export const Header = () => {
  return (
    <>
      <DeviceOnlyServerComponent allowedDevices={["mobile"]}>
        <MobileHeader />
      </DeviceOnlyServerComponent>
      <DeviceOnlyServerComponent allowedDevices={["tablet", "desktop"]}>
        <DesktopHeader />
      </DeviceOnlyServerComponent>
    </>
  );
};
