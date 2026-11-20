import type { BodyProfile } from '../domain/goals';
import { target } from '../domain/goals';

/** Carry only educational calculator inputs into optional onboarding, never personal secrets. */
export function onboardingUrl(profile: BodyProfile): string {
  const values = { ...profile, kcal: target(profile), onboarding: '1' };
  const query = new URLSearchParams(Object.entries(values).map(([key, value]) => [key, String(value)]));
  return `/busog/app/?${query}`;
}
