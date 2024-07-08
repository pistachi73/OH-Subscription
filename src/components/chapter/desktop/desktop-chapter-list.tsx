import { useChapterContext } from "../chapter-context";
import { ChapterList } from "../chapter-list";
import { ChapterSideWrapper } from "./desktop-chapter-side-wrapper";

export const DesktopChapterList = () => {
  const { activeTab, setActiveTab } = useChapterContext();
  return (
    <ChapterSideWrapper
      header="Chapters"
      isDialogOpen={activeTab === "chapters"}
      onDialogOpenChange={(open) => {
        if (!open) {
          setActiveTab(null);
        }
      }}
    >
      <ChapterList />
    </ChapterSideWrapper>
  );
};
