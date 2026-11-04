// Node-Loader für die Mail-Skripte: löst den Alias "@/…" (tsconfig paths) auf
// und ergänzt fehlende ".ts"-Endungen. So laufen die Skripte mit reinem Node
// (--experimental-strip-types), ohne tsx/ts-node als Zusatzabhängigkeit.
// Einstieg: scripts/register-ts-alias.mjs

import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import { existsSync } from "node:fs";

const root = process.cwd();

export async function resolve(specifier, context, nextResolve) {
  const isAlias = specifier.startsWith("@/");
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
  if (!isAlias && !isRelative) return nextResolve(specifier, context);

  const base = isAlias
    ? path.join(root, specifier.slice(2))
    : path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);

  const hit = [base, `${base}.ts`, path.join(base, "index.ts")].find(
    (f) => path.extname(f) === ".ts" && existsSync(f)
  );
  return hit ? nextResolve(pathToFileURL(hit).href, context) : nextResolve(specifier, context);
}
