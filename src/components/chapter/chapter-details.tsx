"use client";

import { levelMap } from "@/lib/formatters/formatLevel";
import { cn } from "@/lib/utils";
import { getBaseUrl } from "@/trpc/shared";
import { ArrowRightIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import {
  LikeButton,
  LikeButtonIcon,
  LikeButtonLabel,
} from "../programs/components/like-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useDeviceType } from "../ui/device-only/device-only-provider";
import { ShareOutlineIcon } from "../ui/icons";
import { ShareButton } from "../ui/share-button/share-button";
import { useChapterContext } from "./chapter-context";

export const ChapterDetails = () => {
  const { isMobile } = useDeviceType();
  const { chapter, program, isLikeLoading, isLikedByUser, likeChapter } =
    useChapterContext();
  return (
    <>
      <section>
        <h2
          className={cn("text-lg text-foreground font-semibold tracking-tight")}
        >
          C{chapter.chapterNumber}: {chapter.title}
        </h2>
        <section className="mt-2 flex flex-row items-center gap-1 flex-wrap">
          <Badge variant={"secondary"} className="">
            {levelMap[program.level].shortFormat}
          </Badge>
          {program.categories?.map((category) => (
            <Badge
              key={`category-${category.name}`}
              variant="accent"
              className=""
            >
              {category.name}
            </Badge>
          ))}
        </section>
        <p className="mt-2 text-base text-balance">{chapter.description}</p>

        {isMobile && (
          <div className="mt-4 flex gap-2 w-full ">
            <ShareButton
              asChild
              title="Share this chapter"
              description="Share this chpater with your friends and family."
              videoTitle={chapter.title}
              videoThumbnailUrl="/images/hero-thumbnail-2.jpg"
              url={`${getBaseUrl()}/programs/${program.slug}`}
              config={{
                link: true,
                facebook: true,
                twitter: { title: chapter.title, hashtags: "" },
                linkedin: true,
                email: {
                  subject: chapter.title,
                  body: chapter.description,
                },
              }}
            >
              <Button
                variant="accent"
                size="lg"
                className="w-full  text-sm h-10"
              >
                <ShareOutlineIcon className="mr-2 w-5 h-5" />
                Share
              </Button>
            </ShareButton>
            <LikeButton
              variant="accent"
              isLikedByUser={isLikedByUser}
              isLikeLoading={isLikeLoading}
              likeProgram={() => likeChapter({ videoId: chapter.id })}
            >
              <LikeButtonIcon className="mr-2 w-5 h-5" />
              <LikeButtonLabel
                likedLabel="Remove from favorites"
                unlikedLabel="Add to favorites"
              />
            </LikeButton>
          </div>
        )}
      </section>
      {!!program?.teachers?.length && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            About the teachers
          </h2>
          <div className="space-y-4">
            {program.teachers.map((teacher) => (
              <Link
                href={"/"}
                key={`teacher-${teacher.name}`}
                className="group flex flex-row gap-4 items-start border border-input shadow-sm px-4 py-4 rounded-lg"
              >
                <Avatar className="h-20 w-20 border-2 border-accent">
                  <AvatarImage
                    alt="teacher avatar"
                    src={teacher.image ?? "/images/avatar-placeholder.png"}
                  />
                  <AvatarFallback className="bg-accent">
                    <UserIcon className="text-accent-foreground" size={20} />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base text-foreground font-medium">
                    {teacher.name}
                  </p>
                  <p className="mt-0.5 text-muted-foreground text-sm">
                    Teacher at OH{" "}
                  </p>
                  <p className="mt-1 text-base text-foreground line-clamp-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    non risus. Suspendisse lectus tortor, dignissim sit amet,
                    adipiscing nec, ultricies sed, dolor. Cras elementum
                    ultrices diam. Maecenas ligula.
                  </p>
                  <span className="mt-2 text-base text-secondary text-left align-start flex flex-row items-center gap-2">
                    View profile
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
