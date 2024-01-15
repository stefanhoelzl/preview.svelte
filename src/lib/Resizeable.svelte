<script lang="ts">
  import { onMount } from "svelte";

  export let width: string;
  export let height: string;

  let resizeable: HTMLElement;
  let observer: ResizeObserver;
  onMount(() => {
    observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width: widthInPixel, height: heightInPixel } =
          entry.contentRect;
        if (widthInPixel === 0 && heightInPixel === 0) return;
        width = `${widthInPixel.toFixed(0)}px`;
        height = `${heightInPixel.toFixed(0)}px`;
      });
    });
    observer.observe(resizeable);
  });
</script>

<div class="resizeable" style:height style:width bind:this={resizeable}>
  <slot />
</div>

<style>
  .resizeable {
    resize: both;
    overflow: auto;
    border: 1px solid silver;
    z-index: 1;
    background-color: white;
  }
</style>
