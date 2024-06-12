import { Home, Mic, MonitorPlay, PlaySquare, Speech } from "lucide-react";

import { usePathname } from "next/navigation";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";

export const headerNavItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Programs",
    href: "/programs",
  },
  {
    title: "Shots",
    href: "/shots/1/",
  },
];

export const mobileNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Programs",
    href: "/programs/",
    icon: MonitorPlay,
  },
  {
    title: "Shots",
    href: "/shots/1/",
    icon: PlaySquare,
  },
  {
    title: "Coaching",
    href: "/coaching/",
    icon: Speech,
  },
  {
    title: "Podcast",
    href: "/podcast/",
    icon: Mic,
  },
] as const;

const renderDesktopHeaderAsScrolledPathnames = [
  "/account/",
  "/account/subscription/",
];

export const useCanRenderHeader = () => {
  const pathname = usePathname();
  const { deviceType } = useDeviceType();

  const isShotsMobile = pathname.includes("/shots") && deviceType === "mobile";

  const renderAsScrolled =
    renderDesktopHeaderAsScrolledPathnames.includes(pathname);

  return { visible: !isShotsMobile, renderAsScrolled };
};

export const useCanRenderFooter = () => {
  const pathname = usePathname();

  const isShotPage = pathname.includes("/shots");

  return !isShotPage;
};
