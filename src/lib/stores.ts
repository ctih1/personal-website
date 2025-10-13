import { writable } from "svelte/store";
import type { Writable } from "svelte/store"

export interface ManagedWindow {
    title: string
    closed: boolean,
    hidden: boolean,
    focused: boolean,
    icon?: URL,
}

type WindowId = number;

export const focusId = writable(20);
export const currentWindowId: Writable<number> = writable(0);
export const windows: Writable<Map<WindowId, ManagedWindow>> = writable(new Map());