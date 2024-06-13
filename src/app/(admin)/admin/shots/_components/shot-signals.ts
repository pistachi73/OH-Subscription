import { signal } from "@preact/signals-react";

export const shotIdSignal = signal<number | null>(null);
export const isShotDeleteModalOpenSignal = signal<boolean>(false);
