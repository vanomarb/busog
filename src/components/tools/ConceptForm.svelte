<script lang="ts">
  /** This visual form validates locally; its submit path never performs a network request. */
  let { partnership = false }: { partnership?: boolean } = $props();
  let sent = $state(false);
</script>

{#if sent}<div class="form-confirmation sage" role="status">
    <h2>Message received.<br />Here, on this screen.</h2>
    <p>This is a concept, nothing was sent.</p>
    <button class="button" onclick={() => (sent = false)}>Try the form again</button>
  </div>{:else}<form
    class="concept-form"
    onsubmit={(event) => {
      event.preventDefault();
      sent = true;
    }}
  >
    <div class="form-fields">
      <label>Your name<input name="name" autocomplete="name" required maxlength="80" /></label><label
        >Email<input name="email" type="email" autocomplete="email" required /></label
      >
    </div>
    <label
      >{partnership ? 'Organisation or project' : 'What’s it about?'}<input
        name="topic"
        required
        maxlength="120"
      /></label
    ><label>Your message<textarea name="message" rows="6" required minlength="10" maxlength="2000"></textarea></label>
    <p class="mono muted">Visual demo only. Nothing leaves your browser.</p>
    <button class="button accent">Try sending a message ↗</button>
  </form>{/if}

<style>
  .concept-form {
    display: grid;
    gap: 24px;
    padding: 32px;
    border-radius: 28px;
    background: var(--raised);
  }
  .form-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .concept-form p {
    font-size: var(--text-2xs);
  }
  .form-confirmation {
    padding: 35px;
    border-radius: 28px;
    display: grid;
    gap: 25px;
  }
  .form-confirmation .button {
    justify-self: start;
    background: #20231f;
    color: #f6f8f3;
  }
  @media (max-width: 600px) {
    .form-fields {
      grid-template-columns: 1fr;
    }
    .concept-form {
      padding: 24px;
    }
  }
</style>
