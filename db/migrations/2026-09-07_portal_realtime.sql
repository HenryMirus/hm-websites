-- Portal: automatische Aktualisierung
--
-- Das Portal aktualisiert sich seit dieser Änderung ereignisgesteuert statt auf
-- Knopfdruck: die Client-Komponente `app/portal/_components/RealtimeRefresh.tsx`
-- hört auf Änderungen an den unten stehenden Tabellen und holt daraufhin die
-- Server-Daten neu. Damit Supabase diese Änderungen überhaupt ausliefert,
-- müssen die Tabellen in der Publication `supabase_realtime` stehen.
--
-- Vorher drin: messages, tasks. Alles andere fehlte, deshalb blieben Leads,
-- Projekte, Kunden und Meilensteine bis zum manuellen Neuladen stehen.
--
-- Sicherheit: Realtime prüft jede Zeile gegen dieselben RLS-Policies wie eine
-- normale Abfrage. Ein Kunde bekommt also nur Ereignisse zu seinen eigenen
-- Zeilen; `contact_submissions` und `clients` haben ausschließlich eine
-- Admin-Policy und erreichen Kunden damit gar nicht.

alter publication supabase_realtime add table public.contact_submissions;
alter publication supabase_realtime add table public.clients;
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.project_milestones;
alter publication supabase_realtime add table public.project_decisions;
alter publication supabase_realtime add table public.project_feedback;
alter publication supabase_realtime add table public.client_files;

-- Beim Löschen enthält das WAL-Ereignis standardmäßig nur den Primärschlüssel.
-- Die Kunden-Policies dieser Tabellen filtern aber über `client_id` bzw.
-- `project_id` — fehlt die Spalte im Ereignis, kann Realtime die Policy nicht
-- auswerten und liefert das Ereignis nicht aus. Der Kunde sähe eine gelöschte
-- Zeile dann bis zum nächsten Seitenwechsel weiter. `replica identity full`
-- legt die vollständige alte Zeile bei; das kostet etwas WAL-Volumen, bei
-- diesen Tabellengrößen vernachlässigbar. `messages` steht bereits auf full.
alter table public.projects           replica identity full;
alter table public.project_milestones replica identity full;
alter table public.tasks              replica identity full;
alter table public.client_files       replica identity full;
