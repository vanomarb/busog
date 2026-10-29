<script lang="ts">
  import { onMount } from 'svelte';
  import { ScanLine } from '@lucide/svelte';
  interface Detector {
    detect: (video: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
  }
  interface DetectorConstructor {
    new (options: { formats: string[] }): Detector;
  }
  /** Native camera scanning is progressive enhancement; manual barcode entry always stays available. */
  let { oncode }: { oncode: (code: string) => void } = $props();
  let video: HTMLVideoElement;
  let stream: MediaStream | undefined;
  let timer: ReturnType<typeof setInterval> | undefined;
  let message = $state('');
  let scanning = $state(false);
  function stop() {
    clearInterval(timer);
    stream?.getTracks().forEach((track) => track.stop());
    scanning = false;
  }
  onMount(() => stop);
  async function scan() {
    const NativeDetector = (window as unknown as { BarcodeDetector?: DetectorConstructor }).BarcodeDetector;
    if (!NativeDetector || !navigator.mediaDevices?.getUserMedia) {
      message = 'Camera scanning isn’t supported here. Enter the barcode digits below.';
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      scanning = true;
      video.srcObject = stream;
      await video.play();
      const detector = new NativeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
      timer = setInterval(async () => {
        try {
          const result = await detector.detect(video);
          if (result[0]) {
            oncode(result[0].rawValue);
            stop();
          }
        } catch {
          message = 'Hold the barcode steady, or enter the digits below.';
        }
      }, 600);
    } catch {
      stop();
      message = 'Camera access isn’t available. You can enter the digits instead.';
    }
  }
</script>

<div>
  <button class="button outline" onclick={scanning ? stop : scan}
    ><ScanLine size={19} />{scanning ? 'Stop camera' : 'Scan with camera'}</button
  ><video bind:this={video!} playsinline muted class:scanning aria-label="Barcode camera preview"
  ></video>{#if message}<p role="status" class="source-line">{message}</p>{/if}
</div>

<style>
  video {
    display: none;
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 20px;
    margin-top: 15px;
  }
  video.scanning {
    display: block;
  }
</style>
