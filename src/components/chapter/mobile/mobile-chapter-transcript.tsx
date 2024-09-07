import { useChapterContext } from "../chapter-context";
import { ChapterTranscript } from "../chapter-transcript";
import { MobileChaterContentDrawer } from "./mobile-chapter-content-drawer";

export const MobileChapterTranscript = () => {
  const { activeTab } = useChapterContext();
  return (
    <MobileChaterContentDrawer
      header="Transcript"
      open={activeTab === "transcript"}
      className="p-0"
    >
      <ChapterTranscript />
    </MobileChaterContentDrawer>
  );
};
