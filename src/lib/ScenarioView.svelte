<script lang="ts">
  import { type ComponentType } from "svelte";
  import { type Scenario, type CSS } from "$lib/Preview.svelte";
  import ScenarioEvents from "$lib/ScenarioEvents.svelte";
  import ScenarioEditor from "$lib/ScenarioEditor.svelte";
  import Instance from "$lib/ScenarioInstance.svelte";

  export let component: ComponentType;
  export let scenario: Scenario;
  export let defaultCss: CSS = {};
  export let emits: string[] = [];
  export let controls: boolean = true;

  let state = {
    props: scenario.props,
    css: scenario.css || defaultCss,
    size: {
      width: scenario.size?.width || "100%",
      height: scenario.size?.height || "100%",
      children: scenario.size?.children || 0,
    },
  };

  let events: Event[] = [];
</script>

<div class="scenario" class:grid={controls}>
  <div class="instance">
    <Instance
      {component}
      bind:scenario={state}
      {emits}
      on:event={(e) => (events = [...events, e.detail])}
    />
  </div>
  {#if controls}
    <ScenarioEditor scenario={state} on:edit={(e) => (state = e.detail)} />
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
