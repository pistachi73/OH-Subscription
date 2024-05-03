"use client";

import Image from "next/image";

import {
  EmailButton,
  FacebookButton,
  LinkButton,
  LinkedinButton,
  TwitterButton,
} from "./share-items";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { cn } from "@/lib/utils";

export type ShareOptions =
  | "link"
  | "email"
  | "linkedin"
  | "facebook"
  | "twitter";

type ShareItemsConfig = {
  twitter?: Omit<React.ComponentProps<typeof TwitterButton>, "url">;
  facebook?: Omit<React.ComponentProps<typeof FacebookButton>, "url"> | boolean;
  linkedin?: Omit<React.ComponentProps<typeof LinkedinButton>, "url"> | boolean;
  email?: Omit<React.ComponentProps<typeof EmailButton>, "url">;
  link?: Omit<React.ComponentProps<typeof LinkButton>, "url"> | boolean;
};

type ShareButtonProps = {
  children: React.ReactNode;
  url: string;
  title: string;
  description?: React.ReactNode;
  videoTitle?: string;
  videoThumbnailUrl?: string;
  asChild?: boolean;
  config: ShareItemsConfig;
};

export const ShareButton = ({
  url,
  children,
  title,
  description,
  videoTitle,
  videoThumbnailUrl,
  asChild = false,
  config,
}: ShareButtonProps) => {
  const hasPreview = videoTitle && videoThumbnailUrl;

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild={asChild}>
        {children}
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <div className={cn("flex flex-col gap-4")}>
          <div className="space-y-1">
            <ResponsiveDialogTitle>
              <h2 className="text-xl font-medium">{title}</h2>
            </ResponsiveDialogTitle>
            {description && (
              <ResponsiveDialogDescription>
                {description}
              </ResponsiveDialogDescription>
            )}
          </div>
          {hasPreview && (
            <div className="flex w-0 min-w-full flex-row items-center justify-start gap-3 rounded-md border border-accent bg-accent/30 p-3">
              <div className="relative aspect-video h-[50px] shrink-0 overflow-hidden rounded-sm">
                <Image src={videoThumbnailUrl} alt="video" fill />
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <p className="truncate font-medium">{videoTitle}</p>
                <p className="truncate text-sm text-muted-foreground">{url}</p>
              </div>
            </div>
          )}

          <div className="mt-2  flex flex-row justify-between gap-2">
            {config?.link && <LinkButton url={url} />}
            {config?.email && <EmailButton url={url} {...config.email} />}
            {config?.linkedin && <LinkedinButton url={url} />}
            {config?.facebook && <FacebookButton url={url} />}
            {config?.twitter && <TwitterButton url={url} {...config.twitter} />}
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
