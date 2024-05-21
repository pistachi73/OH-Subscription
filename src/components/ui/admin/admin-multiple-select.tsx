import clsx from "clsx";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "../badge";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../dropdown-menu";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type AdminMultipleSelectProps = {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  onSelect?: (value: any) => void;
  onDeselect?: (value: any) => void;
  children: React.ReactNode;
  showSelected?: boolean;
  disableSelected?: boolean;
  disabled?: boolean;
};

const getSelectedOptionsValues = (value?: string) => {
  return value
    ? value?.split(",").filter(Boolean).length > 0
      ? value?.split(",")
      : []
    : [];
};

export const AdminMultipleSelect = ({
  options,
  value,
  onChange,
  children,
  onSelect,
  onDeselect,
  disableSelected = false,
  showSelected = true,
  disabled = false,
}: AdminMultipleSelectProps) => {
  const mappedOptions = useMemo(
    () =>
      options.reduce((prev: Record<string, string>, curr) => {
        prev[curr.value] = curr.label;
        return prev;
      }, {}),
    [options],
  );

  const [selectedOptionsValues, setSelectedOptionsValues] = useState<
    string[] | null
  >(getSelectedOptionsValues(value));

  useEffect(() => {
    setSelectedOptionsValues(getSelectedOptionsValues(value));
  }, [value]);

  const onCheckedChange = (value: string) => {
    let newSelectedOptionsValues = [...(selectedOptionsValues || [])];

    if (selectedOptionsValues?.includes(value)) {
      onDeselect?.(value);
      newSelectedOptionsValues = selectedOptionsValues?.filter(
        (item) => item !== value,
      );
    } else {
      onSelect?.(value);
      newSelectedOptionsValues.push(value);
    }

    setSelectedOptionsValues(newSelectedOptionsValues);
    onChange(newSelectedOptionsValues?.join(",") || "");
  };

  const onBadgeClick = (value: string) => {
    onDeselect?.(value);
    const newSelectedOptionsValues = [
      ...(selectedOptionsValues?.filter((item) => item !== value) || []),
    ];

    setSelectedOptionsValues(newSelectedOptionsValues);
    onChange(newSelectedOptionsValues?.join(",") || "");
  };

  return (
    <div
      className={clsx("flex flex-row flex-wrap items-center", {
        "pointer-events-none opacity-50": disabled,
      })}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex w-full items-center justify-between text-sm"
          >
            {children} <ChevronDown className="ml-2 opacity-50" size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
          <Command>
            <CommandInput placeholder="Filter label..." autoFocus={true} />
            <CommandList>
              <CommandEmpty>No value found.</CommandEmpty>
              <CommandGroup>
                {options.map(({ value, label, disabled }) => {
                  const selected = selectedOptionsValues?.includes(value);
                  return (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={(value) => {
                        onCheckedChange(value);
                      }}
                      disabled={disabled || (disableSelected && selected)}
                      className="flex flex-row justify-between"
                    >
                      {label}

                      {selected && <Check size={14} />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
      {showSelected && (
        <div className="mt-2 flex flex-row flex-wrap gap-1">
          {selectedOptionsValues?.map((value) => (
            <Badge
              key={value}
              variant={"secondary"}
              className="h-8 cursor-pointer text-sm hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onBadgeClick(value)}
            >
              {mappedOptions[value]}
              <X size={14} className="ml-2" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
