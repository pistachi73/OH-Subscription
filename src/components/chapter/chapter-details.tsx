"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareOutlineIcon } from "@/components/ui/icons";
import {
  LikeButton,
  LikeButtonIcon,
  LikeButtonLabel,
} from "@/components/ui/like-button";
import { ShareButton } from "@/components/ui/share-button/share-button";
import { levelMap } from "@/lib/formatters/formatLevel";
import { cn } from "@/lib/utils/cn";
import { getUrl } from "@/lib/utils/get-url";
import { ArrowRightIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useChapterContext } from "./chapter-context";

export const ChapterDetails = () => {
  const { chapter, program, isLikeLoading, isLikedByUser, like } =
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
        <p className="mt-2 text-sm lg:text-base">{chapter.description}</p>
        <div className="mt-4 flex gap-2 w-full">
          <ShareButton
            asChild
            title="Share this chapter"
            description="Share this chpater with your friends and family."
            videoTitle={chapter.title}
            videoThumbnailUrl="/images/hero-thumbnail-2.jpg"
            url={getUrl(`programs/${program.slug}`)}
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
            <Button variant="accent" size="lg" className="w-full text-sm h-10">
              <ShareOutlineIcon className="mr-2 w-5 h-5" />
              Share
            </Button>
          </ShareButton>
          <LikeButton
            variant="accent"
            isLikedByUser={isLikedByUser}
            isLikeLoading={isLikeLoading}
            like={() => like({ videoId: chapter.id })}
            className="w-full"
          >
            <LikeButtonIcon className="mr-2 w-5 h-5" />
            <LikeButtonLabel
              likedLabel="Remove from favorites"
              unlikedLabel="Add to favorites"
            />
          </LikeButton>
        </div>
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
                className="group flex flex-row gap-4 items-start"
              >
                <Avatar className="h-14 w-14 border-2 border-accent">
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
                  <p className="text-muted-foreground text-sm ">
                    Teacher at OH
                  </p>
                  <p className="mt-1 text-sm lg:text-base text-foreground line-clamp-4 text-balance">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    non risus. Suspendisse lectus tortor, dignissim sit amet,
                    adipiscing nec, ultricies sed, dolor. Cras elementum
                    ultrices diam. Maecenas ligula.
                  </p>
                  <span className="mt-2 text-sm lg:text-base text-secondary text-left align-start flex flex-row items-center gap-2">
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
