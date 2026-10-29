<script lang="ts">
  import { macroTargets } from '../../domain/goals';
  import { number } from '../../domain/nutrition';
  import type { Nutrition, Profile } from '../../domain/types';
  /** One compact summary uses the same totals as the diary rather than independent display values. */
  let { total, profile }: { total: Nutrition; profile: Profile } = $props();
  const goals = $derived(macroTargets(profile.kcal, profile.proteinPercent, profile.carbsPercent));
  const macros = ['protein', 'carbs', 'fat'] as const;
</script>

<section class="card summary-card">
  <header>
    <h2>Your plate, today</h2>
    <small class="muted">Mock diary · editable</small>
  </header>
  <div class="calorie-ring">
    <svg viewBox="0 0 180 180" aria-hidden="true"
      ><circle cx="90" cy="90" r="75" fill="none" stroke="var(--line)" stroke-width="10" /><circle
        cx="90"
        cy="90"
        r="75"
        fill="none"
        stroke="var(--coral)"
        stroke-width="10"
        stroke-linecap="round"
        stroke-dasharray={`${Math.min(1, total.kcal / profile.kcal) * 471.24} 471.24`}
        transform="rotate(-90 90 90)"
      /></svg
    >
    <div><strong>{number(total.kcal)}</strong><small>of {number(profile.kcal)} kcal</small></div>
  </div>
  <p class="remaining mono">{number(Math.max(0, profile.kcal - total.kcal))} kcal remaining</p>
  <div class="macro-bars">
    {#each macros as macro (macro)}<div>
        <p><span>{macro}</span><span>{number(total[macro])} / {number(goals[macro])} g</span></p>
        <div class="macro-track">
          <span
            style:width={`${Math.min(100, (total[macro] / goals[macro]) * 100)}%`}
            style:background={`var(--${macro})`}
          ></span>
        </div>
      </div>{/each}
  </div>
</section>

<style>
  header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 10px;
  }
  h2 {
    font-size: var(--text-xl);
  }
  small {
    font-size: var(--text-2xs);
  }
  .calorie-ring {
    width: 180px;
    height: 180px;
    position: relative;
    margin: 26px auto 15px;
  }
  .calorie-ring > div {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  strong {
    font: 500 var(--text-2xl) var(--mono);
    letter-spacing: -2px;
  }
  .remaining {
    text-align: center;
    font-size: var(--text-xs);
    margin: 15px auto 28px;
  }
  .macro-bars {
    display: grid;
    gap: 20px;
  }
  .macro-bars p {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    text-transform: capitalize;
    font: var(--text-xs) var(--mono);
  }
  .macro-track {
    height: 6px;
    background: var(--line);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 10px;
  }
  .macro-track span {
    display: block;
    height: 100%;
    border-radius: inherit;
  }
</style>
