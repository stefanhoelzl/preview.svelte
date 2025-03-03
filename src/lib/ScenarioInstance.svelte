<script lang="ts" generics="C extends Component">
  import { onMount, mount, onDestroy, unmount, type Component } from "svelte";
  import Resizeable from "$lib/Resizeable.svelte";
  import { type Scenario, EventHandler, type Event } from "$lib/Preview.svelte";

  interface Props {
    component: Component<C>;
    scenario: Scenario<C>;
    onevent: (ev: Event) => void;
  }

  let { component, scenario = $bindable(), onevent }: Props = $props();

  let instanceProps = $state({});

  function isSnippet(maybeSnippet: unknown): boolean {
    // could not find a better way to check if a prop is a snippet
    return (
      typeof maybeSnippet === "function" &&
      !!maybeSnippet
        .toString()
        .match(
          /var previous_component_function = dev_current_component_function;/,
        )
    );
  }

  if (scenario.props !== undefined) {
    Object.entries(scenario.props).forEach(([key, value]) => {
      if (value instanceof EventHandler) {
        // inject event handlers for event properties

        // @ts-expect-error unknown type of ...[key]
        delete scenario.props[key];
        // @ts-expect-error unknown type of ...[key]
        instanceProps[key] = (...e: unknown[]) =>
          onevent(value.eventParser(key, e));
      } else if (isSnippet(value)) {
        // not sure why this is needed exactly,
        // but without is an anchor is undefined error is thrown

        // @ts-expect-error unknown type of ...[key]
        instanceProps[key] = value;
        // @ts-expect-error unknown type of ...[key]
        delete scenario.props["key"];
      } else {
        // synchronizes changes between scenario.props and instanceProps

        // @ts-expect-error unknown type of ...[key]
        $effect(() => (instanceProps[key] = scenario.props[key]));
        // @ts-expect-error unknown type of ...[key]
        $effect(() => (scenario.props[key] = instanceProps[key]));
      }
    });
  }

  let target: Element;
  onMount(() => {
    // @ts-expect-error instanceProps does not match MountOptions<C>
    const app = mount(component, { target, props: instanceProps });
    onDestroy(() => unmount(app));
  });
</script>

<div class="container">
  <Resizeable
    height={scenario.size?.height ?? "100%"}
    width={scenario.size?.width ?? "100%"}
    onsetsize={(ev) => (scenario.size = ev)}
  >
    <div
      bind:this={target}
      class="view"
      style={Object.entries(scenario.css ?? {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ")}
    ></div>
  </Resizeable>
</div>

<style>
  .view {
    height: 100%;
    width: 100%;
  }
</style>
