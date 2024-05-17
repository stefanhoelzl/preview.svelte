<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";

  export let width: string;
  export let height: string;

  const dispatch = createEventDispatcher<{
    setSize: { width: string; height: string };
  }>();

  let resizeable: HTMLElement;
  let observer: ResizeObserver;
  onMount(() => {
    observer = new ResizeObserver((entries) => {
      if (!resizeable) return;

      entries.forEach((entry) => {
        let heightInPx: number, widthInPx: number;
        const computedStyle = getComputedStyle(resizeable);
        if (computedStyle.getPropertyValue("box-sizing") == "border-box") {
          heightInPx = entry.borderBoxSize[0].blockSize;
          widthInPx = entry.borderBoxSize[0].inlineSize;
        } else {
          heightInPx = entry.contentRect.height;
          widthInPx = entry.contentRect.width;
        }
        if (widthInPx === 0 && heightInPx === 0) return;
        dispatch("setSize", {
          width: `${widthInPx.toFixed(0)}px`,
          height: `${heightInPx.toFixed(0)}px`,
        });
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
