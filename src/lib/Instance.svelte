<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { type ComponentType, onMount, type SvelteComponent } from "svelte";
  import type { ScenarioState } from "$lib/Preview.svelte";

  const dispatch = createEventDispatcher<{
    event: Event;
  }>();

  export let component: ComponentType;
  export let scenario: ScenarioState;
  export let emits: string[] = [];
  let instance: SvelteComponent;

  onMount(() =>
    emits.forEach((e) => instance.$on(e, (event) => dispatch("event", event))),
  );

  let resizeable: HTMLElement;
  let observer: ResizeObserver;
  onMount(() => {
    observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        scenario.size.width = `${entry.contentRect.width.toFixed()}px`;
        scenario.size.height = `${entry.contentRect.height.toFixed()}px`;
      });
      scenario = scenario;
    });
    observer.observe(resizeable);
  });
</script>

<div class="container">
  <div
    class="resizeable"
    style:height={scenario.size.height}
    style:width={scenario.size.width}
    bind:this={resizeable}
  >
    <div
      class="instance"
      style={Object.entries(scenario.css)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ")}
    >
      <svelte:component
        this={component}
        bind:this={instance}
        {...scenario.props}
      >
        {#each Array(scenario.size.children).fill(0) as _}
          <slot />
        {/each}
      </svelte:component>
    </div>
  </div>
</div>

<style>
  .container {
    overflow: hidden;
  }

  .resizeable {
    resize: both;
    overflow: auto;
    border: 1px solid silver;
    z-index: 1;
    background-color: white;
  }

  .instance {
    height: 100%;
    width: 100%;
  }
</style>
