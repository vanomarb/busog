<script lang="ts">
  import BrandMark from '../site/BrandMark.svelte';
  import { ArrowUpRight, ArrowUp, AudioLines } from '@lucide/svelte';
  import { number } from '../../domain/nutrition';
  /** Scripted local replies make the coaching demonstration honest and deterministic. */
  let { protein, target }: { protein: number; target: number } = $props();
  let input = $state('');
  let reply = $state('Your diary has room for dinner. ' + 'Want to look at protein or plan tomorrow’s ulam?');
  function ask(question: string) {
    reply = /protein/i.test(question)
      ? `Your plate has ${number(protein)} g protein against a ${number(target)} g target. ` +
        'Open Turo-turo to compare dishes.'
      : /tomorrow|ulam|plan/i.test(question)
        ? 'Try the ginisang munggo composition with rice and greens. You can review every ingredient in the kitchen.'
        : 'In this demo I can show your protein or suggest tomorrow’s ulam. Your numbers always come from the diary.';
    input = '';
  }
</script>

<section class="card coach-card">
  <header class="card-heading">
    <h2>Busog coach</h2>
    <span class="round" aria-hidden="true"><ArrowUpRight size={21} /></span>
  </header>
  <small class="muted">Demo: replies are scripted</small>
  <div class="coach-message">
    <span class="avatar" aria-hidden="true"><BrandMark size={24} /></span>
    <p aria-live="polite">{reply}</p>
  </div>
  <div class="coach-suggestions">
    <button onclick={() => ask('protein')}>Show my protein</button><button onclick={() => ask('plan tomorrow')}
      >Plan tomorrow’s ulam</button
    >
  </div>
  <form
    onsubmit={(event) => {
      event.preventDefault();
      if (input.trim()) ask(input);
    }}
  >
    <button class="round coral" aria-label="Send message" type="submit"><ArrowUp size={22} /></button>
    <div class="coach-input">
      <input aria-label="Message Busog coach" bind:value={input} placeholder="Ask about your plate" /><AudioLines
        size={21}
        aria-hidden="true"
      />
    </div>
  </form>
</section>

<style>
  small {
    font-size: var(--text-2xs);
  }
  .coach-card .card-heading {
    margin-bottom: 0;
  }
  .coach-message {
    display: flex;
    gap: 12px;
    margin: 22px 0;
    align-items: start;
  }
  .coach-message .avatar {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    --mark-cut: var(--warning);
  }
  .coach-message p {
    background: var(--surface);
    padding: 16px;
    border-radius: 0 20px 20px;
    font: var(--text-xs) / 1.8 var(--mono);
  }
  .coach-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .coach-suggestions button {
    border-radius: 20px;
    padding: 7px 11px;
    font: var(--text-2xs) var(--mono);
    background: var(--aqua);
    color: #20231f;
  }
  .coach-suggestions button:last-child {
    background: var(--sage);
  }
  form {
    display: flex;
    gap: 12px;
    margin-top: 22px;
  }
  .coach-input {
    display: flex;
    align-items: center;
    min-width: 0;
    flex: 1;
    background: var(--surface);
    border-radius: 999px;
    padding-right: 15px;
  }
  .coach-input input {
    border: 0;
    background: transparent;
    padding: 10px 15px;
    border-radius: 999px;
  }
</style>
