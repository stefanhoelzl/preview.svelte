<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let color = "blue";

  const dispatch = createEventDispatcher<{
    click: string;
  }>();
</script>

<div class="mock" style:background-color={color}>
  <button on:click={() => dispatch("click", color)}> CLICK ME! </button>
  <slot />
</div>

<style>
  .mock {
    width: 100%;
    height: 100%;
  }
</style>
