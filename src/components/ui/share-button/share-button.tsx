"use client";

import Image from "next/image";

import { Button, type ButtonProps } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

import {
  EmailButton,
  FacebookButton,
  LinkButton,
  LinkedinButton,
  TwitterButton,
} from "./share-items";

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

type ShareButtonProps = ButtonProps & {
  children: React.ReactNode;
  url: string;
  title: string;
  description?: React.ReactNode;
  videoTitle?: string;
  videoThumbnailUrl?: string;
  config: ShareItemsConfig;
};

export const ShareButton = ({
  url,
  children,
  title,
  description,
  videoTitle,
  videoThumbnailUrl,
  config,
  ...buttonProps
}: ShareButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...buttonProps}>{children}</Button>
      </DialogTrigger>
      <DialogContent className="gap-4">
        <div className="space-y-1">
          <DialogTitle>
            <h2 className="text-xl font-medium">{title}</h2>
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </div>
        {videoTitle && videoThumbnailUrl && (
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
      </DialogContent>
    </Dialog>
  );
};
