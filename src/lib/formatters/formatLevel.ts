import type { Option } from "@/components/ui/admin/admin-multiple-select";
import type { ProgramLevel } from "@/types";

export const LEVEL_OPTIONS: Option[] = [
  { label: "A1 - A2 Beginner", value: "BEGINNER" },
  { label: "B1 - B2 Intermediate", value: "INTERMEDIATE" },
  { label: "C1 - C2 Advanced", value: "ADVANCED" },
];

export const levelMap: Record<
  ProgramLevel,
  {
    shortFormat: string;
    longFormat: string;
  }
> = {
  BEGINNER: {
    shortFormat: "A1 - A2",
    longFormat: "Beginner (A1 - A2)",
  },
  INTERMEDIATE: {
    shortFormat: "B1 - B2",
    longFormat: "Intermediate (B1 - B2)",
  },
  ADVANCED: {
    shortFormat: "C1 - C2",
    longFormat: "Advanced (C1 - C2)",
  },
};
