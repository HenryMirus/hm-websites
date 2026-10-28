-- Vorlagen für die Standard-Benachrichtigungen im Portal (neue Nachricht,
-- Meilenstein). lib/email/systemTemplates.ts hält dieselben Texte als Fallback.
-- Legt nur an, was fehlt; im Portal bearbeitete Fassungen bleiben.

insert into public.email_templates (key, name, subject, heading, body_html, preheader, accent, icon_char, icon_bg, icon_border, cta_label, cta_href, cta_bg, note_text, is_system)
select $tpl$notify_new_message_client$tpl$,
       $tpl$Neue Nachricht → Kunde$tpl$,
       $tpl$Neue Nachricht von HM Labs$tpl$,
       $tpl$Neue Nachricht von HM Labs$tpl$,
       $tpl$<p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;">Hallo {{client_name}}, Sie haben eine neue Nachricht im Kundenportal. Melden Sie sich an, um sie zu lesen und zu antworten.</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td style="background-color:#09090F;border:1px solid #1E1E2E;border-left:3px solid #4F7FFF;border-radius:8px;padding:14px 16px;"><p style="margin:0;font-size:13px;color:#8888AA;line-height:1.6;white-space:pre-wrap;">{{preview}}</p></td></tr></table>$tpl$,
       $tpl$Sie haben eine neue Nachricht im Kundenportal.$tpl$,
       $tpl$linear-gradient(90deg,#4F7FFF 0%,#7B9FFF 100%)$tpl$,
       $tpl$&#x2709;$tpl$,
       $tpl$rgba(79,127,255,0.10)$tpl$,
       $tpl$rgba(79,127,255,0.22)$tpl$,
       $tpl$Nachricht öffnen$tpl$,
       $tpl${{portal_url}}/messages$tpl$,
       $tpl$#2A5CE8$tpl$,
       $tpl$Bitte antworten Sie im Portal, nicht auf diese E-Mail, damit alles an einem Ort bleibt.$tpl$,
       true
where not exists (select 1 from public.email_templates where key = $tpl$notify_new_message_client$tpl$);

insert into public.email_templates (key, name, subject, heading, body_html, preheader, accent, icon_char, icon_bg, icon_border, cta_label, cta_href, cta_bg, note_text, is_system)
select $tpl$notify_new_message_admin$tpl$,
       $tpl$Neue Nachricht → Admins$tpl$,
       $tpl$Neue Nachricht von {{client_name}}$tpl$,
       $tpl$Nachricht von {{client_name}}$tpl$,
       $tpl$<p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;"><strong style="color:#EEEEFF;">{{client_name}}</strong> hat eine neue Nachricht im Portal gesendet.</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td style="background-color:#09090F;border:1px solid #1E1E2E;border-left:3px solid #FF4D6A;border-radius:8px;padding:14px 16px;"><p style="margin:0;font-size:13px;color:#8888AA;line-height:1.6;white-space:pre-wrap;">{{preview}}</p></td></tr></table>$tpl$,
       $tpl${{client_name}} hat im Portal geschrieben.$tpl$,
       $tpl$linear-gradient(90deg,#FF4D6A 0%,#FF7A8A 100%)$tpl$,
       $tpl$&#x1F514;$tpl$,
       $tpl$rgba(255,77,106,0.10)$tpl$,
       $tpl$rgba(255,77,106,0.22)$tpl$,
       $tpl$Im Portal öffnen$tpl$,
       $tpl${{portal_url}}/messages/{{client_id}}$tpl$,
       $tpl$#FF4D6A$tpl$,
       null,
       true
where not exists (select 1 from public.email_templates where key = $tpl$notify_new_message_admin$tpl$);

insert into public.email_templates (key, name, subject, heading, body_html, preheader, accent, icon_char, icon_bg, icon_border, cta_label, cta_href, cta_bg, note_text, is_system)
select $tpl$notify_milestone_reached$tpl$,
       $tpl$Meilenstein erreicht → Kunde$tpl$,
       $tpl$Meilenstein erreicht: {{milestone_name}}$tpl$,
       $tpl$Meilenstein erreicht$tpl$,
       $tpl$<p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;">Hallo {{client_name}}, in Ihrem Projekt <strong style="color:#EEEEFF;">{{project_name}}</strong> ist ein Meilenstein abgeschlossen:</p><p style="margin:0 0 24px;font-size:16px;color:#EEEEFF;line-height:1.6;">&#10003;&nbsp; {{milestone_name}}</p><p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;">Im Portal sehen Sie den aktuellen Stand aller Meilensteine und Aufgaben.</p>$tpl$,
       $tpl${{milestone_name}} in {{project_name}} ist abgeschlossen.$tpl$,
       $tpl$linear-gradient(90deg,#22C55E 0%,#4ADE80 100%)$tpl$,
       $tpl$&#10003;$tpl$,
       $tpl$rgba(34,197,94,0.10)$tpl$,
       $tpl$rgba(34,197,94,0.22)$tpl$,
       $tpl$Projekt ansehen$tpl$,
       $tpl${{project_url}}$tpl$,
       $tpl$#16A34A$tpl$,
       null,
       true
where not exists (select 1 from public.email_templates where key = $tpl$notify_milestone_reached$tpl$);
