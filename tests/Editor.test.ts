import { render, screen, fireEvent } from "@testing-library/svelte";
import { expect, test } from "vitest";
import { createDynamicComponent } from "./setup.js";
import Preview from "$lib/Preview.svelte";

test("shows scenario props", async () => {
  const C = await createDynamicComponent("<div />");
  const scenario = { props: { number: 1, string: "string" } };
  const { container } = render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: scenario,
      },
    },
  });

  expect(JSON.parse(container.querySelector("textarea")!.value)).toEqual(
    scenario,
  );
});

test("updates scenario props", async () => {
  const C = await createDynamicComponent(`
    <script>
      export let text;
    </script>
    <div>{text}</div>
  `);
  const { container } = render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: { props: { text: "" } },
      },
    },
  });

  await fireEvent.input(container.querySelector("textarea")!, {
    target: {
      value: JSON.stringify({
        props: { text: "updated" },
      }),
    },
  });

  expect(screen.queryByText("updated")).toBeInTheDocument();
});
