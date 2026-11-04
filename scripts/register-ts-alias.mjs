// Einstieg für `node --import ./scripts/register-ts-alias.mjs`, siehe ts-alias-loader.mjs.
import { register } from "node:module";

register("./ts-alias-loader.mjs", import.meta.url);
