import { writable } from 'svelte/store';
import type { Region } from '../domain/types';

/** The demo's current region; App keeps it in step with the stored profile so every screen reads one value. */
export const region = writable<Region>('ph');

/** First-visit default: Philippine time zone or a Filipino/Tagalog browser language means the Philippines region. */
export function detectRegion(): Region {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const filipino = navigator.languages.some((language) => /^(fil|tl)(-|$)|-PH$/i.test(language));
    return zone === 'Asia/Manila' || filipino ? 'ph' : 'intl';
  } catch {
    return 'ph';
  }
}
