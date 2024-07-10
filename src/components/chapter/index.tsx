import type {
  ProgramChapter,
  ProgramSpotlight,
} from "@/server/db/schema.types";
import DeviceOnlyServerComponent from "../ui/device-only/device-only-server";
import { ChapterContextProvider } from "./chapter-context";
import { DesktopChapter } from "./desktop";
import { MobileChapter } from "./mobile";

export type ChapterProps = {
  program: NonNullable<ProgramSpotlight>;
  chapter: NonNullable<ProgramChapter>;
};

export const Chapter = ({ program, chapter }: ChapterProps) => {
  return (
    <ChapterContextProvider chapter={chapter} program={program}>
      <ChapterContent />
    </ChapterContextProvider>
  );
};

export const ChapterContent = () => {
  return (
    <>
      <DeviceOnlyServerComponent allowedDevices={["desktop", "tablet"]}>
        <DesktopChapter />
      </DeviceOnlyServerComponent>
      <DeviceOnlyServerComponent allowedDevices={["mobile"]}>
        <MobileChapter />
      </DeviceOnlyServerComponent>
    </>
  );
};
