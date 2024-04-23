import { signal } from "@preact/signals-react";

export const categoryIdSignal = signal<number | null>(null);
export const isCategoryDeleteModalOpenSignal = signal<boolean>(false);
