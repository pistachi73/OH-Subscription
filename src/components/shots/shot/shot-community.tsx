import { Filter, SendHorizonal, X } from "lucide-react";
import { useState } from "react";

import { ShotSideWrapper } from "./shot-side-wrapper";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { AddComment } from "../../ui/comments/add-comment";
import { Comment } from "../../ui/comments/comment";
import { DeviceOnly } from "../../ui/device-only/device-only";
import { useDeviceType } from "../../ui/device-only/device-only-provider";
import { useShotContext } from "./shot-context";

export const ShotCommunity = () => {
  const user = useCurrentUser();
  const { showComments, setShowComments } = useShotContext();
  const { isMobile } = useDeviceType();

  const [sort, setSort] = useState("Sort");

  return (
    <ShotSideWrapper
      isDialogOpen={showComments}
      onDialogOpenChange={(open) => {
        setShowComments(open);
      }}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col",
          "xl:border xl:bg-background xl:border-l-0",
          "sm:rounded-r-xl",
          "overflow-hidden",
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between px-4 py-3",
            isMobile && "pt-0",
          )}
        >
          <h2 className={cn("text-base font-medium md:text-lg")}>
            Discussion (20)
          </h2>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="inline"
                  className="flex items-center gap-2 p-1"
                >
                  <Filter size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={5} align="end" className="w-44">
                <DropdownMenuItem
                  onSelect={() => {
                    setSort("Newest");
                  }}
                >
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setSort("Oldest");
                  }}
                >
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setSort("Most liked");
                  }}
                >
                  Most liked
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeviceOnly allowedDevices={["tablet", "desktop"]}>
              <Button
                variant="ghost"
                size="inline"
                className="p-1"
                onClick={() => setShowComments(false)}
              >
                <X size={20} />
              </Button>
            </DeviceOnly>
          </div>
        </div>
        <div className="flex flex-col justify-end h-full overflow-hidden overflow-y-auto">
          <div className="flex flex-col items-start gap-4 overflow-y-auto p-4">
            <Comment className="p-0 border-transparent" />
            <Comment className="p-0 border-transparent" />
            <Comment className="p-0 border-transparent" />

            <Comment className="p-0 border-transparent" />

            <Comment className="p-0 border-transparent" />

            <Comment className="p-0 border-transparent" />
            <Comment className="p-0 border-transparent" />
            <Comment className="p-0 border-transparent" />
            <Comment className="p-0 border-transparent" />
            <Comment className="p-0 border-transparent" />
          </div>
          <div className="border-t p-4">
            <div className="flex flex-row gap-3">
              <UserAvatar
                className="h-8 w-8"
                userImage={user?.image}
                userName={user?.name}
              />
              <AddComment containerClassName="w-full" className="p-2" />
              <div className="mb-1 flex items-end justify-end">
                <SendHorizonal size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShotSideWrapper>
  );
};
