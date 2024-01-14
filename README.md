# preview.svelte

## usage
```svelte
<script lang="ts">
  import Preview, { type Scenarios } from "preview.svelte";
  import YourComponent from "$lib/YourComponent.svelte";
  
  // list all events you want to see when dispatched
  const emits = ["click"];
  
  // each scenario gets rendered in the preview
  const scenarios: Scenarios<YourComponent> = {
    scenarioName: {
      props: {},
      css: {}, // css styles applied to this scenario
      size: { width: 100px, height: 100% } // restrict size available to the component
    },
  };
  
  // default css styles are applied to all scenarios
  const defaultCss = { opacity: "0.5" }
</script>

<Preview component={YourComponent} {emits} {scenarios} {defaultCss} />
```

## dev

```bash
npm run dev
npm run lint -- --fix .
npm run check
```

## test locally with another project
```bash
[dev]$ git clone https://github.com/stefanhoelzl/preview.svelte.git
[dev]$ cd project  # your project you want `preview.svelte` to use with
[dev/project]$ npm link ../preview.svelte

# when making changes to `preview.svelte` run:
[dev/preview.svelte]$ npm run package

# the changes to `preview.svelte` are now available in your project
```
