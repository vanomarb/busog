/** Bound remote waits while retaining the caller's cancellation semantics and native fetch response. */
export async function request(url: string | URL, signal: AbortSignal, headers?: Record<string, string>) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (signal.aborted) controller.abort();
  signal.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(cancel, 6500);
  try {
    return await fetch(url, { signal: controller.signal, headers });
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', cancel);
  }
}
