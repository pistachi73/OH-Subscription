import clsx from "clsx";
import { CheckCheckIcon, LinkIcon, Mail, MailIcon } from "lucide-react";
import { useState } from "react";

import Link from "next/link";

import { Button, type ButtonProps } from "../button";

import { ShareItemIcons } from "./share-icons";

type ShareItemSharedProps = { url: string };

const ShareItem = ({
  className,
  label,
  children,
  ...buttonProps
}: {
  className?: string;
  label?: string;
  children?: React.ReactNode;
} & ButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="secondary"
        size="icon"
        className={clsx(
          "h-16 w-16 rounded-full border border-accent bg-accent/30",
          className,
        )}
        {...buttonProps}
      >
        {children}
      </Button>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export const LinkedinButton = ({ url }: ShareItemSharedProps) => {
  return (
    <ShareItem
      label="Linkedin"
      className="border-[#0077b5] bg-[#0077b5]/90 hover:bg-[#0077b5]"
      onClick={() => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
          "Popup",
          "location,status,scrollbars,resizable,width=600, height=400",
        );
      }}
    >
      <>{ShareItemIcons.linkedin}</>
    </ShareItem>
  );
};

export const FacebookButton = ({ url }: ShareItemSharedProps) => {
  return (
    <ShareItem
      label="Facebook"
      className="border-pr border-[#1877f2] bg-[#1877f2]/90 hover:bg-[#1877f2]"
      onClick={() => {
        window.open(
          `https://www.facebook.com/sharer.php?u=${url}`,
          "Popup",
          "location,status,scrollbars,resizable,width=600, height=400",
        );
      }}
    >
      {ShareItemIcons.facebook}
    </ShareItem>
  );
};

export const TwitterButton = ({
  url,
  title,
  hashtags,
}: { title: string; hashtags: string } & ShareItemSharedProps) => {
  let params = title ? `&text=${encodeURIComponent(title)}` : "";
  if (hashtags)
    params += `${title ? "&" : ""}hashtags=${encodeURIComponent(hashtags)}`;

  return (
    <ShareItem
      label="Twitter"
      className="border-[#1da1f2] bg-[#1da1f2]/90 hover:bg-[#1da1f2]"
      onClick={() => {
        window.open(
          `https://twitter.com/intent/tweet?url=${url}${params}`,
          "Popup",
          "location,status,scrollbars,resizable,width=600, height=400",
        );
      }}
    >
      {ShareItemIcons.twitter}
    </ShareItem>
  );
};

export const EmailButton = ({
  url,
  email,
  subject,
  body,
}: { email: string; subject: string; body: string } & ShareItemSharedProps) => {
  let params = subject || body ? "?" : "";
  if (subject) params += `subject=${encodeURIComponent(subject)}`;
  if (body)
    params += `${subject ? "&" : ""}body=${encodeURIComponent(
      url + "\n\n" + body,
    )}`;

  return (
    <ShareItem label="Mail" asChild>
      <Link href={`mailto:${email}${params}`}>
        <MailIcon size={22} />
      </Link>
    </ShareItem>
  );
};

export const LinkButton = ({ url }: ShareItemSharedProps) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const onLinkCopy = () => {
    setIsLinkCopied(true);
    navigator.clipboard.writeText(url);

    setTimeout(() => {
      setIsLinkCopied(false);
    }, 5000);
  };
  return (
    <ShareItem
      label={isLinkCopied ? "Copied!" : "Copy link"}
      className={clsx({
        "border-accent bg-accent/30": !isLinkCopied,
        "border-green-600 bg-green-600/30 hover:bg-green-600/30": isLinkCopied,
      })}
      onClick={onLinkCopy}
    >
      {isLinkCopied ? (
        <CheckCheckIcon size={22} className="text-green-600" />
      ) : (
        <LinkIcon size={22} />
      )}
    </ShareItem>
  );
};
