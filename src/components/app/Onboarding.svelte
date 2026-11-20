<script lang="ts">
  import { onMount } from 'svelte';
  import type { DemoStore } from '../../lib/store';
  import type { Navigation } from '../../lib/navigation';
  import type { Profile } from '../../domain/types';
  import ProfileForm from './ProfileForm.svelte';
  import FoodCharacter from './FoodCharacter.svelte';
  /** Optional onboarding accepts only validated calculator/quiz answers and preserves existing mock meals. */
  let { store, nav }: { store: DemoStore; nav: Navigation } = $props();
  let initial = $state<Profile | undefined>();
  onMount(() => {
    const params = new URLSearchParams(location.search);
    const profile = { ...$store.profile };
    for (const key of ['age', 'weight', 'height', 'activity', 'kcal'] as const) {
      const value = Number(params.get(key));
      const bounds = { age: [18, 90], weight: [25, 350], height: [120, 230], activity: [1.2, 1.9], kcal: [1000, 6000] };
      if (params.has(key) && Number.isFinite(value) && value >= bounds[key][0] && value <= bounds[key][1])
        profile[key] = value;
    }
    if (['male', 'female'].includes(params.get('sex') || '')) profile.sex = params.get('sex') as Profile['sex'];
    if (['maintain', 'lose', 'gain'].includes(params.get('goal') || ''))
      profile.goal = params.get('goal') as Profile['goal'];
    initial = profile;
  });
</script>

<div class="app-page onboarding-page">
  <header class="onboard-header aqua">
    <div>
      <p class="mono">Make yourself at home.</p>
      <h1>Your plate.<br />Your pace.</h1>
    </div>
    <FoodCharacter kind="banana" size={120} />
  </header>
  <div class="onboard-content">
    <p class="muted">Start with a sample diary, or make the goals your own. No account, email or weigh-in needed.</p>
    {#if initial}<ProfileForm
        profile={initial}
        label="Set my table"
        onsave={(profile) => {
          store.profile(profile);
          nav.screen('today');
        }}
      />{:else}<p role="status">Loading your starting point…</p>{/if}<button
      class="button outline"
      onclick={() => nav.screen('today')}>Skip for now</button
    >
  </div>
</div>

<style>
  .onboarding-page {
    max-width: 900px;
    margin: auto;
  }
  .onboard-header {
    padding: 30px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }
  .onboard-header p {
    font-size: var(--text-xs);
    margin-bottom: 20px;
  }
  .onboard-content {
    max-width: 600px;
    margin: 30px auto;
    display: grid;
    gap: 30px;
  }
  :global([data-device='phone']) .onboard-header {
    margin: -28px -18px 0;
    border-radius: 0 0 32px 32px;
  }
</style>
