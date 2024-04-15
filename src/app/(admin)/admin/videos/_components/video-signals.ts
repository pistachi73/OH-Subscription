import { signal } from "@preact/signals-react";

export const videoIdSignal = signal<number | null>(null);
export const isVideoDeleteModalOpenSignal = signal<boolean>(false);
