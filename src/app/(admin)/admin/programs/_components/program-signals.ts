import { signal } from "@preact/signals-react";

export const programIdSignal = signal<number | null>(null);
export const isProgramDeleteModalOpenSignal = signal<boolean>(false);
