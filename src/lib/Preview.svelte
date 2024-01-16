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
  import ScenarioView from "$lib/ScenarioView.svelte";

  // _C is defined in the `generics` attribute of the `script` tag
  // but this is not recognized by eslint
  type C = _C; // eslint-disable-line no-undef

  export let component: ComponentType<C>;
  export let scenarios: Scenarios<C>;
  export let defaultCss: CSS = {};
  export let emits: Extract<keyof ComponentEvents<C>, string>[] = [];
  export let setTitle: boolean = true;

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

  onMount(() => {
    if (!window.location.hash)
      window.location.hash = Object.keys(_scenarios)[0] || "";
  });

  if (setTitle)
    onMount(() => {
      window.document.title = component.name.replace(
        /Proxy<([A-z0-9]+)>/,
        "$1",
      );
    });
</script>

<div class="preview">
  {#each Object.entries(_scenarios) as [key, scenario] (key)}
    <ScenarioView {key} {component} {scenario} {emits} />
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
</style>
