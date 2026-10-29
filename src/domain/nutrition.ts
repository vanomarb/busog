import type { Food, Ingredient, Nutrition } from './types';

/** Reject invalid quantities before they can poison a diary's aggregate values. */
export function quantity(value: number): number {
  if (!Number.isFinite(value) || value < 0) throw new RangeError('Use a finite, nonnegative quantity.');
  return value;
}
/** Scale a canonical 100g record; preserve precision until display. */
export function serving(food: Pick<Food, 'nutrition'>, grams: number): Nutrition {
  const factor = quantity(grams) / 100;
  return {
    kcal: food.nutrition.kcal * factor,
    protein: food.nutrition.protein * factor,
    carbs: food.nutrition.carbs * factor,
    fat: food.nutrition.fat * factor,
  };
}
/** Add nutrients without substituting macro energy for USDA's published energy field. */
export function sum(values: Nutrition[]): Nutrition {
  return values.reduce(
    (total, item) => ({
      kcal: total.kcal + item.kcal,
      protein: total.protein + item.protein,
      carbs: total.carbs + item.carbs,
      fat: total.fat + item.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}
/** Ingredient recipes derive all nutrients from the snapshot, and fail on an unknown ingredient. */
export function recipeTotal(ingredients: Ingredient[], foods: Food[]): Nutrition {
  return sum(
    ingredients.map((ingredient) => {
      const food = foods.find((item) => item.id === ingredient.foodId);
      if (!food) throw new Error(`Missing ingredient ${ingredient.foodId}`);
      return serving(food, ingredient.grams);
    }),
  );
}
/** Weight conversion is exact to the international pound, independent of display rounding. */
export function toGrams(value: number, unit: 'g' | 'oz' | 'kg' | 'lb'): number {
  const factors = { g: 1, oz: 28.349523125, kg: 1000, lb: 453.59237 };
  return quantity(value) * factors[unit];
}
/** Round only at the presentation boundary. */
export function number(value: number, digits = 0): string {
  return value.toLocaleString('en-PH', { maximumFractionDigits: digits });
}
