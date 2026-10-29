import assert from 'node:assert/strict';
import { get } from 'svelte/store';
import { createDemoStore } from '../src/lib/store';
import { loadDemo } from '../src/lib/storage';
import { createNavigation } from '../src/lib/navigation';
import { dayTotal } from '../src/domain/diary';
import { today } from '../src/domain/dates';
import { foodById } from '../src/data/catalog';
import { generateDemo } from '../src/lib/mock';

const memory = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => memory.get(key) || null,
    setItem: (key: string, value: string) => memory.set(key, value),
  },
});
const store = createDemoStore();
store.hydrate();
const before = dayTotal(get(store).entries, today());
store.add([{ date: today(), time: '12:00', meal: 'Lunch', food: foodById('rice'), grams: 100, source: 'turo' }]);
const added = get(store).entries.at(-1)!;
assert.ok(Math.abs(dayTotal(get(store).entries, today()).kcal - before.kcal - 130) < 1e-8);
store.edit(added.id, 200);
assert.ok(Math.abs(dayTotal(get(store).entries, today()).kcal - before.kcal - 260) < 1e-8);
store.flush();
assert.equal(loadDemo().data.entries.at(-1)?.grams, 200);
store.remove(added.id);
assert.equal(dayTotal(get(store).entries, today()).kcal, before.kcal);
store.water(today(), -100000);
assert.equal(get(store).water[today()], 0);
store.weight(today(), 64);
store.weight(today(), 63);
assert.equal(get(store).weights.filter((item) => item.date === today()).length, 1);
memory.set('busog-demo-v2', JSON.stringify({ version: 99 }));
assert.equal(loadDemo().recovered, true);
const corrupt = generateDemo();
corrupt.profile.proteinPercent = 200;
memory.set('busog-demo-v2', JSON.stringify(corrupt));
assert.equal(loadDemo().recovered, true);
const unknownRegion = generateDemo();
(unknownRegion.profile as { region: string }).region = 'mars';
memory.set('busog-demo-v2', JSON.stringify(unknownRegion));
assert.equal(loadDemo().recovered, true);
memory.delete('busog-demo-v2');
store.hydrate();
store.region('intl');
store.flush();
assert.equal(loadDemo().data.profile.region, 'intl');
store.reset();
assert.equal(get(store).profile.region, 'intl');
assert.ok(get(store).entries.some((entry) => entry.food.id === 'peanut-butter-oatmeal'));
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  get() {
    throw new Error('Blocked storage');
  },
});
assert.equal(loadDemo().persistent, false);
store.add([{ date: today(), time: '12:00', meal: 'Lunch', food: foodById('rice'), grams: 100, source: 'snap' }]);
store.flush();
assert.equal(get(store.status).persistent, false);
assert.ok(get(store).entries.some((entry) => entry.source === 'snap'));
Reflect.deleteProperty(globalThis, 'localStorage');

const events = new EventTarget();
Object.defineProperty(globalThis, 'window', { configurable: true, value: events });
const states: Record<string, unknown>[] = [{ framework: { preserved: true } }];
let cursor = 0;
const historyMock = {
  get state() {
    return states[cursor];
  },
  replaceState(state: Record<string, unknown>) {
    states[cursor] = state;
  },
  pushState(state: Record<string, unknown>) {
    states.splice(++cursor);
    states.push(state);
  },
  go(delta: number) {
    cursor = Math.max(0, Math.min(states.length - 1, cursor + delta));
    const event = new Event('popstate');
    Object.defineProperty(event, 'state', { value: states[cursor] });
    events.dispatchEvent(event);
  },
  back() {
    this.go(-1);
  },
};
Object.defineProperty(globalThis, 'history', { configurable: true, value: historyMock });
const nav = createNavigation();
const stop = nav.start();
nav.open({ kind: 'log' });
nav.open({ kind: 'detail', food: foodById('rice'), grams: 100 });
nav.open({ kind: 'serving', food: foodById('rice'), grams: 100 });
nav.updateLayer(1, { grams: 158 });
nav.close();
assert.equal(get(nav).layers.length, 2);
assert.equal(get(nav).layers[1].grams, 158);
assert.deepEqual(historyMock.state.framework, { preserved: true });
nav.close();
assert.equal(get(nav).layers.length, 1);
nav.open({ kind: 'search' });
nav.clear();
assert.equal(get(nav).layers.length, 0);
nav.screen('progress');
nav.close();
assert.equal(get(nav).screen, 'today');
stop();
Reflect.deleteProperty(globalThis, 'window');
Reflect.deleteProperty(globalThis, 'history');
process.stdout.write('State passed: diary edits, unavailable storage, corrupt data and three nested history layers.\n');
