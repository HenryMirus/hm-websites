-- Portal-Dateien: Bearbeiten (Umbenennen, Kategorie, Zuordnung)
--
-- Die App schreibt über den Service-Key und prüft die Rechte in
-- `PATCH /api/portal/files/[id]`. Diese Policies sind die zweite Sicherung für
-- direkten API-Zugriff und ziehen nach, was mit dem Bearbeiten dazugekommen ist:
--
--   1. Der Kunde darf eigene Uploads ändern, solange sie im Projekt oder im
--      Chat liegen. `scope` steht in USING und WITH CHECK, damit er eine Datei
--      nicht ins Kundenprofil schieben kann — das bleibt HM Labs vorbehalten.
--   2. Die Delete-Policy bekommt dieselbe scope-Schranke. Bisher hing sie nur
--      am Upload; seit Dateien ins Kundenprofil verschoben werden können,
--      könnte der Kunde sonst eine Profildatei löschen, die einmal von ihm kam.
--
-- Anwendbar auf Projekt zoyvsobztyqdaqdffrbo (hm-websites).
-- Setzt die Migration 2026-09-06_client_project_chat_files.sql voraus.

drop policy if exists client_files_client_update on public.client_files;
create policy client_files_client_update on public.client_files
  for update
  using (
    uploaded_by = auth.uid()
    and scope in ('project', 'chat')
    and client_id in (select id from public.clients where auth_user_id = auth.uid())
  )
  with check (
    uploaded_by = auth.uid()
    and scope in ('project', 'chat')
    and client_id in (select id from public.clients where auth_user_id = auth.uid())
    and (
      project_id is null
      or project_id in (
        select p.id from public.projects p
        where p.client_id in (select id from public.clients where auth_user_id = auth.uid())
      )
    )
  );

drop policy if exists client_files_client_delete on public.client_files;
create policy client_files_client_delete on public.client_files
  for delete
  using (
    uploaded_by = auth.uid()
    and scope in ('project', 'chat')
    and client_id in (select id from public.clients where auth_user_id = auth.uid())
  );
