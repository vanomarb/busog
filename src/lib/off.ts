import { request } from './request';
import type { Food } from '../domain/types';

interface Product {
  product_name?: string;
  brands?: string;
  nutriments?: Record<string, number>;
  serving_quantity?: number;
}
const products = new Map<string, Food>();
let lastRequest = 0;
/** Explicit OFF lookup enforces spacing below the documented 15 product reads/minute/IP. */
export async function lookupBarcode(barcode: string, signal: AbortSignal): Promise<Food> {
  if (!/^\d{8,14}$/.test(barcode)) throw new Error('Enter the 8–14 digits printed below the barcode.');
  const cached = products.get(barcode);
  if (cached) return cached;
  if (Date.now() - lastRequest < 5000) throw new Error('Give the food database a moment. Try again in five seconds.');
  lastRequest = Date.now();
  const fields = 'product_name,brands,nutriments,serving_quantity';
  const url = `https://world.openfoodfacts.org/api/v3.6/product/${barcode}.json?fields=${fields}`;
  const response = await request(url, signal, { 'User-Agent': 'Busog/1.0 (portfolio concept)' });
  if (response.status === 429) throw new Error('The product database is busy. Try USDA search while it catches up.');
  if (!response.ok) throw new Error('No product found. Check the digits or use food search.');
  const body = (await response.json()) as { product?: Product };
  const product = body.product;
  const nutrients = product?.nutriments;
  const kcal = nutrients?.['energy-kcal_100g'];
  const protein = nutrients?.proteins_100g,
    carbs = nutrients?.carbohydrates_100g,
    fat = nutrients?.fat_100g;
  if (
    !product ||
    [kcal, protein, carbs, fat].some((value) => value === undefined || !Number.isFinite(value) || value < 0)
  ) {
    throw new Error('This product has incomplete nutrition. Use a matching USDA ingredient instead.');
  }
  const food: Food = {
    id: `off-${barcode}`,
    name: product.product_name || `Product ${barcode}`,
    description: product.brands || 'Packaged food',
    category: 'Packaged food',
    dataType: 'Open Food Facts · ODbL',
    nutrition: { kcal: kcal!, protein: protein!, carbs: carbs!, fat: fat! },
    source: 'off',
    portions: product.serving_quantity ? [{ label: '1 labelled serving', grams: product.serving_quantity }] : [],
    sourceUrl: `https://world.openfoodfacts.org/product/${barcode}`,
  };
  products.set(barcode, food);
  return food;
}
