<script lang="ts">
  import { Settings, Download, RotateCcw, Moon, Sun } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import type { Region } from '../../domain/types';
  import type { DemoStore } from '../../lib/store';
  import type { Navigation } from '../../lib/navigation';
  import ProfileForm from './ProfileForm.svelte';
  /** Settings exposes goals, local-only API keys, portability and a reversible demo reset. */
  let { store, nav }: { store: DemoStore; nav: Navigation } = $props();
  let theme = $state('dark');
  let message = $state('');
  let confirmReset = $state(false);
  let formVersion = $state(0);
  onMount(() => (theme = document.documentElement.dataset.theme || 'dark'));
  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('busog-theme', theme);
    } catch {
      /* Theme remains available during this visit. */
    }
  }
  function exportData() {
    const data = {
      ...$store,
      profile: { ...$store.profile, apiKey: '' },
      credits: { usda: 'USDA FoodData Central · CC0', off: 'Open Food Facts · ODbL / DbCL' },
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'busog-diary.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    message = 'Export ready. Your personal API key is excluded.';
  }
</script>

<div class="app-page profile-page">
  <header class="app-page-intro">
    <div>
      <p class="mono muted">A table that fits you.</p>
      <h1>Your settings.</h1>
    </div>
    <Settings size={32} />
  </header>
  <div class="profile-layout">
    <section class="card">
      <h2>Your goals</h2>
      <p class="muted">Adjust anything below; your targets update as you go.</p>
      {#key formVersion}<ProfileForm
          profile={$store.profile}
          onsave={(profile) => {
            store.profile(profile);
            message = 'Goals saved to this browser.';
          }}
        />{/key}
    </section>
    <aside class="stack">
      <section class="card aqua settings-card">
        <h2>Make it yours</h2>
        <button class="setting-row" onclick={toggleTheme}
          ><span>Theme · {theme}</span>{#if theme === 'dark'}<Moon size={21} />{:else}<Sun size={21} />{/if}</button
        ><label
          >Region and food names<select
            value={$store.profile.region}
            onchange={(event) => {
              store.region(event.currentTarget.value as Region);
              message = 'Names and suggestions updated. Start fresh for a matching sample diary.';
            }}
            ><option value="ph">Philippines · Filipino names first</option><option value="intl"
              >International · English names first</option
            ></select
          ></label
        ><label
          >Display units<select
            value={$store.profile.units}
            onchange={(event) =>
              store.profile({ ...$store.profile, units: event.currentTarget.value as 'metric' | 'imperial' })}
            ><option value="metric">Metric · kg, cm</option><option value="imperial"
              >Imperial · lb (food remains grams)</option
            ></select
          ></label
        ><button class="setting-row" onclick={() => nav.screen('onboarding')}>Revisit onboarding <span>↗</span></button>
      </section>
      <section class="card settings-card">
        <h2>Yours to keep</h2>
        <p class="muted">Diary data stays in this browser. No account or syncing service.</p>
        <button class="setting-row" onclick={exportData}><Download size={20} /> Export JSON</button><button
          class="setting-row"
          onclick={() => (confirmReset = !confirmReset)}><RotateCcw size={20} /> Start fresh</button
        >{#if confirmReset}<p>
            This restores the sample diary and default goals, with
            {$store.profile.region === 'ph' ? 'Filipino' : 'international'} meals.
          </p>
          <button
            class="button accent"
            onclick={() => {
              store.reset();
              formVersion++;
              confirmReset = false;
              message = 'Sample diary restored.';
            }}>Restore the sample diary</button
          >{/if}
      </section>
      <section class="card settings-card">
        <h2>Food data</h2>
        <label
          >Personal data.gov API key<input
            type="password"
            autocomplete="off"
            value={$store.profile.apiKey}
            onchange={(event) => {
              store.profile({ ...$store.profile, apiKey: event.currentTarget.value.trim() });
              message = 'Key saved locally.';
            }}
            placeholder="Optional; DEMO_KEY works too"
          /></label
        >
        <p class="source-line">
          Stored only in this browser. Used only for USDA search, sent directly to api.nal.usda.gov. No key is required
          for offline food search.
        </p>
        <p class="source-line">
          <a href="https://fdc.nal.usda.gov/">USDA FoodData Central</a> · CC0<br /><a
            href="https://world.openfoodfacts.org/">Open Food Facts</a
          > · ODbL / DbCL
        </p>
        <a href="/busog/credits/">All credits and limitations</a>
      </section>
    </aside>
  </div>
  {#if message}<p class="settings-message" role="status">{message}</p>{/if}
</div>

<style>
  .profile-layout {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 24px;
    align-items: start;
  }
  .profile-layout h2 {
    font-size: var(--text-2xl);
    margin-bottom: 20px;
  }
  .profile-layout > section > p {
    margin-bottom: 30px;
  }
  .settings-card {
    display: grid;
    gap: 22px;
  }
  .settings-card h2 {
    margin: 0;
  }
  .setting-row {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid currentColor;
    text-align: left;
  }
  .settings-message {
    position: sticky;
    bottom: 15px;
    background: var(--primary);
    color: var(--surface);
    padding: 18px;
    border-radius: 18px;
    margin-top: 25px;
  }
  :global([data-device='phone']) .profile-layout {
    grid-template-columns: 1fr;
  }
  @media (max-width: 1100px) {
    .profile-layout {
      grid-template-columns: 1fr;
    }
  }
</style>
