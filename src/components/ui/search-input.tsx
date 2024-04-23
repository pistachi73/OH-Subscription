"use client";
import { Search } from "lucide-react";

import { useRouter } from "next/navigation";

import { Input, type InputProps } from "@/components/ui/input";

export const SearchInput = (props: InputProps) => {
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    router.push(`/search?q=${value}`);
  };

  return (
    <div className=" relative flex w-full items-center rounded-sm bg-background">
      <Search
        className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 transform text-gray-800"
        size={20}
      />
      <Input
        placeholder="Filter categories..."
        onChange={onChange}
        className="h-12 w-full cursor-pointer border-none bg-transparent px-0 py-0 pl-10 text-sm ease-out focus:!ring-offset-0"
        {...props}
      />
    </div>
  );
};
