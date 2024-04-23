"use client";

import "@mux/mux-player/themes/minimal";
import "@mux/mux-player/themes/microvideo";
import { Chapter } from "@/components/chapter/chapter";
type ChapterPageProps = {
  params: {
    chapterId: string;
  };
};

const ChapterPage = ({ params }: ChapterPageProps) => {
  // Get chapter info

  return <Chapter />;
};

export default ChapterPage;
