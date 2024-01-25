<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { stringifyJSObj, unstringifyJSObj } from "$lib/StringifyJSObj.js";
  import type { ScenarioState } from "$lib/Preview.svelte";

  const dispatch = createEventDispatcher<{
    edit: ScenarioState;
  }>();

  export let scenario: ScenarioState;

  function update(raw: string) {
    let value: ScenarioState;
    try {
      value = unstringifyJSObj(raw) as ScenarioState;
      stringifyJSObj(value); // ensure value is stringifyable again
    } catch {
      return; // ignore errors
    }
    dispatch("edit", value);
  }
</script>

<textarea
  class="scenario"
  on:input={(e) => update(e.currentTarget.value)}
  wrap="off"
  >{stringifyJSObj(scenario)}
</textarea>

<style>
  .scenario {
    font-family: monospace;
    resize: none;
    border: 1px solid silver;
  }
</style>
