<script lang="ts">
  import Preview, { type Scenarios, eventHandler } from "$lib/Preview.svelte";
  import Mock from "./Mock.svelte";

  const events = { click: eventHandler(), changeDateTime: eventHandler() };
  const scenarios: Scenarios<typeof Mock> = {
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
      props: { color: "green", children, ...events },
    },
    yellow: {
      props: { color: "yellow", custom, ...events },
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

{#snippet custom(color: string)}
  Hello, {color}!
{/snippet}

{#snippet children()}
  Hello, Snippet!
{/snippet}

<Preview component={Mock} {scenarios}></Preview>
