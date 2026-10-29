import { foodById, recipeFood, recipeById } from '../data/catalog';
import { shiftDate, today } from '../domain/dates';
import { target } from '../domain/goals';
import type { DemoData, Entry, Food, Meal, Profile, Region, Source } from '../domain/types';

type Plate = [Meal, string, Food, number, Source];

const dish = (id: string, servings = 1): [Food, number] => {
  const food = recipeFood(recipeById(id));
  return [food, food.portions[0].grams * servings];
};
const PH_DINNERS = ['tinolang-manok', 'pinakbet', 'ginataang-kalabasa', 'gulay-na-may-tokwa', 'pancit-bihon'];
const INTL_LUNCHES = ['chicken-romaine-salad', 'salmon-rice-bowl', 'couscous-lentil-salad', 'tuna-sandwich'];
const INTL_DINNERS = ['spaghetti-bolognese', 'black-bean-tacos', 'shrimp-broccoli-noodles', 'lentil-tomato-soup'];

/** One Filipino day: egg and rice, rice with ulam and greens, a banana merienda, ulam and rice for dinner. */
function philippineDay(seed: number, rice: number, protein: number, past: boolean): Plate[] {
  const [ulam, ulamGrams] = dish(seed % 2 ? 'ginisang-munggo' : 'adobong-manok', seed % 3 === 0 ? 1.5 : 1);
  const plates: Plate[] = [
    ['Breakfast', '07:30', foodById('egg'), 100 * protein, 'usda'],
    ['Breakfast', '07:30', foodById('rice'), 158 * rice, 'usda'],
    ['Lunch', '12:15', foodById('rice'), 158 * rice, 'turo'],
    ['Lunch', '12:15', foodById('kangkong'), 100, 'turo'],
    ['Merienda', '15:30', foodById('banana'), 118, 'snap'],
    ['Lunch', '12:15', ulam, ulamGrams * protein, 'turo'],
  ];
  if (!past) return plates;
  const [dinner, dinnerGrams] = dish(PH_DINNERS[seed % PH_DINNERS.length], 1.5);
  plates.push(['Dinner', '19:00', dinner, dinnerGrams * protein, 'snap']);
  plates.push(['Dinner', '19:00', foodById('rice'), (158 + seed * 12) * rice, 'usda']);
  return plates;
}

/** One international day: oats or yogurt, a lunch bowl, fruit, and a rotating dinner. */
function internationalDay(seed: number, carbs: number, protein: number, past: boolean): Plate[] {
  const [breakfast, breakfastGrams] = dish(seed % 2 ? 'berry-yogurt-bowl' : 'peanut-butter-oatmeal');
  const [lunch, lunchGrams] = dish(INTL_LUNCHES[seed % INTL_LUNCHES.length]);
  const plates: Plate[] = [
    ['Breakfast', '07:30', breakfast, breakfastGrams * carbs, 'usda'],
    ['Breakfast', '07:30', foodById('coffee'), 240, 'usda'],
    ['Lunch', '12:15', lunch, lunchGrams * protein, 'turo'],
    ['Merienda', '15:30', foodById(seed % 2 ? 'apple' : 'banana'), 140, 'snap'],
  ];
  if (!past) return plates;
  const [dinner, dinnerGrams] = dish(INTL_DINNERS[seed % INTL_DINNERS.length]);
  plates.push(['Dinner', '19:00', dinner, dinnerGrams * protein, 'snap']);
  plates.push(['Dinner', '19:00', foodById('broccoli'), 90 * carbs, 'usda']);
  return plates;
}

/** Fictional Mara gets deterministic, source-computed history anchored to the current Manila date. */
export function generateDemo(anchor = today(), region: Region = 'ph'): DemoData {
  const body = { name: 'Mara', age: 29, sex: 'female' as const, weight: 62, height: 160, activity: 1.55 };
  const person = { ...body, goal: 'maintain' as const };
  const profile: Profile = {
    ...person,
    kcal: target(person),
    proteinPercent: 25,
    carbsPercent: 45,
    units: 'metric',
    region,
    apiKey: '',
  };
  const entries: Entry[] = [];
  const water: Record<string, number> = {};
  const weights: DemoData['weights'] = [];
  for (let offset = -89; offset <= 0; offset++) {
    const date = shiftDate(anchor, offset);
    const seed = (offset + 90) % 7;
    // Weeks differ a little, so week-over-week comparisons show realistic movement.
    const week = Math.max(0, Math.floor((-offset - 1) / 7)) % 4;
    const carbs = [0.72, 0.96, 1.04, 0.9][week];
    const protein = [1.09, 1, 1.08, 0.97][week];
    const day = region === 'ph' ? philippineDay : internationalDay;
    day(seed, carbs, protein, offset < 0).forEach(([meal, time, food, grams, source], index) =>
      entries.push({ id: `mock-${offset}-${index}`, date, time, meal, food, grams, source }),
    );
    water[date] = offset === 0 ? 1250 : 1500 + seed * 250;
    if (offset % 3 === 0) weights.push({ date, kg: Math.round((62 + Math.sin(offset / 9) * 0.5) * 10) / 10 });
  }
  return { version: 2, anchor, profile, entries, water, weights, onboarded: false };
}
