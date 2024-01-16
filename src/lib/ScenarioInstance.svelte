<script lang="ts">
  import {
    type ComponentType,
    type SvelteComponent,
    onMount,
    createEventDispatcher,
  } from "svelte";
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

  /*
  from what I have observed
  * instance.$$.props is a mapping from `propName`->`prop index in ctx`
  * instance.$$.ctx is a array with values

  by using the index of `$$.props` we can get the value from `$$.ctx`
  this allows us to reconstruct an object with all props.

  An added `afterUpdate`-hook updates `scenario.props` after each update with this reconstructed props.
  */
  onMount(() =>
    instance.$$.after_update.push(() => {
      scenario.props = Object.fromEntries(
        Object.entries(instance.$$.props).map(([prop, idx]) => [
          prop,
          instance.$$.ctx[idx as number],
        ]),
      );
    }),
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
