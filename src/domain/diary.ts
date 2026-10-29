import { sum, serving } from './nutrition';
import { shiftDate } from './dates';
import type { Entry, Nutrition } from './types';

/** Aggregate the same scaled entries used by meal subtotals, charts and the summary. */
export function dayTotal(entries: Entry[], date: string): Nutrition {
  return sum(entries.filter((entry) => entry.date === date).map((entry) => serving(entry.food, entry.grams)));
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
