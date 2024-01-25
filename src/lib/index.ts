import Preview from "$lib/Preview.svelte";
import {
  registerCustomType,
  type ConstructorFunc,
  type DestructureFunc,
  type FactoryFunc,
} from "$lib/StringifyJSObj.js";

export type { Scenarios } from "$lib/Preview.svelte";
export default Preview;
export {
  registerCustomType,
  type ConstructorFunc,
  type DestructureFunc,
  type FactoryFunc,
};
