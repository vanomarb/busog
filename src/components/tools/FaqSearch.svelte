<script lang="ts">
  import { faq } from '../../data/faq';
  import { Search } from '@lucide/svelte';
  /** Search and groups narrow a small original help corpus without invented question counts. */
  let query = $state('');
  let group = $state('All questions');
  const groups = ['All questions', ...new Set(faq.map((item) => item.group))];
  const filtered = $derived(
    faq.filter(
      (item) =>
        (group === 'All questions' || item.group === group) &&
        `${item.question} ${item.answer}`.toLowerCase().includes(query.toLowerCase()),
    ),
  );
</script>

<div class="faq-search">
  <label
    ><Search size={20} /><span class="sr-only">Search questions</span><input
      type="search"
      bind:value={query}
      placeholder="What would you like to know?"
    /></label
  >
  <div class="faq-filters">
    {#each groups as value (value)}<button class:chosen={group === value} onclick={() => (group = value)}
        >{value}</button
      >{/each}
  </div>
  <p class="source-line" role="status">{filtered.length} questions</p>
  {#each filtered as item (item.question)}<details>
      <summary>{item.question}</summary>
      <p>{item.answer}</p>
      <small>{item.group}</small>
    </details>{:else}<p class="notice">No questions match. Try “rice”, “offline” or “goals”.</p>{/each}
</div>

<style>
  .faq-search {
    max-width: 900px;
    margin: 0 auto;
  }
  label {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--raised);
    padding: 7px 18px;
    border-radius: 20px;
  }
  input {
    border: 0;
    padding-left: 0;
  }
  .faq-filters {
    display: flex;
    gap: 9px;
    flex-wrap: wrap;
    margin: 25px 0;
  }
  .faq-filters button {
    border-radius: 24px;
    background: var(--raised);
    padding: 10px 16px;
    font: var(--text-xs) var(--mono);
  }
  .faq-filters .chosen {
    background: var(--ink);
    color: var(--surface);
  }
  details {
    border-bottom: 1px solid var(--line);
    padding: 22px 0;
  }
  summary {
    cursor: pointer;
    min-height: 44px;
    font-size: var(--text-lg);
  }
  details p {
    color: var(--muted);
    margin: 12px 0 20px;
  }
  small {
    color: var(--muted);
    font-size: var(--text-2xs);
  }
  .source-line {
    font: var(--text-xs) var(--mono);
    color: var(--muted);
  }
</style>
