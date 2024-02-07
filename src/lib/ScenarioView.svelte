<script lang="ts" generics="_C extends SvelteComponent, _S">
  import { type ComponentType, SvelteComponent } from "svelte"; // eslint-disable-line @typescript-eslint/no-unused-vars
  import { type Scenario } from "$lib/Preview.svelte";
  import ScenarioEvents from "$lib/ScenarioEvents.svelte";
  import ScenarioEditor from "$lib/ScenarioEditor.svelte";
  import Instance from "$lib/ScenarioInstance.svelte";

  // _C is defined in the `generics` attribute of the `script` tag
  // but this is not recognized by eslint
  type C = _C; // eslint-disable-line no-undef
  type S = _S; // eslint-disable-line no-undef

  export let component: ComponentType;
  export let scenario: Scenario<C, S>;
  export let emits: string[] = [];
  export let controls: boolean = true;

  let events: Event[] = [];
</script>

<div class="scenario" class:grid={controls}>
  <div class="instance">
    <Instance
      {component}
      bind:scenario
      {emits}
      on:event={(e) => (events = [...events, e.detail])}
    >
      <slot />
    </Instance>
  </div>
  {#if controls}
    <ScenarioEditor {scenario} on:edit={(e) => (scenario = e.detail)} />
    <ScenarioEvents {events} />
  {/if}
</div>

<style>
  .scenario {
    width: 100%;
    height: 100%;
    display: grid;
    grid-gap: var(--padding);
  }

  .grid {
    grid-template: 3fr 2fr / 2fr minmax(200px, 1fr);
  }

  .instance {
    display: grid;
    margin: 0.1em;
    grid-row: 1 / -1;
  }
</style>
