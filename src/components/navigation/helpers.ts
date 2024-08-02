import { usePathname } from "next/navigation";

import { useDeviceType } from "@/components/ui/device-only/device-only-provider";
import {
  FlashIcon,
  FlashOutlineIcon,
  HomeIcon,
  HomeOutlineIcon,
  MicIcon,
  MicOutlineIcon,
  ScreenPlayIcon,
  ScreenPlayOutlineIcon,
  TalkIcon,
  TalkOutlineIcon,
} from "@/components/ui/icons";

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
    icon: HomeIcon,
    iconOutline: HomeOutlineIcon,
  },
  {
    title: "Programs",
    href: "/programs/",
    icon: ScreenPlayIcon,
    iconOutline: ScreenPlayOutlineIcon,
  },
  {
    title: "Shots",
    href: "/shots/1/",
    icon: FlashIcon,
    iconOutline: FlashOutlineIcon,
  },
  {
    title: "Coaching",
    href: "/coaching/",
    icon: TalkIcon,
    iconOutline: TalkOutlineIcon,
  },
  {
    title: "Podcast",
    href: "/podcast/",
    icon: MicIcon,
    iconOutline: MicOutlineIcon,
  },
] as const;

const renderDesktopHeaderAsScrolledPathnames = [
  "/account/",
  "/account/subscription/",
];

export const useCanRenderHeader = () => {
  const pathname = usePathname();
  const { deviceType, isMobile } = useDeviceType();

  const isShotsMobile = pathname.includes("/shots") && isMobile;
  const isChapter = pathname.includes("/chapter");
  const isPlans = pathname.includes("/plans");

  const renderAsScrolled =
    renderDesktopHeaderAsScrolledPathnames.includes(pathname) ||
    pathname.includes("/chapter");

  const renderBottomBar = !pathname.includes("/chapter");
  const renderTopBar = !pathname.includes("/chapter");

  return {
    visible: !isShotsMobile && !isChapter && !isPlans,
    renderAsScrolled,
    renderBottomBar,
    renderTopBar,
  };
};

export const useCanRenderFooter = () => {
  const pathname = usePathname();

  const isShotPage = pathname.includes("/shots");
  const isChapter = pathname.includes("/chapter");
  const isPlans = pathname.includes("/plans");

  return !isShotPage && !isChapter && !isPlans;
};
