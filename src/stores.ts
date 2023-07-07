import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { IPost } from './interfaces';

export let weeklyPost: Writable<IPost | undefined | null> = writable(undefined);
export let loadedPosts: Writable<IPost[]> = writable([]);
export let myId: Writable<number | undefined> = writable(undefined);