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
    href: "/shots",
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
    href: "/shots/",
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
