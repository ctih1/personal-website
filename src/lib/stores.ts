import { writable } from "svelte/store";
import type { Writable } from "svelte/store"

export interface ManagedWindow {
    title: string
    closed: boolean,
    hidden: boolean,
    icon: URL,
}

export const currentWindowId: Writable<number> = writable(0);
export const windows: Writable<Map<Number, ManagedWindow>> = writable(new Map());