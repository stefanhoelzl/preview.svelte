<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    color?: string;
    dateTime?: Date;
    click: (c: string) => void;
    changeDateTime: (d: Date) => void;
    children?: Snippet;
    custom?: Snippet<[string]>;
  }

  let {
    color = $bindable("blue"),
    dateTime = $bindable(new Date()),
    click,
    changeDateTime,
    children,
    custom,
  }: Props = $props();

  let choices = ["blue", "red", "green"];
</script>

<div class="mock" style:background-color={color}>
  <select bind:value={color}>
    {#each choices as choice (choice)}
      <option selected={choice === color}>{choice}</option>
    {/each}
  </select>
  <button onclick={() => click(color)}> CLICK ME! </button>
  <br />
  <input
    type="datetime-local"
    value={dateTime.toISOString().slice(0, 16)}
    onchange={(ev) => {
      const newDateTime = new Date(ev.currentTarget?.value);
      if (isNaN(newDateTime.valueOf())) return;
      dateTime = newDateTime;
      changeDateTime(newDateTime);
    }}
  />
  <div class="slot">{@render children?.()}</div>
  <div class="custom">{@render custom?.(color)}</div>
</div>

<style>
  .mock {
    width: 100%;
    height: 100%;
  }
  .slot {
    color: white;
    font-weight: bold;
    font-size: x-large;
  }
</style>
