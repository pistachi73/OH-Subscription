import { cn } from "@/lib/utils/cn";
import type { ImageWithPlaceholderProps } from "./image-with-placeholder";
import { ImageWithPlaceholder } from "./image-with-placeholder";

type HeroImageProps = ImageWithPlaceholderProps & {
  containerClassname?: string;
};

export const HeroImage = ({
  src,
  fallbackSrc,
  containerClassname,
  ...props
}: HeroImageProps) => {
  if (!src && !fallbackSrc) return null;
  return (
    <div
      className={cn(
        "absolute left-0 top-0 aspect-video w-full overflow-hidden",
        "after:absolute after:z-10 after:left-0 after:top-0 after:h-full after:w-full after:bg-hero-gradient-bottom after:content-['']",
        "before:absolute before:z-10 before:left-0 before:top-0 before:h-full before:w-full before:bg-hero-gradient  before:content-['']",
        containerClassname,
      )}
    >
      <ImageWithPlaceholder
        src={src}
        fallbackSrc={fallbackSrc}
        sizes="(max-width: 1300px) 100vw, 75vw"
        fill
        {...props}
      />
    </div>
  );
};
