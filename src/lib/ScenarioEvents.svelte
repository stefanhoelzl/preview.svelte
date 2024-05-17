<script lang="ts">
  import { cubicIn } from "svelte/easing";
  import { stringifyJSObj } from "./StringifyJSObj.js";

  export let events: Event[];

  function summary(event: Event) {
    if (event instanceof CustomEvent)
      return `${event.type}(${stringifyJSObj(event.detail, false)})`;
    else return `native(${event.type})`;
  }

  function details(event: Event) {
    const eventObject: Record<string, unknown> = {};
    for (let prop in event) {
      eventObject[prop] = event[prop as keyof Event];
    }
    return stringifyJSObj(eventObject);
  }

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

<div class="scroll">
  <div class="events">
    {#each events.toReversed() as event (event)}
      <details
        class="event"
        in:flash={{ from: "lightgreen", to: "white", duration: 200 }}
      >
        <summary>{summary(event)}</summary>
        <pre>{details(event)}</pre>
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
