<script lang="ts">
  import { today } from '../../domain/dates';
  import type { DemoStore } from '../../lib/store';
  import type { Navigation } from '../../lib/navigation';
  /** Saving a date replaces its existing weigh-in, so historical values remain editable. */
  let { store, nav }: { store: DemoStore; nav: Navigation } = $props();
  let date = $state(today());
  let kg = $derived($store.weights.find((item) => item.date === date)?.kg || $store.profile.weight);
</script>

<form
  class="stack"
  onsubmit={(event) => {
    event.preventDefault();
    if (kg >= 25 && kg <= 350) {
      store.weight(date, kg);
      nav.close();
    }
  }}
>
  <p class="muted">Choose a date to add or edit a weigh-in.</p>
  <label>Date<input type="date" required max={today()} bind:value={date} /></label><label
    >Weight · kg<input type="number" required min="25" max="350" step="0.1" bind:value={kg} /></label
  ><button class="button accent">Save weigh-in</button>
</form>
