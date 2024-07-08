import { useChapterContext } from "../chapter-context";
import { ChapterList } from "../chapter-list";
import { MobileChaterContentDrawer } from "./mobile-chapter-content-drawer";

export const MobileChapterList = () => {
  const { activeTab } = useChapterContext();
  return (
    <MobileChaterContentDrawer
      header="Chapters"
      open={activeTab === "chapters"}
      className="p-0"
    >
      <ChapterList />
    </MobileChaterContentDrawer>
  );
};
