<script lang="ts">
  import { untrack } from 'svelte';
  import { target } from '../../domain/goals';
  import type { Profile } from '../../domain/types';
  /** Adult profile inputs share one validation path between onboarding and later goal edits. */
  let {
    profile,
    onsave,
    label = 'Save goals',
  }: { profile: Profile; onsave: (profile: Profile) => void; label?: string } = $props();
  let draft = $state(untrack(() => ({ ...profile })));
  let error = $state('');
  const suggested = $derived.by(() => {
    try {
      return target(draft);
    } catch {
      return 0;
    }
  });
  function save() {
    if (
      !draft.name.trim() ||
      !Number.isFinite(draft.kcal) ||
      draft.kcal < 1000 ||
      draft.kcal > 6000 ||
      draft.proteinPercent < 10 ||
      draft.carbsPercent < 10 ||
      draft.proteinPercent + draft.carbsPercent > 90
    ) {
      error = 'Use a target from 1,000–6,000 kcal and a macro split that leaves at least 10% for fat.';
      return;
    }
    onsave({ ...draft, name: draft.name.trim(), apiKey: profile.apiKey, units: profile.units });
    error = '';
  }
</script>

<form
  class="profile-form"
  onsubmit={(event) => {
    event.preventDefault();
    save();
  }}
>
  <label>First name<input required maxlength="30" bind:value={draft.name} autocomplete="given-name" /></label>
  <div class="profile-fields">
    <label>Age<input required type="number" min="18" max="90" bind:value={draft.age} /></label><label
      >Sex<select bind:value={draft.sex}
        ><option value="female">Female</option><option value="male">Male</option></select
      ></label
    >
  </div>
  <p class="source-line">
    Used only by the Mifflin–St Jeor formula, which has different constants for female and male bodies.
  </p>
  <div class="profile-fields">
    <label>Weight · kg<input required type="number" min="25" max="350" step="0.1" bind:value={draft.weight} /></label
    ><label>Height · cm<input required type="number" min="120" max="230" bind:value={draft.height} /></label>
  </div>
  <label
    >Activity assumption<select bind:value={draft.activity}
      ><option value={1.2}>Mostly seated · 1.2</option><option value={1.375}>Lightly active · 1.375</option><option
        value={1.55}>Moderately active · 1.55</option
      ><option value={1.725}>Very active · 1.725</option><option value={1.9}>Highly active · 1.9</option></select
    ></label
  >
  <label
    >Direction<select bind:value={draft.goal}
      ><option value="maintain">Maintain</option><option value="lose">A small deficit</option><option value="gain"
        >A small surplus</option
      ></select
    ></label
  >
  <div class="suggested-target">
    <p class="mono">Calculated starting point</p>
    <strong>{suggested || '—'} kcal</strong><button
      type="button"
      class="button"
      onclick={() => (draft.kcal = suggested)}
      disabled={!suggested}>Use suggested target</button
    >
  </div>
  <label>Your daily target · kcal<input type="number" min="1000" max="6000" required bind:value={draft.kcal} /></label>
  <div class="profile-fields">
    <label>Protein · %<input type="number" min="10" max="60" required bind:value={draft.proteinPercent} /></label><label
      >Carbs · %<input type="number" min="10" max="70" required bind:value={draft.carbsPercent} /></label
    >
  </div>
  <p class="source-line">
    Fat: {100 - draft.proteinPercent - draft.carbsPercent}%. Percentages describe energy share. An estimate to start
    from, not a medical plan.
  </p>
  {#if error}<p role="alert" class="status-note">{error}</p>{/if}
  <button class="button accent" type="submit">{label}</button>
</form>

<style>
  .profile-form {
    display: grid;
    gap: 22px;
  }
  .profile-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .suggested-target {
    padding: 24px;
    border-radius: 24px;
    background: var(--raised-2);
    color: var(--ink);
    display: grid;
    gap: 15px;
  }
  .suggested-target strong {
    font: 500 var(--text-2xl) var(--mono);
  }
  .suggested-target p {
    font-size: var(--text-xs);
  }
  .suggested-target .button {
    background: var(--accent);
    color: var(--on-accent);
    justify-self: start;
    font-size: var(--text-sm);
  }
</style>
