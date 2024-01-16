<script lang="ts">
  import Preview, { type Scenarios } from "$lib/Preview.svelte";
  import Mock from "./Mock.svelte";

  const emits = ["click"];
  const scenarios: Scenarios<Mock> = {
    blue: {
      props: { color: "blue" },
    },
    red: {
      props: { color: "red" },
    },
    green: {
      props: { color: "green" },
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

<Preview component={Mock} {emits} {scenarios} />
