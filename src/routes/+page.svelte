<script lang="ts">
  import Preview, { type Scenarios, eventHandler } from "$lib/Preview.svelte";
  import Mock from "./Mock.svelte";

  const events = { click: eventHandler(), changeDateTime: eventHandler() };
  const scenarios: Scenarios<typeof Mock, { a: string; b: string }> = {
    blue: {
      props: {
        color: "blue",
        dateTime: new Date("2000-01-01T02:00"),
        ...events,
      },
    },
    red: {
      props: {
        color: "red",
        dateTime: new Date("2099-12-31T23:59"),
        ...events,
      },
    },
    green: {
      props: { color: "green", ...events },
      slotData: { a: "Hello", b: "Slot" },
    },
    yellow: {
      props: { color: "yellow", ...events },
    },
    purple: {
      props: { color: "purple", ...events },
    },
    whitesmoke: {
      props: { color: "whitesmoke", ...events },
    },
    lime: {
      props: { color: "lime", ...events },
    },
  };
</script>

<Preview component={Mock} {scenarios}>
  {#snippet children(slotData)}
    SLOT: "{slotData?.a}, {slotData?.b}!"
  {/snippet}
</Preview>
