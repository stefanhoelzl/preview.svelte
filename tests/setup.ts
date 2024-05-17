import { beforeAll, beforeEach } from "vitest";
import { compile } from "svelte/compiler";
import "@testing-library/jest-dom/vitest";
import { withFile } from "tmp-promise";
import { promisify } from "node:util";
import fs from "node:fs";

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const TmpDir = ".tmp";

beforeAll(async () => {
  await mkdir(TmpDir, { recursive: true });
});

export async function withTemporaryModule<R>(
  code: string,
  cb: (module: string) => Promise<R>,
) {
  const { js } = compile(code, { dev: true });
  return await withFile(
    async ({ path }) => {
      await writeFile(path, js.code);
      return await cb(path);
    },
    { postfix: ".js", tmpdir: TmpDir },
  );
}

export async function createDynamicComponent(code: string) {
  return await withTemporaryModule(code, async (path) => {
    return (await import(path)).default;
  });
}

beforeEach(() => {
  window.location.hash = "";
});
