import { Save, Trash } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";

import {
  AdminMultipleSelect,
  type Option,
} from "@/components/ui/admin/admin-multiple-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type SelectVideo } from "@/server/db/schema";

export const ChapterTableRow = ({
  chapter,
  setChapters,
}: {
  chapter: SelectVideo;
  setChapters: Dispatch<SetStateAction<string>>;
}) => {
  const [chapterNumber, setChapterNumber] = useState<number>();
  const onChapterRemove = (id: number) => {
    setChapters((prev) => {
      return prev
        .split(",")
        .filter((chapterId) => Number(chapterId) !== id)
        .join(",");
    });
  };
  const onChapterSave = (id: number, chapterNumber: number) => {};

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
        />
      </TableCell>

      <TableCell className="flex items-end justify-end gap-2">
        <Button
          className="h-8 w-8 text-sm"
          onClick={() => onChapterSave(chapter.id, 2)}
          size={"icon"}
          variant="outline"
        >
          <Save size={14} />
        </Button>
        <Button
          className="h-8 w-8 text-sm"
          onClick={() => onChapterRemove(chapter.id)}
          size={"icon"}
          variant="destructive"
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
};

export const ChaptersTable = ({ videoOptions, videos }: ChaptersTableProps) => {
  const mappedChapters: Record<number, SelectVideo> | undefined =
    videos?.reduce((prev, curr) => {
      return Object.assign(prev, { [curr.id]: curr });
    }, {});

  const [chapters, setChapters] = useState<string>("");

  const onChapterPush = (id: number) => {};

  return (
    <>
      <div className="mb-3 w-1/2">
        <AdminMultipleSelect
          value={chapters}
          onChange={setChapters}
          options={videoOptions || []}
          disableSelected
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
                  setChapters={setChapters}
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
