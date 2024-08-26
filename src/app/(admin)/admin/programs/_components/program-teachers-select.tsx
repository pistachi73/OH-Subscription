"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { useParams } from "next/navigation";

import {
  AdminMultipleSelect,
  type Option,
} from "@/components/ui/admin/admin-multiple-select";
import { isNumber } from "@/lib/utils/is-number";
import { api } from "@/trpc/react";

type ProgramTeacherSelectProps = {
  teacherOptions: Option[];
  initialTeachers?: string;
};

export const ProgramTeacherSelect = ({
  teacherOptions,
  initialTeachers = "",
}: ProgramTeacherSelectProps) => {
  const { programId } = useParams<{ programId: string }>();
  const [teachers, setTeachers] = useState(initialTeachers);

  const { mutateAsync: addTeacher } = api.program.addTeacher.useMutation();
  const { mutateAsync: removeTeacher } =
    api.program.removeTeacher.useMutation();

  const [isSelecting, startTransition] = useTransition();

  const handleAddTeacher = (teacherId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    startTransition(async () => {
      await addTeacher({
        programId: Number(programId),
        teacherId: Number(teacherId),
      });
    });
  };

  const handleRemoveTeacher = (teacherId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    startTransition(async () => {
      await removeTeacher({
        programId: Number(programId),
        teacherId: Number(teacherId),
      });
    });
  };

  return (
    <AdminMultipleSelect
      value={teachers}
      onChange={setTeachers}
      options={teacherOptions}
      onSelect={handleAddTeacher}
      onDeselect={handleRemoveTeacher}
      disabled={isSelecting}
    >
      Select teachers
    </AdminMultipleSelect>
  );
};
