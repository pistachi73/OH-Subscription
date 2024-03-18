"use client";
import { Search } from "lucide-react";

import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";

export const SearchInput = () => {
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    router.push(`/search?q=${value}`);
  };

  return (
    <div className=" relative flex items-center ">
      <Search
        className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 transform text-gray-800"
        size={20}
      />
      <Input
        placeholder="Filter categories..."
        onChange={onChange}
        className="h-9 w-0 max-w-sm cursor-pointer border-none bg-transparent px-0 py-0 pl-10 text-sm ease-out focus:w-[300px] focus:cursor-text focus:bg-white focus:px-3 focus:py-2 focus:pl-10 focus:transition-all focus:duration-200"
      />
    </div>
  );
};
