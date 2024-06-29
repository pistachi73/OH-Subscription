import { useMediaFullscreenRef } from "media-chrome/react/media-store";

export const ChapterPlayerContainer = ({
  children,
}: { children: React.ReactNode }) => {
  const mediaFullscreenRef = useMediaFullscreenRef();
  return (
    <div className="w-full h-full relative z-10" ref={mediaFullscreenRef}>
      {children}
    </div>
  );
};
