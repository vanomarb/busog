import rawFoods from './foods.json';
import rawRecipes from './recipes.json';
import { recipeTotal } from '../domain/nutrition';
import { foodName, searchText } from '../domain/names';
import type { Food, Recipe } from '../domain/types';

export const foods: Food[] = rawFoods as Food[];
export const recipes: Recipe[] = rawRecipes as Recipe[];
/** Recipe foods normalize to ingredient mass; no unmeasured cooked-yield assumptions are introduced. */
export function recipeFood(recipe: Recipe): Food {
  const grams = recipe.ingredients.reduce((total, item) => total + item.grams, 0);
  const total = recipeTotal(recipe.ingredients, foods);
  return {
    id: recipe.id,
    name: recipe.english ?? recipe.name,
    ...(recipe.english ? { local: recipe.name } : {}),
    description: recipe.description,
    category: recipe.category,
    dataType: 'Ingredient composition',
    source: 'recipe',
    sourceUrl: `/busog/recipes/${recipe.id}/`,
    nutrition: {
      kcal: (total.kcal / grams) * 100,
      protein: (total.protein / grams) * 100,
      carbs: (total.carbs / grams) * 100,
      fat: (total.fat / grams) * 100,
    },
    portions: [{ label: '1 serving', grams: grams / recipe.servings }],
  };
}
/** Resolve canonical IDs explicitly so missing snapshot data fails early. */
export function foodById(id: string): Food {
  const food = foods.find((item) => item.id === id);
  if (!food) throw new Error(`Food ${id} is unavailable.`);
  return food;
}
/** Recipes are referenced by ID, never by position, so reordering the data can't change what a screen shows. */
export function recipeById(id: string): Recipe {
  const recipe = recipes.find((item) => item.id === id);
  if (!recipe) throw new Error(`Recipe ${id} is unavailable.`);
  return recipe;
}
/** Every snapshot food has a short, readable, unique ID, so it is the URL slug as-is. */
export function foodSlug(food: Food): string {
  return food.id;
}
/** Category URLs are shared between static generation and breadcrumb links. */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '');
}
/** Library rows for the static site, Philippines naming, optionally limited to one category. */
export function libraryItems(category = '') {
  return foods
    .filter((food) => !category || food.category === category)
    .map((food) => ({
      slug: foodSlug(food),
      name: foodName(food, 'ph'),
      search: searchText(food),
      category: food.category,
      categorySlug: categorySlug(food.category),
      fdcId: food.fdcId,
      kcal: food.nutrition.kcal,
    }));
}
