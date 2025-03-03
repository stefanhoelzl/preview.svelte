<script lang="ts">
  import { cubicIn } from "svelte/easing";
  import type { Event } from "$lib/Preview.svelte";

  interface Props {
    events: Event[];
  }

  let { events }: Props = $props();

  function flash(
    node: Element,
    opts: { duration: number; from: string; to: string },
  ) {
    if (node.animate !== undefined)
      return {
        duration: opts.duration,
        css: (t: number) => {
          const eased = cubicIn(t);
          return `
            background-color: color-mix(in srgb, ${opts.to} ${eased * 100}%, ${
              opts.from
            });
           `;
        },
      };
    return {};
  }
</script>

<div class="scroll">
  <div class="events">
    {#each events.toReversed() as event, idx (events.length - idx)}
      <details
        class="event"
        in:flash={{ from: "lightgreen", to: "white", duration: 200 }}
      >
        <summary>{event.summary}</summary>
        <pre>{event.details}</pre>
      </details>
    {/each}
  </div>
</div>

<style>
  .events {
    background-color: white;
    font-family: monospace;
    border: 1px solid silver;
    height: 100%;
    overflow: auto;
  }

  .scroll {
    overflow: hidden;
  }
</style>
