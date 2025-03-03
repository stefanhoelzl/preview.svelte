<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  interface Props {
    width: string;
    height: string;
    onsetsize: (ev: { width: string; height: string }) => void;
    children: Snippet;
  }

  let {
    width = $bindable(),
    height = $bindable(),
    onsetsize,
    children,
  }: Props = $props();

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
        onsetsize({
          width: `${widthInPx.toFixed(0)}px`,
          height: `${heightInPx.toFixed(0)}px`,
        });
      });
    });
    observer.observe(resizeable);
  });
</script>

<div class="resizeable" style:height style:width bind:this={resizeable}>
  {@render children?.()}
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
