<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { type ComponentType, onMount, type SvelteComponent } from "svelte";
  import type { ScenarioState } from "$lib/Preview.svelte";
  import Resizeable from "$lib/Resizeable.svelte";

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
</script>

<div class="container">
  <Resizeable
    bind:height={scenario.size.height}
    bind:width={scenario.size.width}
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
  </Resizeable>
</div>

<style>
  .container {
    overflow: hidden;
  }

  .instance {
    height: 100%;
    width: 100%;
  }
</style>
