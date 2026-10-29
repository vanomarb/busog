import type { Food, Meal, Recipe, Region } from './types';

/**
 * One food, two audiences. In the Philippines region a USDA food with a Filipino name reads
 * "Kanin (white rice) · cooked"; internationally it reads "White rice · cooked". Dishes show their own name.
 */
export function foodName(food: Food, region: Region): string {
  if (!food.local || region === 'intl') return food.name;
  if (food.source === 'recipe') return food.local;
  const [base, ...preparation] = food.name.split(' · ');
  const english = base.charAt(0).toLowerCase() + base.slice(1);
  const name = english.toLowerCase() === food.local.toLowerCase() ? food.local : `${food.local} (${english})`;
  return [name, ...preparation].join(' · ');
}

/** A Filipino dish keeps its own name in the Philippines and leads with English elsewhere. */
export function recipeName(recipe: Recipe, region: Region): string {
  return region === 'intl' && recipe.english ? recipe.english : recipe.name;
}

/** The other-language name, shown under the title so neither audience loses the original. */
export function recipeSubtitle(recipe: Recipe, region: Region): string | undefined {
  if (!recipe.english) return undefined;
  return region === 'intl' ? recipe.name : recipe.english;
}

/** The day's meal slots, in order. */
export const MEALS: Meal[] = ['Breakfast', 'Lunch', 'Merienda', 'Dinner'];

/** Merienda is the Filipino afternoon meal; elsewhere the same slot is simply a snack. */
export function mealName(meal: Meal, region: Region): string {
  return meal === 'Merienda' && region === 'intl' ? 'Snack' : meal;
}

/** The cuisine a region treats as its own. */
export function homeCuisine(region: Region): Recipe['cuisine'] {
  return region === 'ph' ? 'filipino' : 'international';
}

/** Recipes of the region's own cuisine come first, so suggestions feel local without hiding the others. */
export function byRegion(recipes: Recipe[], region: Region): Recipe[] {
  const home = homeCuisine(region);
  return [...recipes].sort((a, b) => Number(b.cuisine === home) - Number(a.cuisine === home));
}

/** Search text covers both names, so "kanin" and "rice" find the same food in either region. */
export function searchText(food: Food): string {
  return `${food.name} ${food.local ?? ''} ${food.description}`.toLowerCase();
}
