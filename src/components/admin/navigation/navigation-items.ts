import {
  BookOpen,
  GraduationCap,
  Layers3,
  type LucideIcon,
  MonitorPlay,
} from "lucide-react";

export const navigationItems: {
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Programs",
    href: "/admin/programs",
    icon: BookOpen,
  },
  {
    label: "Videos",
    href: "/admin/videos",
    icon: MonitorPlay,
  },

  {
    label: "Teachers",
    href: "/admin/teachers",
    icon: GraduationCap,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers3,
  },
];
