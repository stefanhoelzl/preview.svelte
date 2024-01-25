<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let color = "blue";
  export let dateTime = new Date();

  let choices = ["blue", "red", "green"];

  const dispatch = createEventDispatcher<{
    click: string;
    changeDateTime: Date;
  }>();
</script>

<div class="mock" style:background-color={color}>
  <select bind:value={color}>
    {#each choices as choice}
      <option selected={choice === color}>{choice}</option>
    {/each}
  </select>
  <button on:click={() => dispatch("click", color)}> CLICK ME! </button>
  <br />
  <input
    type="datetime-local"
    value={dateTime.toISOString().slice(0, 16)}
    on:change={(ev) => {
      dateTime = new Date(ev.currentTarget?.value);
      dispatch("changeDateTime", dateTime);
    }}
  />
  <slot />
</div>

<style>
  .mock {
    width: 100%;
    height: 100%;
  }
</style>
