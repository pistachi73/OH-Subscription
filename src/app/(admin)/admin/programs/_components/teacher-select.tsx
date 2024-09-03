"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useParams } from "next/navigation";

import {
  AdminMultipleSelect,
  type Option,
} from "@/components/ui/admin/admin-multiple-select";
import { isNumber } from "@/lib/utils/is-number";
import { api } from "@/trpc/react";

type TeacherSelectProps = {
  teacherOptions: Option[];
  initialTeachers?: string;
};

export const TeacherSelect = ({
  teacherOptions,
  initialTeachers = "",
}: TeacherSelectProps) => {
  const { programId } = useParams<{ programId: string }>();
  const [teachers, setTeachers] = useState(initialTeachers);

  const { mutate: addTeacher } = api.program.addTeacher.useMutation();
  const { mutate: removeTeacher } = api.program.removeTeacher.useMutation();

  const handleAddTeacher = (teacherId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    addTeacher({
      programId: Number(programId),
      teacherId: Number(teacherId),
    });
  };

  const handleRemoveTeacher = (teacherId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    removeTeacher({
      programId: Number(programId),
      teacherId: Number(teacherId),
    });
  };

  return (
    <AdminMultipleSelect
      value={teachers}
      onChange={setTeachers}
      options={teacherOptions}
      onSelect={handleAddTeacher}
      onDeselect={handleRemoveTeacher}
    >
      Select teachers
    </AdminMultipleSelect>
  );
};
