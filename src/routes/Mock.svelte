<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let color = "blue";

  let choices = ["blue", "red", "green"];

  const dispatch = createEventDispatcher<{
    click: string;
  }>();
</script>

<div class="mock" style:background-color={color}>
  <select bind:value={color}>
    {#each choices as choice}
      <option selected={choice === color}>{choice}</option>
    {/each}
  </select>
  <button on:click={() => dispatch("click", color)}> CLICK ME! </button>
  <slot />
</div>

<style>
  .mock {
    width: 100%;
    height: 100%;
  }
</style>
