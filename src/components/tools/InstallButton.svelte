<script lang="ts">
  import { onMount } from 'svelte';
  interface InstallEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: string }>;
  }
  /** Offer the native install prompt only when the browser actually supplies it. */
  let pending = $state<InstallEvent | undefined>();
  let message = $state('');
  onMount(() => {
    const listener = (event: Event) => {
      event.preventDefault();
      pending = event as InstallEvent;
    };
    window.addEventListener('beforeinstallprompt', listener);
    return () => window.removeEventListener('beforeinstallprompt', listener);
  });
  async function install() {
    if (!pending) return;
    await pending.prompt();
    const choice = await pending.userChoice;
    message =
      choice.outcome === 'accepted'
        ? 'Added. Your table is ready on your home screen.'
        : 'You can install later from your browser menu.';
    pending = undefined;
  }
</script>

{#if pending}<button class="button accent" onclick={install}>Install Busog web app ↗</button>{/if}{#if message}<p
    role="status"
  >
    {message}
  </p>{/if}
