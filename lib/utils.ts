/**
 * Minimal className combiner. Swap for `clsx` + `tailwind-merge` once the
 * component library grows beyond the scaffold.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
