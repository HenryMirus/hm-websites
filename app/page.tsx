import HomePage from "@/components/HomePage";
import { VEROEFFENTLICHTE_PROJEKTE } from "@/lib/kundenprojekte";

// Server Component: filtert die Kundenprojekte hier, damit nur veröffentlichte
// Einträge an den Client gehen (siehe lib/kundenprojekte.ts).
export default function Page() {
  return <HomePage projekte={VEROEFFENTLICHTE_PROJEKTE} />;
}
