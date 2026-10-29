<script lang="ts">
  /**
   * Busog's inbox isn't open yet, so the form never sends anything: it validates, then says plainly that the message
   * stayed on the visitor's device. No address is shown, so no message can reach the wrong inbox.
   */
  let { partnership = false }: { partnership?: boolean } = $props();
  let submitted = $state(false);
</script>

{#if submitted}<div class="form-confirmation" role="status">
    <h2>Thanks for writing.</h2>
    <p>
      Busog's inbox opens after the early preview, so this message stayed on your device and nothing was sent. Keep a
      copy if you'd like to send it later.
    </p>
    <button class="button outline" onclick={() => (submitted = false)}>Back to the form</button>
  </div>{:else}<form
    class="contact-form"
    onsubmit={(event) => {
      event.preventDefault();
      submitted = true;
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
    <p class="muted">Our inbox opens after the early preview; until then, messages aren't sent.</p>
    <button class="button accent">Send ↗</button>
  </form>{/if}

<style>
  .contact-form,
  .form-confirmation {
    display: grid;
    gap: 20px;
    padding: 28px;
    border-radius: 28px;
    background: var(--raised);
  }
  .form-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .contact-form p {
    font-size: var(--text-xs);
  }
  .form-confirmation .button {
    justify-self: start;
  }
  @media (max-width: 600px) {
    .form-fields {
      grid-template-columns: 1fr;
    }
    .contact-form,
    .form-confirmation {
      padding: 22px;
    }
  }
</style>
