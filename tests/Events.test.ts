import { render, screen, fireEvent } from "@testing-library/svelte";
import { expect, test } from "vitest";
import { createDynamicComponent } from "./setup.js";
import Preview from "$lib/Preview.svelte";

test("shows events", async () => {
  const C = await createDynamicComponent(`
  <script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let counter = 0;
  </script>
  
  <button on:click={() => {counter++; dispatch("click", counter);}}>count</button>
  `);
  const { container } = render(Preview, {
    props: {
      component: C,
      emits: ["click"],
      scenarios: {
        a: {},
      },
    },
  });

  await fireEvent.click(screen.getByText("count"));
  await fireEvent.click(screen.getByText("count"));
  await fireEvent.click(screen.getByText("count"));
  await fireEvent.click(screen.getByText("count"));

  expect(
    Array.from(container.querySelectorAll(".events summary")).map(
      (s) => s.textContent,
    ),
  ).toEqual(["click(4)", "click(3)", "click(2)", "click(1)"]);
});
