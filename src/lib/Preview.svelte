<script lang="ts" module>
  import { type ComponentProps, type Component } from "svelte";
  import { stringifyJSObj } from "./StringifyJSObj.js";

  export type CSS = Record<string, string>;

  type ScenarioSize = { width?: string; height?: string };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Scenario<C extends Component<any, any, any>> = {
    props?: ComponentProps<C>;
    css?: CSS;
    size?: ScenarioSize;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Scenarios<C extends Component<any, any, any>> = {
    [key: string]: Scenario<C>;
  };

  export type Event = { summary: string; details: string };
  type EventParser = (event: string, payload: unknown) => Event;

  export class EventHandler {
    public eventParser: EventParser;
    constructor(eventParser: EventParser) {
      this.eventParser = eventParser;
    }
  }

  export function eventHandler(
    eventParser: EventParser = (evt, payload) => ({
      summary: evt,
      details: stringifyJSObj(payload),
    }),
  ) {
    // return type needs to be mapped to () => void to match the event prop types.
    return new EventHandler(eventParser) as unknown as () => void;
  }
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="C extends Component<any, any, any>">
  import { onMount, type Snippet } from "svelte";
  import ScenarioView from "$lib/ScenarioView.svelte";

  interface Props {
    component: C;
    scenarios: Scenarios<C>;
    setTitle?: boolean;
    columns?: number;
    children?: Snippet<unknown[]>;
  }

  let {
    component,
    scenarios,
    setTitle = true,
    columns = Math.ceil(Math.sqrt(Object.keys(scenarios).length)),
  }: Props = $props();

  let selectedScenario: string | undefined | null = $state(undefined);
  let asGrid = $derived(!selectedScenario);

  onMount(() => {
    const hash = window.location.hash.slice(1);
    if (scenarios[hash]) selectedScenario = hash;
    if (Object.keys(scenarios).length == 1)
      selectedScenario = Object.keys(scenarios)[0];
  });

  $effect(() => {
    try {
      if (selectedScenario !== undefined)
        window.location.hash = selectedScenario || "";
    } catch {
      // ignore
    }
  });

  if (setTitle)
    $effect(() => {
      window.document.title = selectedScenario || "preview.svelte";
    });
</script>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
<div class="preview">
  <div class="nav">
    <button
      class="tab"
      style:margin-right="1em"
      class:selected={asGrid}
      onclick={() => (selectedScenario = null)}
    >
      GRID
    </button>
    {#each Object.keys(scenarios) as key (key)}
      <button
        class="tab"
        class:selected={selectedScenario === key}
        onclick={() => (selectedScenario = key)}
      >
        {key}
      </button>
    {/each}
  </div>
  <div class="container" class:grid={asGrid} style:--cols={columns}>
    {#each Object.keys(scenarios) as key (key)}
      {#if selectedScenario === key || asGrid}
        <div class="scenario">
          <ScenarioView {component} scenario={scenarios[key]} controls={!asGrid}
          ></ScenarioView>
        </div>
      {/if}
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
    display: flex;
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
