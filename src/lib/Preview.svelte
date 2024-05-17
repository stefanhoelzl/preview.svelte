<script lang="ts" context="module">
  import { type ComponentProps, type SvelteComponent } from "svelte";

  export type CSS = Record<string, string>;

  type ScenarioSize = { width?: string; height?: string };
  export type Scenario<
    C extends SvelteComponent = SvelteComponent,
    S = boolean,
  > = {
    props?: ComponentProps<C>;
    slotData?: S;
    css?: CSS;
    size?: ScenarioSize;
  };
  export type Scenarios<C extends SvelteComponent, S = boolean> = {
    [key: string]: Scenario<C, S>;
  };

  export type ScenarioState = Required<Scenario> & {
    size: Required<ScenarioSize>;
  };
</script>

<script lang="ts" generics="_C extends SvelteComponent, _S">
  import { onMount, type ComponentType, type ComponentEvents } from "svelte";
  import ScenarioView from "$lib/ScenarioView.svelte";

  // _C is defined in the `generics` attribute of the `script` tag
  // but this is not recognized by eslint
  type C = _C; // eslint-disable-line no-undef
  type S = _S; // eslint-disable-line no-undef

  export let component: ComponentType<C>;
  export let scenarios: Scenarios<C, S>;
  export let emits: Extract<keyof ComponentEvents<C>, string>[] = [];
  export let setTitle: boolean = true;
  export let columns = Math.ceil(Math.sqrt(Object.keys(scenarios).length));

  // create copy as array which is iterable AND modifyable
  const editableScenarios = Object.entries(scenarios);

  let selectedScenario: string | undefined = undefined;
  onMount(() => {
    const hash = window.location.hash.slice(1);
    if (scenarios[hash]) selectedScenario = hash;
  });
  $: try {
    window.location.hash = selectedScenario || "";
  } catch {
    // ignore
  }

  $: asGrid = selectedScenario === undefined;

  if (setTitle)
    onMount(() => {
      window.document.title = component.name.replace(
        /Proxy<([A-z0-9]+)>/,
        "$1",
      );
    });
</script>

<div class="preview">
  <div class="nav">
    <button
      class="tab"
      style:margin-right="1em"
      class:selected={asGrid}
      on:click={() => (selectedScenario = undefined)}
    >
      GRID
    </button>
    {#each Object.keys(scenarios) as key}
      <button
        class="tab"
        class:selected={selectedScenario === key}
        on:click={() => (selectedScenario = key)}
      >
        {key}
      </button>
    {/each}
  </div>
  <div class="container" class:grid={asGrid} style:--cols={columns}>
    {#each editableScenarios as [key, scenario] (key)}
      <div
        class="scenario"
        style:display={selectedScenario === key || asGrid ? "flex" : "none"}
      >
        <ScenarioView {component} bind:scenario {emits} controls={!asGrid}>
          {#if scenario.slotData !== undefined}
            <slot slotData={scenario.slotData} />
          {/if}
        </ScenarioView>
      </div>
    {/each}
  </div>
</div>

<style>
  .preview {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--height, 100svh);
    width: var(--width, 100svw);
    display: flex;
    flex-flow: column;
    background-color: whitesmoke;
  }

  .scenario {
    flex: 1 0 1px;
    overflow: scroll;
  }

  .nav {
    display: flex;
  }

  .tab {
    text-decoration: none;
    color: black;
    padding: 0.5em;
    border: 1px solid silver;
    border-bottom: 0 white;
  }

  .tab.selected {
    background-color: lightsteelblue;
  }

  .container {
    display: contents;
  }

  .grid {
    display: grid;
    height: 100%;
    overflow: scroll;
    grid-template-columns: repeat(var(--cols), 1fr);
  }
</style>
