/** Normalized per-100g values keep all logging paths on the same arithmetic. */
export interface Nutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}
export type Source = 'turo' | 'snap' | 'usda' | 'off';
/** Region decides naming and suggestions: Filipino names first, or English names and international dishes first. */
export type Region = 'ph' | 'intl';
export interface Food {
  id: string;
  fdcId?: number;
  name: string;
  /** Filipino name, shown first in the Philippines region. */
  local?: string;
  description: string;
  category: string;
  dataType: string;
  nutrition: Nutrition;
  portions: { label: string; grams: number }[];
  source: 'usda' | 'off' | 'recipe';
  sourceUrl: string;
}
export interface Ingredient {
  foodId: string;
  grams: number;
}
export interface Recipe {
  id: string;
  name: string;
  /** English name of a Filipino dish. */
  english?: string;
  description: string;
  category: string;
  cuisine: 'filipino' | 'international';
  /** A photo of this exact dish: public/images/<image>-480.webp and -960.webp, credited in src/data/photos.json. */
  image: string;
  minutes: number;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
}
export type Meal = 'Breakfast' | 'Lunch' | 'Merienda' | 'Dinner';
export interface Entry {
  id: string;
  date: string;
  time: string;
  meal: Meal;
  food: Food;
  grams: number;
  source: Source;
}
export interface Profile {
  name: string;
  age: number;
  sex: 'female' | 'male';
  weight: number;
  height: number;
  activity: number;
  goal: 'maintain' | 'lose' | 'gain';
  kcal: number;
  proteinPercent: number;
  carbsPercent: number;
  units: 'metric' | 'imperial';
  region: Region;
  apiKey: string;
}
export interface DemoData {
  version: 2;
  anchor: string;
  profile: Profile;
  entries: Entry[];
  water: Record<string, number>;
  weights: { date: string; kg: number }[];
  onboarded: boolean;
}
