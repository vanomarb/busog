<script lang="ts">
  import { bmr, tdee, target, type BodyProfile } from '../../domain/goals';
  import { number } from '../../domain/nutrition';
  import { onboardingUrl } from '../../lib/handoff';
  /** Explicit assumptions and unit conversions make the educational calorie tool inspectable. */
  let sex = $state<'female' | 'male'>('female');
  let age = $state(29);
  let weight = $state(62);
  let height = $state(160);
  let feet = $state(5);
  let inches = $state(3);
  let massUnit = $state('kg');
  let heightUnit = $state('cm');
  let activity = $state(1.55);
  let goal = $state<'maintain' | 'lose' | 'gain'>('maintain');
  let result = $state<BodyProfile | undefined>();
  let error = $state('');
  function calculate() {
    const profile: BodyProfile = {
      sex,
      age,
      weight: massUnit === 'kg' ? weight : weight * 0.45359237,
      height: heightUnit === 'cm' ? height : (feet * 12 + inches) * 2.54,
      activity,
      goal,
    };
    if (profile.weight < 25 || profile.weight > 350 || profile.height < 120 || profile.height > 230 || age > 90) {
      error = 'Use an adult example with weight 25–350 kg and height 120–230 cm.';
      return;
    }
    try {
      target(profile);
      result = profile;
      error = '';
    } catch {
      error = 'Check your age and measurements, then try again.';
    }
  }
</script>

<div class="calculator-layout">
  <form
    class="card calculator-form"
    onsubmit={(event) => {
      event.preventDefault();
      calculate();
    }}
  >
    <h2>A starting point.</h2>
    <p class="muted">For adults 18–90. Metric by default.</p>
    <div class="calc-fields">
      <label
        >Equation constant<select bind:value={sex}
          ><option value="female">Female</option><option value="male">Male</option></select
        ></label
      ><label>Age<input type="number" required min="18" max="90" bind:value={age} /></label>
    </div>
    <div class="calc-fields">
      <label>Weight<input required type="number" min="1" step="0.1" bind:value={weight} /></label><label
        >Weight unit<select bind:value={massUnit}><option value="kg">kg</option><option value="lb">lb</option></select
        ></label
      >
    </div>
    <label
      >Height unit<select bind:value={heightUnit}
        ><option value="cm">Centimetres</option><option value="ft">Feet and inches</option></select
      ></label
    >
    {#if heightUnit === 'cm'}<label
        >Height · cm<input required type="number" min="120" max="230" bind:value={height} /></label
      >{:else}<div class="calc-fields">
        <label>Feet<input type="number" required min="3" max="7" bind:value={feet} /></label><label
          >Inches<input required type="number" min="0" max="11" bind:value={inches} /></label
        >
      </div>{/if}
    <label
      >Activity assumption<select bind:value={activity}
        ><option value={1.2}>Mostly seated · 1.2</option><option value={1.375}>Light activity · 1.375</option><option
          value={1.55}>Moderate activity · 1.55</option
        ><option value={1.725}>Very active · 1.725</option><option value={1.9}>Highly active · 1.9</option></select
      ></label
    >
    <label
      >Direction<select bind:value={goal}
        ><option value="maintain">Maintain</option><option value="lose">Small deficit · −250 kcal</option><option
          value="gain">Small surplus · +250 kcal</option
        ></select
      ></label
    >
    {#if error}<p role="alert">{error}</p>{/if}<button class="button accent">Calculate my starting point</button>
  </form>
  <aside class="calculator-result sage" aria-live="polite">
    {#if result}<p class="mono">Your formula-based estimate</p>
      <h2>{number(target(result))}<span>kcal / day</span></h2>
      <dl>
        <div>
          <dt>Resting energy</dt>
          <dd>{number(bmr(result))} kcal</dd>
        </div>
        <div>
          <dt>Activity multiplier</dt>
          <dd>× {result.activity}</dd>
        </div>
        <div>
          <dt>Estimated maintenance</dt>
          <dd>{number(tdee(result))} kcal</dd>
        </div>
      </dl>
      <p>One calculated starting point, rounded to 10 kcal. Needs and food records vary. You can edit it in Busog.</p>
      <a class="button" href={onboardingUrl(result)}>Bring this to Busog ↗</a>{:else}<p class="mono">
        An estimate, with the workings.
      </p>
      <h2>Your everyday<br />starts here.</h2>
      <p>
        Enter your example profile. We’ll show resting energy, the activity assumption and a suggested daily target.
      </p>{/if}
  </aside>
</div>

<style>
  .calculator-layout {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 30px;
    align-items: start;
  }
  .calculator-form {
    display: grid;
    gap: 24px;
  }
  .calculator-form h2 {
    font-size: var(--text-2xl);
  }
  .calc-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .calculator-result {
    padding: 38px;
    border-radius: 32px;
    position: sticky;
    top: 25px;
    display: grid;
    gap: 30px;
  }
  .calculator-result h2 {
    font-size: var(--text-4xl);
  }
  .calculator-result h2 span {
    display: block;
    font: var(--text-xs) var(--mono);
    margin-top: 12px;
  }
  .calculator-result > p:first-child {
    font-size: var(--text-xs);
  }
  .calculator-result .button {
    background: var(--accent);
    color: var(--on-accent);
  }
  dl {
    margin: 0;
  }
  dl > div {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--line);
    padding: 15px 0;
    font-size: var(--text-sm);
    gap: 15px;
  }
  dd {
    margin: 0;
    font-family: var(--mono);
  }
  @media (max-width: 700px) {
    .calculator-layout {
      grid-template-columns: 1fr;
    }
    .calculator-result {
      position: static;
    }
  }
</style>
