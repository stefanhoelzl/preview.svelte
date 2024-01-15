<script lang="ts">
  import { cubicIn } from "svelte/easing";

  export let events: unknown[];

  function flash(
    _node: Element,
    opts: { duration: number; from: string; to: string },
  ) {
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
  }
</script>

<div class="events">
  {#each events.map((e, idx) => [e, idx]).reverse() as [event, idx] (idx)}
    <div in:flash={{ from: "lightgreen", to: "white", duration: 200 }}>
      {JSON.stringify(event)}
    </div>
  {/each}
</div>

<style>
  .events {
    background-color: white;
    font-family: monospace;
    border: 1px solid silver;
    height: 100%;
  }
</style>
