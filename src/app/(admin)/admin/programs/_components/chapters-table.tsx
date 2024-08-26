"use client";

import { Save, Trash } from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useTransition,
} from "react";
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
import type { SelectVideo } from "@/server/db/schema";
import { api } from "@/trpc/react";
import type { ChapterDetails } from "./edit-program";

export const ChapterTableRow = ({
  chapter,
  setChapters,
  handleChapterRemove,
  chapterId,
  initialChapterNumber,
  initialIsFree,
}: {
  chapter: SelectVideo;
  chapterId: number;
  setChapters: Dispatch<SetStateAction<string>>;
  handleChapterRemove: (id: number) => void;
  initialIsFree: boolean;
  initialChapterNumber?: number;
}) => {
  const [chapterNumber, setChapterNumber] = useState<number>(
    initialChapterNumber ?? 0,
  );

  const [isFree, setIsFree] = useState(initialIsFree);

  const { programId } = useParams<{ programId: string }>();
  const [isUpdating, startTransition] = useTransition();

  const { mutateAsync: updateChapter } =
    api.program.updateChapter.useMutation();

  const handleUpdateChapter = () => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    startTransition(async () => {
      await updateChapter({
        programId: Number(programId),
        videoId: chapterId,
        chapterNumber,
        isFree,
      });
    });
  };

  const onChapterRemove = (id: number) => {
    startTransition(async () => {
      await handleChapterRemove(id);
    });

    setChapters((prev) => {
      return prev
        .split(",")
        .filter((chapterId) => Number(chapterId) !== id)
        .join(",");
    });
  };

  return (
    <TableRow key={chapter.title} className="w-full">
      <TableCell className="font-medium">{chapter.title}</TableCell>
      <TableCell className="font-medium">{chapter.duration}</TableCell>

      <TableCell className="font-medium">
        <Input
          value={chapterNumber}
          onChange={(e) => setChapterNumber(Number(e.target.value))}
          className="remove-number-arrows h-8 w-16 text-center text-sm"
          type="number"
          min={1}
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
        >
          <Save size={14} />
        </Button>
        <Button
          className="h-8 w-8 text-sm"
          onClick={() => onChapterRemove(chapter.id)}
          size={"icon"}
          variant="destructive"
          disabled={isUpdating}
        >
          <Trash size={14} />
        </Button>
      </TableCell>
    </TableRow>
  );
};

type ChaptersTableProps = {
  videoOptions?: Option[];
  videos?: SelectVideo[];
  initialChapters?: string;
  chapterDetails?: ChapterDetails;
};

export const ChaptersTable = ({
  videoOptions,
  videos,
  initialChapters,
  chapterDetails,
}: ChaptersTableProps) => {
  const { programId } = useParams<{ programId: string }>();

  const mappedChapters: Record<number, SelectVideo> | undefined =
    videos?.reduce((prev, curr) => {
      return Object.assign(prev, { [curr.id]: curr });
    }, {});

  const [chapters, setChapters] = useState<string>(initialChapters ?? "");

  const { mutateAsync: addChapter } = api.program.addChapter.useMutation();
  const { mutateAsync: removeChapter } =
    api.program.removeChapter.useMutation();

  const [isSelecting, startTransition] = useTransition();

  const handleAddChapter = (videoId: number, chapterNumber: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    startTransition(async () => {
      await addChapter({
        programId: Number(programId),
        videoId: Number(videoId),
        chapterNumber,
      });
    });
  };

  const handleRemoveChapter = (videoId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    startTransition(async () => {
      await removeChapter({
        programId: Number(programId),
        videoId: Number(videoId),
      });
    });
  };

  return (
    <>
      <div className="mb-3 w-1/2">
        <AdminMultipleSelect
          value={chapters}
          onChange={setChapters}
          options={videoOptions || []}
          disableSelected
          disabled={isSelecting}
          onSelect={(val) => handleAddChapter(val, 1)}
          onDeselect={handleRemoveChapter}
          showSelected={false}
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
                  handleChapterRemove={handleRemoveChapter}
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
