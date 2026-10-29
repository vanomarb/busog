<script lang="ts">
  import { target, type BodyProfile } from '../../domain/goals';
  import { onboardingUrl } from '../../lib/handoff';
  import { number } from '../../domain/nutrition';
  import FoodCharacter from '../app/FoodCharacter.svelte';
  /** A short, account-free quiz hands its actual answers into the app's editable onboarding. */
  let step = $state(0);
  let profile = $state<BodyProfile>({
    age: 29,
    sex: 'female',
    weight: 62,
    height: 160,
    activity: 1.55,
    goal: 'maintain',
  });
  const directions = [
    { value: 'maintain', title: 'Understand my everyday', text: 'Start around estimated maintenance.' },
    { value: 'lose', title: 'Explore a small deficit', text: 'Estimate maintenance, then subtract 250 kcal.' },
    { value: 'gain', title: 'Explore a small surplus', text: 'Estimate maintenance, then add 250 kcal.' },
  ] as const;
</script>

<div class="quiz-layout">
  <div class="quiz-art violet">
    <FoodCharacter kind={step === 0 ? 'rice' : step === 1 ? 'egg' : 'banana'} size={180} />
    <h2>One plate.<br />Your starting point.</h2>
    <p>No email. No account.<br />Just a few assumptions, made visible.</p>
  </div>
  <section class="quiz-panel">
    <p class="mono muted">{step < 3 ? `Question ${step + 1} of 3` : 'Your starting point'}</p>
    {#if step === 0}<h2>What brings you<br />to the table?</h2>
      <div class="quiz-directions">
        {#each directions as direction (direction.value)}<button
            class:chosen={profile.goal === direction.value}
            onclick={() => (profile.goal = direction.value)}
            ><strong>{direction.title}</strong><span>{direction.text}</span></button
          >{/each}
      </div>
      <button class="button accent" onclick={() => (step = 1)}>Continue</button>
    {:else if step === 1}<h2>A little context.</h2>
      <form
        class="stack"
        onsubmit={(event) => {
          event.preventDefault();
          step = 2;
        }}
      >
        <div class="quiz-fields">
          <label>Age<input type="number" required min="18" max="90" bind:value={profile.age} /></label><label
            >Equation constant<select bind:value={profile.sex}
              ><option value="female">Female</option><option value="male">Male</option></select
            ></label
          >
        </div>
        <div class="quiz-fields">
          <label
            >Weight · kg<input
              type="number"
              min="25"
              max="350"
              step="0.1"
              required
              bind:value={profile.weight}
            /></label
          ><label>Height · cm<input type="number" min="120" max="230" required bind:value={profile.height} /></label>
        </div>
        <p class="source-line">
          Adult educational example. The formula uses sex-specific constants, not a full picture of your individual
          needs.
        </p>
        <button class="button accent">Continue</button>
      </form>
    {:else if step === 2}<h2>How does your<br />day move?</h2>
      <label
        >Activity assumption<select bind:value={profile.activity}
          ><option value={1.2}>Mostly seated</option><option value={1.375}>Lightly active</option><option value={1.55}
            >Moderately active</option
          ><option value={1.725}>Very active</option><option value={1.9}>Highly active</option></select
        ></label
      >
      <p class="muted">This multiplier is an assumption. It is not a measured calorie burn.</p>
      <button class="button accent" onclick={() => (step = 3)}>See my starting point</button>
    {:else}<h2 class="quiz-total">{number(target(profile))}<span>kcal / day</span></h2>
      <p>Mifflin–St Jeor × your activity assumption, with the chosen adjustment. A starting point you can edit.</p>
      <a class="button accent" href={onboardingUrl(profile)}>Set my table in the demo ↗</a>
      <p class="source-line">
        Educational concept, not medical advice. Your answers travel only in the demo link and are editable before
        saving.
      </p>{/if}
    {#if step > 0}<button class="quiz-back" onclick={() => step--}>Back</button>{/if}
  </section>
</div>

<style>
  .quiz-layout {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 40px;
    align-items: stretch;
  }
  .quiz-art {
    padding: 45px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 30px;
  }
  .quiz-art h2 {
    font-size: var(--text-4xl);
  }
  .quiz-art p {
    font: var(--text-xs) / 1.8 var(--mono);
  }
  .quiz-panel {
    padding: 35px 0;
    display: grid;
    gap: 28px;
    align-content: start;
  }
  .quiz-panel > p:first-child {
    font-size: var(--text-xs);
  }
  .quiz-panel h2 {
    font-size: var(--text-4xl);
  }
  .quiz-directions {
    display: grid;
    gap: 12px;
  }
  .quiz-directions button {
    text-align: left;
    padding: 20px;
    border-radius: 20px;
    border: 1px solid var(--line);
    background: var(--raised);
  }
  .quiz-directions .chosen {
    background: var(--aqua);
    color: #20231f;
    border-color: transparent;
  }
  .quiz-directions strong,
  .quiz-directions span {
    display: block;
  }
  .quiz-directions span {
    font-size: var(--text-sm);
    margin-top: 7px;
  }
  .quiz-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .quiz-back {
    justify-self: start;
    min-width: 70px;
    text-decoration: underline;
  }
  .quiz-panel .quiz-total {
    font: 500 var(--text-4xl) var(--mono);
  }
  .quiz-total span {
    display: block;
    font-size: var(--text-sm);
    margin-top: 15px;
  }
  .source-line {
    font-size: var(--text-xs);
    color: var(--muted);
  }
  @media (max-width: 900px) {
    .quiz-layout {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .quiz-art {
      padding: 25px;
      flex-direction: row;
      align-items: center;
      gap: 15px;
    }
    .quiz-art > :global(svg) {
      max-width: 80px;
    }
    .quiz-art h2 {
      font-size: var(--text-2xl);
    }
    .quiz-art p {
      display: none;
    }
  }
</style>
