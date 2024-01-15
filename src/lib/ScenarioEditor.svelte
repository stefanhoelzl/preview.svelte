<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { ScenarioState } from "$lib/Preview.svelte";

  const dispatch = createEventDispatcher<{
    edit: ScenarioState;
  }>();

  export let scenario: ScenarioState;

  function update(raw: string) {
    try {
      dispatch("edit", JSON.parse(raw));
    } catch {
      // ignore
    }
  }
</script>

<textarea class="scenario" on:input={(e) => update(e.currentTarget.value)}>
  {JSON.stringify(scenario, null, 2)}
</textarea>

<style>
  .scenario {
    font-family: monospace;
    resize: none;
    border: 1px solid silver;
  }
</style>
