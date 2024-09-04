"use client";

import { Save, Trash } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { toast } from "sonner";

import { useParams } from "next/navigation";

import {
  AdminMultipleSelect,
  type Option,
} from "@/components/ui/admin/admin-multiple-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isNumber } from "@/lib/utils/is-number";
import { api } from "@/trpc/react";

import { cn } from "@/lib/utils/cn";
import type { Video } from "@/types";
import type { ChapterDetails } from "./edit-program";

export const ChapterTableRow = ({
  chapter,
  setChapters,
  chapterId,
  initialChapterNumber,
  initialIsFree,
}: {
  chapter: Video;
  chapterId: number;
  setChapters: Dispatch<SetStateAction<string>>;
  initialIsFree: boolean;
  initialChapterNumber?: number;
}) => {
  const [isFree, setIsFree] = useState(initialIsFree);
  const [chapterNumber, setChapterNumber] = useState<number>(
    initialChapterNumber ?? 1,
  );

  const { programId } = useParams<{ programId: string }>();

  const { mutateAsync: setChapter, isLoading: isUpdating } =
    api.program._setChapter.useMutation({});
  const { mutateAsync: removeChapter, isLoading: isDeleting } =
    api.program._removeChapter.useMutation();

  const handleUpdateChapter = () => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    setChapter({
      programId: Number(programId),
      videoId: chapterId,
      chapterNumber,
      isFree,
    });
  };

  const handleRemoveChapter = async (videoId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    await removeChapter({
      programId: Number(programId),
      videoId: Number(videoId),
    });

    setChapters((prev) => {
      return prev
        .split(",")
        .filter((chapterId) => Number(chapterId) !== videoId)
        .join(",");
    });
  };

  return (
    <TableRow
      key={chapter.title}
      className={cn(
        "w-full",
        isUpdating || isDeleting ? "pointer-events-none opacity-50" : "",
      )}
    >
      <TableCell className="font-medium">{chapter.title}</TableCell>
      <TableCell className="font-medium">{chapter.duration}</TableCell>

      <TableCell className="font-medium">
        <Input
          value={chapterNumber}
          onChange={(e) => setChapterNumber(Number(e.target.value))}
          className="remove-number-arrows h-8 w-16 text-center text-sm"
          type="number"
          min="1"
          disabled={isUpdating}
        />
      </TableCell>
      <TableCell className="font-medium">
        <Switch
          checked={isFree}
          onCheckedChange={setIsFree}
          disabled={isUpdating}
        />
      </TableCell>

      <TableCell className="flex items-end justify-end gap-2">
        <Button
          className="h-8 w-8 text-sm"
          onClick={handleUpdateChapter}
          size={"icon"}
          variant="outline"
          disabled={isUpdating}
          type="button"
        >
          <Save size={14} />
        </Button>
        <Button
          className="h-8 w-8 text-sm"
          onClick={() => handleRemoveChapter(chapter.id)}
          size={"icon"}
          variant="destructive"
          disabled={isUpdating}
          type="button"
        >
          <Trash size={14} />
        </Button>
      </TableCell>
    </TableRow>
  );
};

type ChapterSelectProps = {
  videoOptions?: Option[];
  videos?: Video[];
  initialChapters?: string;
  initialChapterDetails?: ChapterDetails;
};

export const ChapterSelect = ({
  videoOptions,
  videos,
  initialChapters,
  initialChapterDetails,
}: ChapterSelectProps) => {
  const { programId } = useParams<{ programId: string }>();
  const mappedChapters: Record<number, Video> | undefined = videos?.reduce(
    (prev, curr) => {
      return Object.assign(prev, { [curr.id]: curr });
    },
    {},
  );

  const [chapters, setChapters] = useState<string>(initialChapters ?? "");
  const [chapterDetails, setChapterDetails] = useState<ChapterDetails>(
    initialChapterDetails ?? {},
  );

  const { mutate: setChapter } = api.program._setChapter.useMutation({
    onError: () => {
      setChapters((prev) => {
        return prev.split(",").splice(-1).join(",");
      });
    },
  });

  const handleAddChapter = (videoId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    const chapterNumber = chapters.split(",").length + 1;

    setChapter({
      programId: Number(programId),
      videoId: Number(videoId),
      chapterNumber,
    });

    setChapterDetails((prev) => ({
      ...prev,
      [videoId]: {
        isFree: false,
        chapterNumber,
      },
    }));
  };

  return (
    <>
      <div className="mb-3 w-1/2">
        <AdminMultipleSelect
          value={chapters}
          onChange={setChapters}
          options={videoOptions || []}
          disableSelected
          onSelect={(val) => handleAddChapter(val)}
          showSelected={false}
          hideSelectedInDropdown
        >
          Select chapters
        </AdminMultipleSelect>
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Chapter number</TableHead>
            <TableHead>Is free</TableHead>

            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {chapters.split(",").filter(Boolean).length > 0 ? (
            chapters.split(",").map((chapterId) => {
              const chapter = mappedChapters?.[Number(chapterId)];
              if (!chapter) return null;
              return (
                <ChapterTableRow
                  key={chapter.title}
                  chapter={chapter}
                  chapterId={Number(chapterId)}
                  setChapters={setChapters}
                  initialChapterNumber={
                    chapterDetails?.[Number(chapterId)]?.chapterNumber
                  }
                  initialIsFree={
                    chapterDetails?.[Number(chapterId)]?.isFree ?? false
                  }
                />
              );
            })
          ) : (
            <TableRow className="w-full">
              <TableCell className="w-full text-center" colSpan={4}>
                Not chapters added
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
