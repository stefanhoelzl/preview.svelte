<script lang="ts">
  import Preview, { type Scenarios } from "$lib/Preview.svelte";
  import Mock from "./Mock.svelte";

  const emits = ["click"];
  const scenarios: Scenarios<Mock> = {
    blue: {
      props: { color: "blue" },
    },
    red: {
      props: { color: "blue" },
    },
  };
</script>

<Preview component={Mock} {emits} {scenarios} />
