<script lang="ts" generics="_C extends SvelteComponent, _S">
  import {
    type ComponentType,
    type SvelteComponent,
    type ComponentProps,
    onMount,
    createEventDispatcher,
  } from "svelte";
  import type { Scenario } from "$lib/Preview.svelte";
  import Resizeable from "$lib/Resizeable.svelte";

  const dispatch = createEventDispatcher<{
    event: Event;
  }>();

  // _C is defined in the `generics` attribute of the `script` tag
  // but this is not recognized by eslint
  type C = _C; // eslint-disable-line no-undef
  type S = _S; // eslint-disable-line no-undef

  export let component: ComponentType;
  export let scenario: Scenario<C, S>;
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
      ) as ComponentProps<C>;
    }),
  );
</script>

<div class="container">
  <Resizeable
    height={scenario.size?.height ?? "100%"}
    width={scenario.size?.width ?? "100%"}
    on:setSize={(ev) => (scenario.size = ev.detail)}
  >
    <div
      class="view"
      style={Object.entries(scenario.css ?? {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ")}
    >
      <svelte:component
        this={component}
        bind:this={instance}
        {...scenario.props}
      >
        <slot />
      </svelte:component>
    </div>
  </Resizeable>
</div>

<style>
  .view {
    height: 100%;
    width: 100%;
  }
</style>
