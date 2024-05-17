import { render, screen, fireEvent } from "@testing-library/svelte";
import { expect, test } from "vitest";
import { createDynamicComponent, withTemporaryModule } from "./setup.js";
import Preview from "$lib/Preview.svelte";

test("shows grid by default", async () => {
  const C = await createDynamicComponent("<div>component</div>");
  render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: {},
        b: {},
        c: {},
      },
    },
  });

  expect(screen.queryAllByText("component")).toHaveLength(3);
});

test("shows single instance when hash is set", async () => {
  const C = await createDynamicComponent("<div>component</div>");
  window.location.hash = "a";
  render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: {},
        b: {},
        c: {},
      },
    },
  });
  expect(screen.queryAllByText("component")).toHaveLength(1);
});

test("shows single instance when only one scenario is defined", async () => {
  const C = await createDynamicComponent("<div>component</div>");
  window.location.hash = "a";
  render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: {},
      },
    },
  });

  expect(screen.getByText("a").className).contains("selected");
  expect(screen.getByText("GRID").className).not.contains("selected");
});

test("switch between grid and single instance", async () => {
  const C = await createDynamicComponent("<div>component</div>");
  render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: {},
        b: {},
        c: {},
      },
    },
  });

  await fireEvent.click(screen.getByText("a"));
  expect(screen.queryAllByText("component")).toHaveLength(1);

  await fireEvent.click(screen.getByText("GRID"));
  expect(screen.queryAllByText("component")).toHaveLength(3);
});

test("shows scenarios with different props", async () => {
  const C = await createDynamicComponent(`
    <script>
      export let text;
    </script>
    <div>{text}</div>
  `);
  render(Preview, {
    props: {
      component: C,
      scenarios: {
        a: { props: { text: "scenario a" } },
        b: { props: { text: "scenario b" } },
        c: { props: { text: "scenario c" } },
      },
    },
  });
  expect(screen.queryByText("scenario a")).toBeInTheDocument();
  expect(screen.queryByText("scenario b")).toBeInTheDocument();
  expect(screen.queryByText("scenario c")).toBeInTheDocument();
});

test("shows slot data", async () => {
  const P = await withTemporaryModule(
    "<div>slot: <slot /></div>",
    async (modulePath) => {
      return await createDynamicComponent(`
      <script>
        import Preview from "$lib/Preview.svelte";
        import C from "${modulePath}";
        
        const scenarios = {a: {slotData: "content"}};
      </script>
      <Preview component={C} {scenarios} let:slotData>{slotData}</Preview>
    `);
    },
  );
  render(P);

  expect(screen.queryByText("slot: content")).toBeInTheDocument();
});

test("set window title to component name by default", async () => {
  const C = await createDynamicComponent("<div />");
  window.document.title = "";
  render(Preview, { props: { component: C, scenarios: { a: {} } } });
  expect(window.document.title).toBe("Component");
});

test("do not change window title", async () => {
  const C = await createDynamicComponent("<div />");
  window.document.title = "title";
  render(Preview, {
    props: { setTitle: false, component: C, scenarios: { a: {} } },
  });
  expect(window.document.title).toBe("title");
});
