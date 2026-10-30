-- SECURITY DEFINER-Funktionen, die bisher jeder per /rest/v1/rpc/ aufrufen
-- konnte (Supabase-Advisor 0028/0029, 30.10.2026). Postgres vergibt EXECUTE
-- standardmäßig an PUBLIC, deshalb reicht es nicht, nur anon zu entziehen.
--
-- - email_exists_in_portal: verriet ohne Login, ob eine Adresse ein
--   Portal-Konto hat. Aufgerufen wird sie nur serverseitig mit dem
--   Service-Role-Key (app/portal/login/_actions.ts).
-- - dispatch_automations_tick: ließ Fremde Automationsläufe anstoßen.
--   Läuft per pg_cron (Job automations-tick) als Owner postgres.
-- - handle_new_user: Trigger-Funktion, wird nie direkt aufgerufen.
--
-- Bewusst NICHT angefasst: get_my_role() — die RLS-Policies rufen sie im
-- Kontext von anon/authenticated auf und bräuchten sonst EXECUTE.

revoke execute on function public.email_exists_in_portal(text) from public, anon, authenticated;
revoke execute on function public.dispatch_automations_tick() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

grant execute on function public.email_exists_in_portal(text) to service_role;
grant execute on function public.dispatch_automations_tick() to service_role;
