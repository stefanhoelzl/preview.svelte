<script lang="ts">
  import { type ComponentType } from "svelte";
  import { type Scenario, type CSS } from "$lib/Preview.svelte";
  import EventViewer from "$lib/ScenarioEvents.svelte";
  import ScenarioEditor from "$lib/ScenarioEditor.svelte";
  import Instance from "$lib/ScenarioInstance.svelte";

  export let key: string;
  export let component: ComponentType;
  export let scenario: Scenario;
  export let defaultCss: CSS = {};
  export let emits: string[] = [];

  let _scenario = {
    props: scenario.props,
    css: scenario.css || defaultCss,
    size: {
      width: scenario.size?.width || "100%",
      height: scenario.size?.height || "100%",
      children: scenario.size?.children || 0,
    },
  };

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
</script>

<div id={key} class="scenario">
  <a href="#{key}" class="nav">{key}</a>
  <div class="content">
    <Instance
      {component}
      bind:scenario={_scenario}
      {emits}
      on:event={(e) => eventHandler(key, e.detail)}
    />
    <ScenarioEditor
      scenario={_scenario}
      on:edit={(e) => (_scenario = e.detail)}
    />
    <div class="event-viewer">
      <EventViewer events={_events[key] || []} />
    </div>
  </div>
</div>

<style>
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
