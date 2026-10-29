import { writable } from 'svelte/store';
import { shiftDate, today } from '../domain/dates';
import type { DemoData, Entry, Profile, Region } from '../domain/types';
import { generateDemo } from './mock';
import { loadDemo, saveDemo } from './storage';

/** Each app mount owns a single typed store, keeping SSR and previews isolated. */
export function createDemoStore() {
  const data = writable<DemoData>(generateDemo());
  const status = writable({ loaded: false, persistent: true, recovered: false });
  // Serialising the whole diary is the slowest part of a change, so it waits until the screen has updated and
  // repeated changes (typing, toggling) are written once. Leaving the page writes anything still waiting.
  let pending: DemoData | undefined;
  let scheduled = false;
  let listening = false;
  const flush = () => {
    scheduled = false;
    if (!pending) return;
    const persistent = saveDemo(pending);
    pending = undefined;
    status.update((state) => (state.persistent === persistent ? state : { ...state, persistent }));
  };
  const update = (change: (value: DemoData) => DemoData) =>
    data.update((value) => {
      const next = change(value);
      pending = next;
      if (!scheduled) {
        scheduled = true;
        if (typeof requestIdleCallback === 'function') requestIdleCallback(flush, { timeout: 500 });
        else setTimeout(flush, 0);
      }
      return next;
    });
  return {
    subscribe: data.subscribe,
    status,
    flush,
    hydrate() {
      if (!listening && typeof addEventListener === 'function') {
        listening = true;
        addEventListener('pagehide', flush);
        addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush());
      }
      const loaded = loadDemo();
      const delta = Math.round((Date.parse(today()) - Date.parse(loaded.data.anchor)) / 86400000);
      if (delta !== 0) {
        loaded.data.entries = loaded.data.entries.map((entry) => ({ ...entry, date: shiftDate(entry.date, delta) }));
        loaded.data.weights = loaded.data.weights.map((weight) => ({ ...weight, date: shiftDate(weight.date, delta) }));
        loaded.data.water = Object.fromEntries(
          Object.entries(loaded.data.water).map(([date, amount]) => [shiftDate(date, delta), amount]),
        );
        loaded.data.anchor = today();
      }
      data.set(loaded.data);
      status.set({ loaded: true, persistent: loaded.persistent, recovered: loaded.recovered });
    },
    add(entries: Omit<Entry, 'id'>[]) {
      update((value) => ({
        ...value,
        entries: [...value.entries, ...entries.map((entry, index) => ({ ...entry, id: `${Date.now()}-${index}` }))],
      }));
    },
    edit(id: string, grams: number) {
      update((value) => ({
        ...value,
        entries: value.entries.map((entry) => (entry.id === id ? { ...entry, grams } : entry)),
      }));
    },
    remove(id: string) {
      update((value) => ({ ...value, entries: value.entries.filter((entry) => entry.id !== id) }));
    },
    water(date: string, delta: number) {
      update((value) => ({
        ...value,
        water: { ...value.water, [date]: Math.max(0, (value.water[date] || 0) + delta) },
      }));
    },
    profile(profile: Profile) {
      update((value) => ({ ...value, profile, onboarded: true }));
    },
    weight(date: string, kg: number) {
      update((value) => ({
        ...value,
        weights: [...value.weights.filter((weight) => weight.date !== date), { date, kg }].sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      }));
    },
    /** Naming and suggestions follow the region at once; history is regenerated only on reset. */
    region(region: Region) {
      update((value) => ({ ...value, profile: { ...value.profile, region } }));
    },
    reset() {
      update((value) => generateDemo(today(), value.profile.region));
    },
  };
}
export type DemoStore = ReturnType<typeof createDemoStore>;
