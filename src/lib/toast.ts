import { writable } from 'svelte/store';

/** The app's one status message. It floats above the tab bar and clears itself. */
export const toast = writable('');
let timer: ReturnType<typeof setTimeout> | undefined;

export function showToast(text: string) {
  toast.set(text);
  clearTimeout(timer);
  timer = setTimeout(() => toast.set(''), 4000);
}
