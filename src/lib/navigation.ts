import { writable } from 'svelte/store';
import type { Food, Source } from '../domain/types';

export type Screen = 'today' | 'progress' | 'foods' | 'profile' | 'onboarding';
export interface Layer {
  kind: 'log' | 'detail' | 'serving' | 'turo' | 'snap' | 'search' | 'weight' | 'notice';
  food?: Food;
  source?: Source;
  grams?: number;
  entryId?: string;
}
export interface Route {
  screen: Screen;
  layers: Layer[];
}
/** History stores only serializable app routes and preserves unrelated router state. */
export function createNavigation() {
  let current: Route = { screen: 'today', layers: [] };
  const state = writable<Route>(current);
  const commit = (next: Route, replace = false) => {
    current = next;
    const merged = { ...history.state, busog: next };
    if (replace) history.replaceState(merged, '');
    else history.pushState(merged, '');
    state.set(next);
  };
  return {
    subscribe: state.subscribe,
    start() {
      commit(current, true);
      const listener = (event: PopStateEvent) => {
        const saved = event.state?.busog as Route | undefined;
        const next = saved && Array.isArray(saved.layers) ? saved : { screen: 'today' as const, layers: [] };
        if (next.layers.length < current.layers.length) {
          next.layers = next.layers.map((layer, i) =>
            current.layers[i]?.kind === layer.kind
              ? { ...layer, grams: current.layers[i].grams ?? layer.grams }
              : layer,
          );
        }
        current = next;
        history.replaceState({ ...history.state, busog: current }, '');
        state.set(current);
      };
      window.addEventListener('popstate', listener);
      return () => window.removeEventListener('popstate', listener);
    },
    screen(screen: Screen) {
      commit({ screen, layers: [] });
    },
    open(layer: Layer) {
      commit({ ...current, layers: [...current.layers, layer] });
    },
    close() {
      if (current.layers.length || current.screen !== 'today') history.back();
    },
    clear() {
      if (current.layers.length) history.go(-current.layers.length);
    },
    updateLayer(index: number, patch: Partial<Layer>) {
      commit(
        { ...current, layers: current.layers.map((layer, i) => (i === index ? { ...layer, ...patch } : layer)) },
        true,
      );
    },
  };
}
export type Navigation = ReturnType<typeof createNavigation>;
