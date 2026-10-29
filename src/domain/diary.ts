import { sum, serving } from './nutrition';
import { shiftDate } from './dates';
import type { Entry, Nutrition } from './types';

const empty: Nutrition = Object.freeze({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
// Every store write creates a new entries array, so one index per array stays correct and is built once per change.
const indexes = new WeakMap<Entry[], Map<string, Nutrition>>();

/** Daily totals for every logged date, built in one pass over the diary. */
function dailyTotals(entries: Entry[]): Map<string, Nutrition> {
  let totals = indexes.get(entries);
  if (!totals) {
    const byDate = new Map<string, Nutrition[]>();
    for (const entry of entries) {
      const list = byDate.get(entry.date) ?? [];
      list.push(serving(entry.food, entry.grams));
      byDate.set(entry.date, list);
    }
    totals = new Map([...byDate].map(([date, servings]) => [date, sum(servings)]));
    indexes.set(entries, totals);
  }
  return totals;
}
/** Aggregate the same scaled entries used by meal subtotals, charts and the summary. */
export function dayTotal(entries: Entry[], date: string): Nutrition {
  return dailyTotals(entries).get(date) ?? empty;
}
/** Consecutive logged days ending today, capped like the streak display. */
export function streak(entries: Entry[], from: string, limit = 90): number {
  const totals = dailyTotals(entries);
  let count = 0;
  for (let day = from; count < limit && totals.has(day); day = shiftDate(day, -1)) count++;
  return count;
}
/** Calendar weeks reserve future slots rather than presenting future days as recorded intake. */
export function weekDays(date: string): string[] {
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const monday = shiftDate(date, -(weekday === 0 ? 6 : weekday - 1));
  return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index));
}
/** Compute comparison periods from actual source-derived diary totals. */
export function average(entries: Entry[], end: string, count: number): Nutrition {
  const totals = Array.from({ length: count }, (_, index) => dayTotal(entries, shiftDate(end, -index)));
  const total = sum(totals);
  return {
    kcal: total.kcal / count,
    protein: total.protein / count,
    carbs: total.carbs / count,
    fat: total.fat / count,
  };
}

/** A missing or zero baseline cannot support a percentage comparison; use a proper mathematical minus sign. */
export function percentageChange(current: number, previous: number): string | undefined {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return undefined;
  const percent = Math.round(Math.abs((current / previous - 1) * 100) * 10) / 10;
  if (percent === 0) return '0%';
  return `${current < previous ? '−' : '+'}${percent.toLocaleString('en-PH')}%`;
}
