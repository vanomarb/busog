import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import photos from '../src/data/photos.json';
import { foods, recipes, recipeFood, foodById, recipeById } from '../src/data/catalog';
import { byRegion, foodName, mealName } from '../src/domain/names';
import { bmr, tdee, target, macroTargets } from '../src/domain/goals';
import { recipeTotal, serving, sum, toGrams } from '../src/domain/nutrition';
import { today, shiftDate } from '../src/domain/dates';
import { generateDemo } from '../src/lib/mock';
import { average, percentageChange } from '../src/domain/diary';
import { EATING_WINDOW, timeAngle } from '../src/domain/timing';

const male = { age: 30, sex: 'male' as const, weight: 70, height: 175, activity: 1.55, goal: 'maintain' as const };
assert.equal(bmr(male), 1648.75);
assert.equal(tdee(male), 2555.5625);
assert.equal(target(male), 2560);
assert.equal(bmr({ ...male, sex: 'female' }), 1482.75);
assert.equal(target({ ...male, goal: 'lose' }), 2310);
assert.equal(toGrams(1, 'lb'), 453.59237);
assert.equal(toGrams(2, 'oz'), 56.69904625);
assert.throws(() => serving(foodById('rice'), -1), RangeError);
assert.throws(() => bmr({ ...male, age: 10 }), RangeError);
assert.throws(() => macroTargets(2000, 80, 50), RangeError);
assert.deepEqual(macroTargets(2000, 25, 45), { protein: 125, carbs: 225, fat: (2000 * 0.3) / 9 });
assert.equal(foodById('rice').nutrition.kcal, 130);
assert.equal(serving(foodById('rice'), 158).kcal, 205.4);
assert.equal(serving(foodById('rice'), 0).kcal, 0);
assert.equal(foods.length, 110);
assert.equal(new Set(foods.map((food) => food.fdcId)).size, foods.length);
assert.equal(new Set(foods.map((food) => food.id)).size, foods.length);
assert.ok(foods.every((food) => food.portions.length > 0));
assert.equal(foodName(foodById('rice'), 'ph'), 'Kanin (white rice) · cooked');
assert.equal(foodName(foodById('rice'), 'intl'), 'White rice · cooked');
assert.equal(foodName(foodById('kangkong'), 'ph'), 'Kangkong (water spinach) · boiled');
assert.equal(foodName(foodById('tilapia'), 'ph'), 'Tilapia · cooked');
const adobo = recipeFood(recipeById('adobong-manok'));
assert.equal(foodName(adobo, 'ph'), 'Adobong manok');
assert.equal(foodName(adobo, 'intl'), 'Chicken adobo');
assert.equal(mealName('Merienda', 'intl'), 'Snack');
assert.equal(byRegion(recipes, 'intl')[0].cuisine, 'international');
assert.ok(recipes.every((recipe) => recipe.image in photos));
assert.ok(
  Object.values(photos).every((photo) => photo.source.startsWith('https://commons.wikimedia.org/') && photo.license),
);
for (const image of Object.keys(photos)) {
  for (const width of [480, 960]) assert.ok(existsSync(`public/images/${image}-${width}.webp`), `${image}-${width}`);
}
for (const recipe of recipes) {
  const total = recipeTotal(recipe.ingredients, foods);
  const normalized = recipeFood(recipe);
  const one = serving(normalized, normalized.portions[0].grams);
  assert.ok(Math.abs(one.kcal * recipe.servings - total.kcal) < 1e-8);
  assert.ok(Object.values(total).every((value) => Number.isFinite(value) && value >= 0));
}
assert.throws(() => recipeTotal([{ foodId: 'missing', grams: 100 }], foods));
assert.equal(today(new Date('2026-10-28T16:01:00Z')), '2026-10-29');
assert.equal(shiftDate('2024-03-01', -1), '2024-02-29');
const data = generateDemo('2026-10-29');
assert.deepEqual(data, generateDemo('2026-10-29'));
assert.equal(data.entries.filter((entry) => entry.date === '2026-10-29').length, 6);
const abroad = generateDemo('2026-10-29', 'intl');
assert.deepEqual(abroad, generateDemo('2026-10-29', 'intl'));
assert.equal(abroad.profile.region, 'intl');
assert.equal(abroad.entries.filter((entry) => entry.date === '2026-10-29').length, 4);
assert.ok(sum(data.entries.map((entry) => serving(entry.food, entry.grams))).kcal > 0);
process.stdout.write(
  'Domain passed: source integrity, all recipes, serving math, targets and deterministic Manila history.\n',
);

const recent = average(data.entries, '2026-10-28', 7);
const previous = average(data.entries, '2026-10-21', 7);
assert.ok(recent.kcal < previous.kcal);
assert.ok(recent.protein > previous.protein);
assert.equal(percentageChange(96, 100), '−4%');
assert.equal(percentageChange(106, 100), '+6%');
assert.equal(percentageChange(100, 100), '0%');
assert.equal(percentageChange(100, 0), undefined);
assert.equal(percentageChange(100, Number.NaN), undefined);
assert.equal(percentageChange(100, average([], '2026-10-21', 7).kcal), undefined);
assert.equal(EATING_WINDOW.end - EATING_WINDOW.start, 14 * 60);
assert.equal(timeAngle('07:00'), 105);
assert.equal(timeAngle('07:30'), 112.5);
assert.equal(timeAngle('21:00'), 315);
process.stdout.write(
  `Weekly comparisons: ${percentageChange(recent.kcal, previous.kcal)} kcal, ` +
    `${percentageChange(recent.protein, previous.protein)} protein; eating window remains 07:00–21:00.\n`,
);
