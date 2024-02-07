<script lang="ts" generics="_C extends SvelteComponent, _S">
  import type { SvelteComponent } from "svelte"; // eslint-disable-line @typescript-eslint/no-unused-vars
  import { createEventDispatcher } from "svelte";
  import { stringifyJSObj, unstringifyJSObj } from "$lib/StringifyJSObj.js";
  import type { Scenario } from "$lib/Preview.svelte";

  const dispatch = createEventDispatcher<{
    edit: Scenario<C, S>;
  }>();

  // _C is defined in the `generics` attribute of the `script` tag
  // but this is not recognized by eslint
  type C = _C; // eslint-disable-line no-undef
  type S = _S; // eslint-disable-line no-undef

  export let scenario: Scenario<C, S>;

  function update(raw: string) {
    let value: Scenario<C, S>;
    try {
      value = unstringifyJSObj(raw) as Scenario<C, S>;
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
