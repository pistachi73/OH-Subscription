import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export const FilterBadge = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => {
  return (
    <Badge
      variant="accent"
      className="h-8 cursor-pointer rounded-md text-sm  hover:bg-destructive hover:text-destructive-foreground"
      onClick={onRemove}
    >
      {label}
      <X size={14} className="ml-2" />
    </Badge>
  );
};

export const FilterBadgesList = ({
  title,
  list,
  mappedValues,
  onRemove,
}: {
  title: string;
  mappedValues: Record<string, string>;
  onRemove: (value: string) => void;
  list?: string[];
}) => {
  if (!list?.filter(Boolean).length) return null;

  return (
    <>
      <p className="pl-3 text-muted-foreground first:pl-0">{title}</p>
      {list?.map((value) => {
        const label = mappedValues[value];
        if (!label) return null;
        return (
          <FilterBadge
            key={value}
            label={label}
            onRemove={() => onRemove(value)}
          />
        );
      })}
    </>
  );
};
