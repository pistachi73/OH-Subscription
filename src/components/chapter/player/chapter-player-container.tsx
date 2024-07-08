import { useMediaFullscreenRef } from "media-chrome/react/media-store";

export const ChapterPlayerContainer = ({
  children,
}: { children: React.ReactNode }) => {
  const mediaFullscreenRef = useMediaFullscreenRef();
  return (
    <div className="w-full relative" ref={mediaFullscreenRef}>
      {children}
    </div>
  );
};
