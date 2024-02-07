<script lang="ts">
  import Preview, { type Scenarios } from "$lib/Preview.svelte";
  import Mock from "./Mock.svelte";

  const emits = ["click", "changeDateTime"];
  const scenarios: Scenarios<Mock, { a: string; b: string }> = {
    blue: {
      props: { color: "blue", dateTime: new Date("2000-01-01T02:00") },
    },
    red: {
      props: { color: "red", dateTime: new Date("2099-12-31T23:59") },
    },
    green: {
      props: { color: "green" },
      slotData: { a: "Hallo", b: "Welt" },
    },
    yellow: {
      props: { color: "yellow" },
    },
    purple: {
      props: { color: "purple" },
    },
    whitesmoke: {
      props: { color: "whitesmoke" },
    },
    lime: {
      props: { color: "lime" },
    },
  };
</script>

<Preview component={Mock} {emits} {scenarios} let:slotData
  >"{slotData?.a}, {slotData?.b}!"</Preview
>
