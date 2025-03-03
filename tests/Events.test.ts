import { render, screen, fireEvent } from "@testing-library/svelte";
import { expect, test } from "vitest";
import { createDynamicComponent } from "./setup.js";
import Preview, { eventHandler } from "$lib/Preview.svelte";

test("shows events", async () => {
  const C = await createDynamicComponent(`
  <script>
  let { onclick } = $props()
  let counter = $state(0);
  </script>
  
  <button onclick={() => {counter++; onclick(counter);}}>count</button>
  `);
  const { container } = render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: {
          props: {
            onclick: eventHandler((e, c) => ({
              summary: `${e}(${c})`,
              details: "",
            })),
          },
        },
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
  ).toEqual(["onclick(4)", "onclick(3)", "onclick(2)", "onclick(1)"]);
});
