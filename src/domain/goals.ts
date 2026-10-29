import type { Profile } from './types';

export type BodyProfile = Pick<Profile, 'age' | 'sex' | 'weight' | 'height' | 'activity' | 'goal'>;
/** Mifflin–St Jeor resting energy equation, for an adult educational calculator. */
export function bmr(profile: BodyProfile): number {
  const { weight, height, age, sex } = profile;
  if (![weight, height, age].every(Number.isFinite) || weight <= 0 || height <= 0 || age < 18) {
    throw new RangeError('Enter valid adult measurements.');
  }
  return 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
}
/** Activity multipliers are declared assumptions, not measured expenditure. */
export function tdee(profile: BodyProfile): number {
  if (![1.2, 1.375, 1.55, 1.725, 1.9].includes(profile.activity)) throw new RangeError('Choose an activity.');
  return bmr(profile) * profile.activity;
}
/** Apply a modest illustrative adjustment; return an editable starting point, not a prescription. */
export function target(profile: BodyProfile): number {
  const adjustment = { maintain: 0, lose: -250, gain: 250 }[profile.goal];
  return Math.round((tdee(profile) + adjustment) / 10) * 10;
}
/** Convert an explicitly chosen energy split into gram targets. */
export function macroTargets(kcal: number, proteinPercent: number, carbsPercent: number) {
  if (kcal <= 0 || proteinPercent < 0 || carbsPercent < 0 || proteinPercent + carbsPercent > 100) {
    throw new RangeError('Macro percentages must fit within 100%.');
  }
  return {
    protein: (kcal * proteinPercent) / 100 / 4,
    carbs: (kcal * carbsPercent) / 100 / 4,
    fat: (kcal * (100 - proteinPercent - carbsPercent)) / 100 / 9,
  };
}
