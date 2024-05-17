import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";
import { createDynamicComponent } from "./setup.js";
import Preview from "$lib/Preview.svelte";

test("sets scenario size", async () => {
  const C = await createDynamicComponent("<div />");
  const { container } = render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: { size: { width: "100px", height: "200px" } },
      },
    },
  });

  expect(container.querySelector(".resizeable")).toHaveStyle("width: 100px");
  expect(container.querySelector(".resizeable")).toHaveStyle("height: 200px");
});

test("sets css", async () => {
  const C = await createDynamicComponent("<div />");
  const { container } = render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: { css: { width: "100px" } },
      },
    },
  });

  expect(container.querySelector(".view")).toHaveStyle("width: 100px");
});
