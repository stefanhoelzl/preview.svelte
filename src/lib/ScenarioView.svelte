<script lang="ts" generics="C extends Component, S">
  import Events from "$lib/ScenarioEvents.svelte";
  import Editor from "$lib/ScenarioEditor.svelte";
  import Instance from "$lib/ScenarioInstance.svelte";
  import type { Component, Snippet } from "svelte";
  import type { Scenario, Event } from "$lib/Preview.svelte";

  // _C is defined in the `generics` attribute of the `script` tag
  // but this is not recognized by eslint
  //type C = _C; // eslint-disable-line no-undef
  //type S = _S; // eslint-disable-line no-undef

  interface Props {
    component: C;
    scenario: Scenario<C, S>;
    controls?: boolean;
    children?: Snippet;
  }

  let { component, scenario, controls = true, children }: Props = $props();
  let events: Event[] = $state([]);

  let scenarioState = $state(scenario);
</script>

<div class="scenario" class:grid={controls}>
  <div class="instance">
    <Instance
      {component}
      bind:scenario={scenarioState}
      onevent={(ev) => events.push(ev)}
    >
      {@render children?.()}
    </Instance>
  </div>
  {#if controls}
    <Editor
      scenario={scenarioState}
      onedit={(ev) => (scenarioState = ev)}
      onsetmaxsize={() =>
        (scenarioState.size = {
          width: "100%",
          height: "100%",
        })}
    />
    <Events {events} />
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
    grid-template: 3fr 2fr / 2fr 1fr;
  }
  .instance {
    display: grid;
    margin: 0.1em;
    grid-row: 1 / -1;
  }
  @media (max-width: 500px) {
    .grid {
      grid-template: 3fr 2fr 1fr / 1fr;
    }
    .instance {
      grid-row: 1 / 1;
    }
  }
</style>
