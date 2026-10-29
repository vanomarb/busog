<script lang="ts">
  import { CONTACT_EMAIL } from '../../data/contact';
  /**
   * Busog has no mail server, so the form composes the message in the visitor's own email app: nothing is sent behind
   * their back, and they see exactly what goes out.
   */
  let { partnership = false }: { partnership?: boolean } = $props();
  let composed = $state(false);
  function compose(event: SubmitEvent) {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const subject = `${partnership ? 'Partnership' : 'Busog'}: ${data.get('topic')}`;
    const body = `${data.get('message')}\n\n${data.get('name')}`;
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    composed = true;
  }
</script>

{#if composed}<div class="form-confirmation" role="status">
    <h2>Your email app has it.</h2>
    <p>Your message is ready to send from your own email app. If nothing opened, write to {CONTACT_EMAIL}.</p>
    <button class="button outline" onclick={() => (composed = false)}>Write another message</button>
  </div>{:else}<form class="contact-form" onsubmit={compose}>
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
    <p class="muted">This opens your email app with the message ready to send.</p>
    <button class="button accent">Write the email ↗</button>
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
