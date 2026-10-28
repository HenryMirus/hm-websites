-- Vorlagen für Website-Anfragen (lib/email/systemTemplates.ts hält dieselben
-- Texte als Fallback). Legt nur an, was fehlt; bearbeitete Fassungen bleiben.

insert into public.email_templates (key, name, subject, heading, body_html, preheader, accent, icon_char, icon_bg, icon_border, cta_label, cta_href, cta_bg, note_text, is_system)
select $tpl$contact_received_admin$tpl$,
       $tpl$Neue Website-Anfrage → Admins$tpl$,
       $tpl$Neue Anfrage von {{name}}$tpl$,
       $tpl$Neue Anfrage über die Website$tpl$,
       $tpl$<p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;"><strong style="color:#EEEEFF;">{{name}}</strong> hat über die Website eine Anfrage gesendet. Eine Antwort auf diese Mail geht direkt an {{email}}.</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;"><tr><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#5A5A7A;width:110px;">E-Mail</td><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#EEEEFF;">{{email}}</td></tr><tr><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#5A5A7A;">Unternehmen</td><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#EEEEFF;">{{company}}</td></tr><tr><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#5A5A7A;">Telefon</td><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#EEEEFF;">{{phone}}</td></tr><tr><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#5A5A7A;">Betreff</td><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#EEEEFF;">{{subject}}</td></tr><tr><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#5A5A7A;">Lead-Score</td><td style="padding:6px 0;font-size:13px;line-height:1.6;vertical-align:top;color:#EEEEFF;">{{lead_score}} ({{lead_tier}})</td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td style="background-color:#09090F;border:1px solid #1E1E2E;border-left:3px solid #FF4D6A;border-radius:8px;padding:14px 16px;"><p style="margin:0;font-size:13px;color:#8888AA;line-height:1.6;white-space:pre-wrap;">{{message}}</p></td></tr></table>$tpl$,
       $tpl${{name}} hat über hm-labs.tech angefragt.$tpl$,
       $tpl$linear-gradient(90deg,#FF4D6A 0%,#FF7A8A 100%)$tpl$,
       $tpl$&#x1F4E9;$tpl$,
       $tpl$rgba(255,77,106,0.10)$tpl$,
       $tpl$rgba(255,77,106,0.22)$tpl$,
       $tpl$Im Portal öffnen$tpl$,
       $tpl${{portal_url}}/leads$tpl$,
       $tpl$#FF4D6A$tpl$,
       null,
       true
where not exists (select 1 from public.email_templates where key = $tpl$contact_received_admin$tpl$);

insert into public.email_templates (key, name, subject, heading, body_html, preheader, accent, icon_char, icon_bg, icon_border, cta_label, cta_href, cta_bg, note_text, is_system)
select $tpl$contact_confirmation_client$tpl$,
       $tpl$Eingangsbestätigung Website-Anfrage → Anfragende$tpl$,
       $tpl$Ihre Anfrage bei HM Labs ist angekommen$tpl$,
       $tpl$Vielen Dank, {{name}}$tpl$,
       $tpl$<p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;">Ihre Anfrage ist bei mir angekommen. Ich sehe sie mir persönlich an und melde mich in der Regel innerhalb eines Werktags bei Ihnen.</p><p style="margin:0 0 20px;font-size:15px;color:#8888AA;line-height:1.7;">Falls Ihnen in der Zwischenzeit noch etwas einfällt, antworten Sie einfach auf diese E-Mail.</p>$tpl$,
       $tpl$Ihre Anfrage ist bei mir angekommen.$tpl$,
       $tpl$linear-gradient(90deg,#4F7FFF 0%,#7B9FFF 100%)$tpl$,
       $tpl$&#x2713;$tpl$,
       $tpl$rgba(79,127,255,0.10)$tpl$,
       $tpl$rgba(79,127,255,0.22)$tpl$,
       $tpl$Leistungen ansehen$tpl$,
       $tpl${{site_url}}/leistungen$tpl$,
       $tpl$#2A5CE8$tpl$,
       null,
       true
where not exists (select 1 from public.email_templates where key = $tpl$contact_confirmation_client$tpl$);
