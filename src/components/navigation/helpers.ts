import { usePathname } from "next/navigation";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";

export const headerNavItems = [
  {
    title: "Programs",
    href: "/programs",
  },
  {
    title: "Shots",
    href: "/shots",
  },
  {
    title: "Coaching",
    href: "/",
  },
  {
    title: "Our clubs",
    href: "/",
  },
  {
    title: "Podcast",
    href: "/",
  },
];

export const useCanRenderHeader = () => {
  const pathname = usePathname();
  const { deviceType } = useDeviceType();

  const isShotPage =
    pathname.includes("/shots") &&
    pathname.split("/").filter(Boolean).length === 2;

  const isShotsMobile = isShotPage && deviceType === "mobile";

  return !isShotsMobile;
};

export const useCanRenderFooter = () => {
  const pathname = usePathname();

  const isShotPage =
    pathname.includes("/shots") &&
    pathname.split("/").filter(Boolean).length === 2;

  return !isShotPage;
};
