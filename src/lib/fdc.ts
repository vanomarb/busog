import { request } from './request';
import { foods } from '../data/catalog';
import { searchText } from '../domain/names';
import type { Food } from '../domain/types';

interface FdcResult {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: { nutrientId: number; value: number; unitName: string }[];
}
const cache = new Map<string, { at: number; foods: Food[] }>();
let requests = 0;
let hour = Date.now();
/** Bundled search is immediately available, including Filipino aliases. */
export function localSearch(query: string): Food[] {
  const terms = query.toLowerCase().trim().split(/\s+/);
  return foods.filter((food) => terms.every((term) => searchText(food).includes(term))).slice(0, 30);
}
/** Normalize only complete records, preserving USDA energy rather than estimating it from macros. */
function normalize(result: FdcResult): Food | undefined {
  const get = (id: number) => result.foodNutrients.find((nutrient) => nutrient.nutrientId === id)?.value;
  const kcal = get(1008) ?? get(2048) ?? get(2047);
  const protein = get(1003),
    carbs = get(1005),
    fat = get(1004);
  if ([kcal, protein, carbs, fat].some((value) => value === undefined || !Number.isFinite(value) || value < 0)) {
    return undefined;
  }
  return {
    id: String(result.fdcId),
    fdcId: result.fdcId,
    name: result.description,
    description: result.description,
    category: 'USDA search',
    dataType: result.dataType,
    source: 'usda',
    nutrition: { kcal: kcal!, protein: protein!, carbs: carbs!, fat: fat! },
    portions: [],
    sourceUrl: `https://fdc.nal.usda.gov/food-details/${result.fdcId}/nutrients`,
  };
}
/** Abortable, cached live search quietly falls back to complete local records when offline or rate-limited. */
export async function searchFoods(query: string, key: string, signal: AbortSignal): Promise<Food[]> {
  const local = localSearch(query);
  if (query.trim().length < 3) return local;
  const cacheKey = `${key}:${query.toLowerCase()}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < 3600000) return hit.foods;
  if (Date.now() - hour > 3600000) {
    requests = 0;
    hour = Date.now();
  }
  if (!key && requests >= 20) return local;
  requests++;
  try {
    const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
    url.search = new URLSearchParams({
      api_key: key || 'DEMO_KEY',
      query,
      pageSize: '20',
      dataType: 'Foundation,SR Legacy',
    }).toString();
    const response = await request(url, signal);
    if (!response.ok) return local;
    const body = (await response.json()) as { foods?: FdcResult[] };
    const remote = (body.foods || []).map(normalize).filter((food): food is Food => !!food);
    const result = [...local, ...remote.filter((food) => !local.some((item) => item.fdcId === food.fdcId))];
    cache.set(cacheKey, { at: Date.now(), foods: result });
    return result;
  } catch (error) {
    if (signal.aborted) throw error;
    return local;
  }
}
