-- Portal-Dateien: Uploads durch den Kunden im Projekt und im Chat
--
-- Bisher konnte nur der Admin Dateien anlegen, hängend am Kunden (und optional
-- an einem Projekt). Neu:
--   scope            wo die Datei hängt: client (Kundenprofil, projektübergreifend),
--                    project (an einem Projekt), chat (Anhang einer Nachricht)
--   message_id       gesetzt, sobald ein Chat-Anhang tatsächlich abgeschickt wurde
--   uploaded_by_role wer sie hochgeladen hat (Anzeige „vom Kunden")
--   source_file_id   Herkunft, wenn eine Projekt-/Chat-Datei ins Kundenprofil
--                    übernommen wurde
--
-- Anwendbar auf Projekt zoyvsobztyqdaqdffrbo (hm-websites).

alter table public.client_files
  add column if not exists message_id uuid references public.messages(id) on delete cascade,
  add column if not exists scope text,
  add column if not exists uploaded_by_role text,
  add column if not exists source_file_id uuid references public.client_files(id) on delete set null;

-- Bestand einsortieren: was an einem Projekt hängt, ist eine Projektdatei
update public.client_files
set scope = case when project_id is not null then 'project' else 'client' end
where scope is null;

alter table public.client_files alter column scope set default 'client';
alter table public.client_files alter column scope set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'client_files_scope_check') then
    alter table public.client_files
      add constraint client_files_scope_check check (scope in ('client', 'project', 'chat'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'client_files_uploaded_by_role_check') then
    alter table public.client_files
      add constraint client_files_uploaded_by_role_check
      check (uploaded_by_role is null or uploaded_by_role in ('admin', 'client'));
  end if;
end $$;

create index if not exists client_files_project_id_idx on public.client_files (project_id);
create index if not exists client_files_message_id_idx on public.client_files (message_id);
create index if not exists client_files_client_scope_idx on public.client_files (client_id, scope);

-- RLS: der Kunde darf eigene Dateien in seinen Projekten und im Chat anlegen
-- und eigene Uploads wieder entfernen. Das Kundenprofil (scope='client')
-- bleibt dem Admin vorbehalten. Die App schreibt zwar über den Service-Key,
-- aber die Policies sind die zweite Sicherung für direkten API-Zugriff.
drop policy if exists client_files_client_insert on public.client_files;
create policy client_files_client_insert on public.client_files
  for insert
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
    and client_id in (select id from public.clients where auth_user_id = auth.uid())
  );
