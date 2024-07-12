import { DesktopLoadingChapterPlayer } from "@/components/chapter/desktop/desktop-loading-chapter-player";
import DeviceOnlyServerComponent from "@/components/ui/device-only/device-only-server";

export default function LoadingChapter() {
  return (
    <DeviceOnlyServerComponent allowedDevices={["desktop", "tablet"]}>
      <DesktopLoadingChapterPlayer className="w-full h-[100svh]" />
    </DeviceOnlyServerComponent>
  );
}
