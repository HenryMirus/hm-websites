"use client";

/**
 * Kontaktformular (Masterplan §5.7):
 * react-hook-form + Zod · Honeypot statt CAPTCHA · aria-live-Status ·
 * Fehler konkret und handlungsleitend, nie nur farblich markiert.
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LEISTUNGEN, type Lang } from "@/content/leistungen";

const T = {
  name: { de: "Name", en: "Name" },
  email: { de: "E-Mail", en: "Email" },
  company: { de: "Unternehmen (optional)", en: "Company (optional)" },
  interesse: { de: "Womit können wir helfen?", en: "What can we help with?" },
  unsicher: { de: "Weiß ich noch nicht", en: "Not sure yet" },
  nachricht: { de: "Ihre Nachricht", en: "Your message" },
  budget: { de: "Budget-Orientierung (optional)", en: "Budget orientation (optional)" },
  budgetKeine: { de: "Noch keine Vorstellung", en: "No idea yet" },
  datenschutz: {
    de: "Ich habe die Datenschutzerklärung gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage einverstanden.",
    en: "I have read the privacy policy and consent to my details being processed to handle this inquiry.",
  },
  senden: { de: "Anfrage senden", en: "Send inquiry" },
  sendet: { de: "Wird gesendet …", en: "Sending …" },
  erfolgTitel: { de: "Danke — Ihre Anfrage ist da.", en: "Thank you — your inquiry arrived." },
  erfolgText: {
    de: "So geht es weiter: Sie erhalten in der Regel innerhalb eines Werktags eine persönliche Antwort, wir vereinbaren ein kostenloses Erstgespräch, und Sie bekommen eine unverbindliche Einschätzung mit Preisspanne.",
    en: "What happens next: you usually receive a personal reply within one business day, we arrange a free initial consultation, and you get a non-binding assessment with a price range.",
  },
  fehlerServer: {
    de: "Das hat leider nicht geklappt. Bitte versuchen Sie es erneut — oder schreiben Sie uns direkt per E-Mail.",
    en: "That didn't work, unfortunately. Please try again — or email us directly.",
  },
  errName: { de: "Bitte geben Sie Ihren Namen an.", en: "Please enter your name." },
  errEmail: {
    de: "Bitte geben Sie eine gültige E-Mail-Adresse an — sonst können wir nicht antworten.",
    en: "Please enter a valid email address — otherwise we can't reply.",
  },
  errNachricht: {
    de: "Bitte beschreiben Sie kurz Ihr Anliegen (mindestens 10 Zeichen).",
    en: "Please briefly describe your request (at least 10 characters).",
  },
  errDatenschutz: {
    de: "Bitte bestätigen Sie die Datenschutzerklärung, damit wir Ihre Anfrage bearbeiten dürfen.",
    en: "Please confirm the privacy policy so we may process your inquiry.",
  },
} as const;

const BUDGETS = ["< 1.500 €", "1.500–3.500 €", "3.500–7.500 €", "7.500–15.000 €", "> 15.000 €"];

export default function ContactForm({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const schema = z.object({
    name: z.string().trim().min(1, T.errName[lang]).max(200),
    email: z.string().trim().email(T.errEmail[lang]).max(254),
    company: z.string().trim().max(200).optional(),
    interesse: z.string().optional(),
    message: z.string().trim().min(10, T.errNachricht[lang]).max(5000),
    budget: z.string().optional(),
    datenschutz: z.literal(true, { message: T.errDatenschutz[lang] }),
    website: z.string().max(0).optional().or(z.literal("")), // Honeypot
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company || null,
          subject: data.interesse || null,
          message: data.message,
          budget: data.budget || null,
          website: data.website || "",
          source: typeof window !== "undefined" ? window.location.href : null,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="corner-frame p-8" role="status" aria-live="polite">
        <h3 className="h-sub">{T.erfolgTitel[lang]}</h3>
        <p className="mt-3 text-[0.9375rem]" style={{ color: "var(--text-gedimmt)" }}>
          {T.erfolgText[lang]}
        </p>
      </div>
    );
  }

  const inputStyle = {
    background: "var(--flaeche)",
    border: "1px solid var(--linie)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
  } as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — für Menschen unsichtbar, Bots füllen es */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label htmlFor="k-name" className="mb-1.5 block text-[0.875rem] font-medium">
          {T.name[lang]} *
        </label>
        <input
          id="k-name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "k-name-err" : undefined}
          className="w-full px-4 py-3 text-[0.9375rem]"
          style={inputStyle}
          {...register("name")}
        />
        {errors.name && (
          <p id="k-name-err" className="mt-1.5 text-[0.8125rem]" style={{ color: "var(--fehler)" }}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="k-email" className="mb-1.5 block text-[0.875rem] font-medium">
          {T.email[lang]} *
        </label>
        <input
          id="k-email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "k-email-err" : undefined}
          className="w-full px-4 py-3 text-[0.9375rem]"
          style={inputStyle}
          {...register("email")}
        />
        {errors.email && (
          <p id="k-email-err" className="mt-1.5 text-[0.8125rem]" style={{ color: "var(--fehler)" }}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="k-company" className="mb-1.5 block text-[0.875rem] font-medium">
          {T.company[lang]}
        </label>
        <input
          id="k-company"
          type="text"
          autoComplete="organization"
          className="w-full px-4 py-3 text-[0.9375rem]"
          style={inputStyle}
          {...register("company")}
        />
      </div>

      <div>
        <label htmlFor="k-interesse" className="mb-1.5 block text-[0.875rem] font-medium">
          {T.interesse[lang]}
        </label>
        <select id="k-interesse" className="w-full px-4 py-3 text-[0.9375rem]" style={inputStyle} {...register("interesse")}>
          <option value="">{T.unsicher[lang]}</option>
          {LEISTUNGEN.map((l) => (
            <option key={l.id} value={l.name.de}>
              {l.nr} — {l.name[lang]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="k-message" className="mb-1.5 block text-[0.875rem] font-medium">
          {T.nachricht[lang]} *
        </label>
        <textarea
          id="k-message"
          rows={5}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "k-message-err" : undefined}
          className="w-full px-4 py-3 text-[0.9375rem]"
          style={inputStyle}
          {...register("message")}
        />
        {errors.message && (
          <p id="k-message-err" className="mt-1.5 text-[0.8125rem]" style={{ color: "var(--fehler)" }}>
            {errors.message.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="k-budget" className="mb-1.5 block text-[0.875rem] font-medium">
          {T.budget[lang]}
        </label>
        <select id="k-budget" className="w-full px-4 py-3 text-[0.9375rem]" style={inputStyle} {...register("budget")}>
          <option value="">{T.budgetKeine[lang]}</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-start gap-3 text-[0.8125rem]" htmlFor="k-datenschutz">
          <input
            id="k-datenschutz"
            type="checkbox"
            required
            aria-invalid={!!errors.datenschutz}
            aria-describedby={errors.datenschutz ? "k-ds-err" : undefined}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#8A501B]"
            {...register("datenschutz")}
          />
          <span style={{ color: "var(--text-gedimmt)" }}>
            {T.datenschutz[lang]}{" "}
            <a href="/datenschutz" className="via-link" style={{ color: "var(--kupfer-tief)" }}>
              {lang === "de" ? "Zur Datenschutzerklärung" : "Privacy policy"}
            </a>{" "}
            *
          </span>
        </label>
        {errors.datenschutz && (
          <p id="k-ds-err" className="mt-1.5 text-[0.8125rem]" style={{ color: "var(--fehler)" }}>
            {errors.datenschutz.message}
          </p>
        )}
      </div>

      <div aria-live="polite">
        {status === "error" && (
          <p className="mb-4 border-l-2 pl-4 text-[0.875rem]"
            style={{ borderColor: "var(--fehler)", color: "var(--fehler)" }}>
            {T.fehlerServer[lang]}
          </p>
        )}
      </div>

      <button type="submit" className="btn-pad" disabled={status === "sending"}>
        {status === "sending" ? T.sendet[lang] : T.senden[lang]}
      </button>
    </form>
  );
}
