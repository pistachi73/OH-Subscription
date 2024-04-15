import { signal } from "@preact/signals-react";

export const teacherIdSignal = signal<number | null>(null);
export const isTeacherDeleteModalOpenSignal = signal<boolean>(false);
