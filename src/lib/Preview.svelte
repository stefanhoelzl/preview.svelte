<script lang="ts" context="module">
  import { type ComponentProps, type SvelteComponent } from "svelte";

  export type CSS = Record<string, string>;

  type ScenarioSize = { width?: string; height?: string; children?: number };
  export type Scenario<C extends SvelteComponent = SvelteComponent> = {
    props: ComponentProps<C>;
    css?: CSS;
    size?: ScenarioSize;
  };
  export type Scenarios<C extends SvelteComponent> = {
    [key: string]: Scenario<C>;
  };

  export type ScenarioState = Required<Scenario> & {
    size: Required<ScenarioSize>;
  };
</script>

<script lang="ts" generics="_C extends SvelteComponent">
  import { onMount, type ComponentType, type ComponentEvents } from "svelte";
  import EventViewer from "$lib/EventViewer.svelte";
  import ScenarioEditor from "$lib/ScenarioEditor.svelte";
  import Instance from "$lib/Instance.svelte";

  // _C is defined in the `generics` attribute of the `script` tag
  // but this is not recognized by eslint
  type C = _C; // eslint-disable-line no-undef

  export let component: ComponentType<C>;
  export let scenarios: Scenarios<C>;
  export let defaultCss: CSS = {};
  export let emits: Extract<keyof ComponentEvents<C>, string>[] = [];

  let _scenarios: Record<string, ScenarioState> = Object.fromEntries(
    Object.entries(scenarios).map(([k, d]) => [
      k,
      {
        props: d.props,
        css: d.css || defaultCss,
        size: {
          width: d.size?.width || "100%",
          height: d.size?.height || "100%",
          children: d.size?.children || 0,
        },
      },
    ]),
  );

  let _events: Record<string, unknown[]> = {};
  function eventHandler(key: string, event: Event) {
    const eventObject: Record<string, unknown> = {};
    for (let prop in event) {
      const value = event[prop as keyof Event];
      if (value instanceof Node || value instanceof Window) continue;
      eventObject[prop] = value;
    }

    if (!_events[key]) _events[key] = [];
    _events[key] = [..._events[key]!, eventObject];
    _events = _events;
  }

  onMount(() => {
    if (!window.location.hash)
      window.location.hash = Object.keys(_scenarios)[0] || "";
  });

  onMount(() => {
    window.document.title =
      window.location.pathname.split("/").pop() || "Preview";
  });
</script>

<div class="preview">
  {#each Object.entries(_scenarios) as [key, definition] (key)}
    <div id={key} class="scenario">
      <a href="#{key}" class="nav">{key}</a>
      <div class="content">
        <Instance
          {component}
          bind:scenario={_scenarios[key]}
          {emits}
          on:event={(e) => eventHandler(key, e.detail)}
        />
        <ScenarioEditor
          bind:scenario={definition}
          on:edit={(e) => (_scenarios[key] = e.detail)}
        />
        <div class="event-viewer">
          <EventViewer events={_events[key] || []} />
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  * {
    --padding: 5px;
    --nav-height: calc(2em + var(--padding) + var(--padding));
    --preview-height: calc(100vh - var(--nav-height) - 1em);
  }

  .preview {
    position: relative;
    height: var(--preview-height);
    width: calc(100% - 1em);
    padding: var(--padding);
    background-color: whitesmoke;
  }

  .nav {
    position: relative;
    float: left;
    text-decoration: none;
    color: black;
    padding: var(--padding);
    border: 1px solid silver;
    border-bottom: 0 white;
  }

  .content {
    position: absolute;
    top: var(--nav-height);
    width: 100%;
    height: 100%;
    display: grid;
    grid-gap: var(--padding);
    grid-template: 3fr 1fr / 2fr minmax(200px, 1fr);
  }

  .scenario:not(:target) > .nav {
    background: lightsteelblue;
  }
  .scenario:not(:target) > .content {
    display: none;
  }

  .event-viewer {
    display: table-row;
    grid-column: 1 / -1;
    overflow: auto;
  }
</style>
