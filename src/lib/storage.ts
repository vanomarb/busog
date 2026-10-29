import type { DemoData, Food, Profile } from '../domain/types';
import { today } from '../domain/dates';
import { generateDemo } from './mock';
import { detectRegion } from './region';

const KEY = 'busog-demo-v2';
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const dateKey = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value));

function validFood(value: unknown): value is Food {
  if (!value || typeof value !== 'object') return false;
  const food = value as Partial<Food>;
  return (
    typeof food.id === 'string' &&
    typeof food.name === 'string' &&
    typeof food.description === 'string' &&
    typeof food.sourceUrl === 'string' &&
    ['usda', 'off', 'recipe'].includes(food.source || '') &&
    !!food.nutrition &&
    ['kcal', 'protein', 'carbs', 'fat'].every((key) => {
      const amount = food.nutrition?.[key as keyof Food['nutrition']];
      return finite(amount) && amount >= 0;
    }) &&
    Array.isArray(food.portions) &&
    food.portions.every((portion) => typeof portion.label === 'string' && finite(portion.grams) && portion.grams > 0)
  );
}
function validProfile(value: unknown): value is Profile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<Profile>;
  const ranges = {
    age: [18, 90],
    weight: [25, 350],
    height: [120, 230],
    kcal: [1000, 6000],
    proteinPercent: [10, 60],
    carbsPercent: [10, 70],
  };
  return (
    Object.entries(ranges).every(([key, [min, max]]) => {
      const amount = profile[key as keyof Profile];
      return finite(amount) && amount >= min && amount <= max;
    }) &&
    typeof profile.name === 'string' &&
    profile.name.length <= 30 &&
    ['male', 'female'].includes(profile.sex || '') &&
    ['metric', 'imperial'].includes(profile.units || '') &&
    ['ph', 'intl'].includes(profile.region || '') &&
    ['maintain', 'lose', 'gain'].includes(profile.goal || '') &&
    typeof profile.apiKey === 'string' &&
    [1.2, 1.375, 1.55, 1.725, 1.9].includes(profile.activity || 0) &&
    profile.proteinPercent! + profile.carbsPercent! <= 90
  );
}
function isDemo(value: unknown): value is DemoData {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<DemoData>;
  return (
    data.version === 2 &&
    dateKey(data.anchor) &&
    Array.isArray(data.entries) &&
    Array.isArray(data.weights) &&
    !!data.water &&
    validProfile(data.profile) &&
    typeof data.onboarded === 'boolean' &&
    data.entries.every(
      (entry) =>
        typeof entry.id === 'string' &&
        validFood(entry.food) &&
        dateKey(entry.date) &&
        typeof entry.time === 'string' &&
        /^\d{2}:\d{2}$/.test(entry.time) &&
        ['turo', 'snap', 'usda', 'off'].includes(entry.source) &&
        ['Breakfast', 'Lunch', 'Merienda', 'Dinner'].includes(entry.meal) &&
        finite(entry.grams) &&
        entry.grams > 0 &&
        entry.grams <= 10000,
    ) &&
    Object.entries(data.water).every(([date, amount]) => dateKey(date) && finite(amount) && amount >= 0) &&
    data.weights.every((weight) => dateKey(weight.date) && finite(weight.kg) && weight.kg >= 25 && weight.kg <= 350)
  );
}
const fresh = () => generateDemo(today(), detectRegion());
/** A corrupt or inaccessible store falls back to a complete, usable in-memory demonstration. */
export function loadDemo(): { data: DemoData; persistent: boolean; recovered: boolean } {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return { data: fresh(), persistent: true, recovered: false };
    const data: unknown = JSON.parse(stored);
    if (!isDemo(data)) return { data: fresh(), persistent: true, recovered: true };
    return { data, persistent: true, recovered: false };
  } catch {
    return { data: fresh(), persistent: false, recovered: false };
  }
}
/** All diary writes pass through this one versioned storage boundary. */
export function saveDemo(data: DemoData): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
