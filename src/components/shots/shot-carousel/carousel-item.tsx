import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import { VerticalCarouselItem } from "@/components/ui/vertical-carousel";
import { cn } from "@/lib/utils";

export const CarouselItem = ({ children }: { children: React.ReactNode }) => {
  const { deviceType } = useDeviceType();
  return (
    <VerticalCarouselItem
      className={cn(
        "flex h-full w-full basis-full justify-center",
        deviceType === "mobile"
          ? "pt-0 sm:pt-0 mt-0 sm:mt-0"
          : "sm:max-h-[100%] sm:basis-full",
      )}
    >
      {children}
    </VerticalCarouselItem>
  );
};
