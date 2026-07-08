/**
 * HM-Monogramm — „hm" als eine durchgehende Leiterbahn (CI §4 Logo-Richtung):
 * ein Linienzug, 45°-Knicke, beginnt und endet in je einem Via.
 * Einfarbig in der Textfarbe der Fläche; die Vias sind der einzige Kupfer-Punkt.
 *
 * Server-Komponente — die Trace-Draw-Animation (Stroke-Draw-on, 0,9 s beim
 * Laden) übernimmt TraceDraw/GSAP über die Klasse `monogram-trace`.
 */
export default function Monogram({
  size = 28,
  className = "",
  animate = false,
  pathClassName,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
  /** z. B. "trace-path" für TraceDraw-Scroll-Zeichnung */
  pathClassName?: string;
}) {
  return (
    <svg
      width={size * (48 / 40)}
      height={size}
      viewBox="0 0 48 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 8 V21 L9 25 H13 L17 21 V15 L21 11 H25 L29 15 V21 L33 25 H36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className={
          [animate ? "monogram-trace" : "", pathClassName ?? ""]
            .filter(Boolean)
            .join(" ") || undefined
        }
        pathLength={100}
      />
      <circle cx="5" cy="5.5" r="2.4" stroke="var(--kupfer)" strokeWidth="1.8" />
      <circle cx="39" cy="25" r="2.4" stroke="var(--kupfer)" strokeWidth="1.8" />
    </svg>
  );
}
