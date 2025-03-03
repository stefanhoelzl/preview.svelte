<script lang="ts" generics="C extends Component, S">
  import { stringifyJSObj, unstringifyJSObj } from "$lib/StringifyJSObj.js";
  import type { Scenario } from "$lib/Preview.svelte";
  import type { Component } from "svelte";

  interface Props {
    scenario: Scenario<C, S>;
    onedit: (e: Scenario<C, S>) => void;
    onsetmaxsize: () => void;
  }

  let { scenario, onedit, onsetmaxsize }: Props = $props();

  function update(raw: string) {
    let value: Scenario<C, S>;
    try {
      value = unstringifyJSObj(raw) as Scenario<C, S>;
      stringifyJSObj(value); // ensure value is stringifyable again
    } catch {
      return; // ignore errors
    }
    onedit(value);
  }
</script>

<div>
  <textarea oninput={(e) => update(e.currentTarget.value)} wrap="soft">
    {stringifyJSObj(scenario)}
  </textarea>
  <button onclick={() => onsetmaxsize()}>Set Max Size</button>
</div>

<style>
  textarea {
    font-family: monospace;
    resize: none;
    border: 1px solid silver;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  button {
    position: relative;
    bottom: 35px;
    right: calc(-100% + 7em);
    z-index: 1;
  }
</style>
