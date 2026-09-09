/**
 * Fortschrittsbalken für Meilensteine und Projekte.
 *
 * Bewusst ohne Hooks, damit die Komponente sowohl in Server- als auch in
 * Client-Komponenten eingebunden werden kann.
 *
 * Ein Nenner von 0 ist kein Fehler, sondern der Normalfall am Projektanfang:
 * ein Meilenstein ohne Aufgaben. Er wird als leerer Balken gezeichnet, nicht
 * als 0 % und nicht als NaN.
 */
export default function ProgressBar({
  done,
  total,
  tone = "primary",
  className = "",
}: {
  done: number;
  total: number;
  tone?: "primary" | "green" | "muted";
  className?: string;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;

  const fill =
    complete || tone === "green"
      ? "bg-green-400"
      : tone === "muted"
      ? "bg-text-muted"
      : "bg-primary";

  return (
    <div
      className={`h-1 w-full rounded-full bg-border/60 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={total > 0 ? `${done} von ${total} erledigt` : "Noch keine Aufgaben"}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${fill}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
