import { useChapterContext } from "../chapter-context";
import { MobileChaterContentDrawer } from "./mobile-chapter-content-drawer";

type ChapterTranscriptProps = {
  transcript?: string | null;
};

export const MobileChapterTranscript = ({
  transcript,
}: ChapterTranscriptProps) => {
  if (!transcript) return null;

  const { activeTab } = useChapterContext();
  return (
    <MobileChaterContentDrawer
      header="Transcript"
      open={activeTab === "transcript"}
      className="p-0"
    >
      <p className="overflow-auto p-4">{transcript ?? "transcript"}</p>
    </MobileChaterContentDrawer>
  );
};
