import type { RechtsAbschnitt } from "@/components/legal/LegalShell";

/* Allgemeine Geschäftsbedingungen HM Labs — ENTWURF (Henry, 30.10.2026).
 *
 * Grundlage: die mit Henrys Anwalt abgestimmten AGB der SKM GbR
 * (Kunden/SKM/website/content/pages/agb.ts), die Henry für HM Labs
 * wiederverwenden darf. Übernommen sind Aufbau und die allgemeinen
 * Klauseln (Geltungsbereich, Verbraucher/Unternehmer, Zahlungsverzug,
 * Haftung, Schlussbestimmungen) möglichst wörtlich. Alles, was bei SKM auf
 * den Verkauf von Brennholz zugeschnitten war (Schüttraummeter, Lieferung,
 * Trocknung, Eigentumsvorbehalt an Ware), ist ersetzt durch Regeln für
 * Werk- und Dienstleistungen. Inhaltliche Quellen dafür:
 * docs/spec/preislogik.yaml (Zahlungsplan, 2 Revisionsrunden, Referenz-
 * klausel, laufende Leistungen monatlich im Voraus) und die Zusagen auf der
 * Website („Der Code gehört Ihnen", „keine Mindestlaufzeiten").
 *
 * VOR DER FREIGABE MIT DEM ANWALT ZU KLÄREN (neu gegenüber SKM):
 * - § 5 Abnahmefiktion nach 14 Tagen inkl. Hinweis an Verbraucher
 *   (§ 640 Abs. 2 BGB) und „Live-Schaltung gilt als Abnahme".
 * - § 6 Kleinunternehmerregelung: muss angepasst werden, sobald § 19 UStG
 *   nicht mehr gilt.
 * - § 7 Kündigungsfrist laufender Leistungen (gewählt: Ende des Monats,
 *   Textform) und Umgang mit Daten nach Vertragsende (30 Tage).
 * - § 9 Umfang der Rechteübertragung (ausschließlich, nach vollständiger
 *   Zahlung) und Vorbehalt für wiederverwendbare Bausteine.
 * - § 10 Referenzklausel als AGB-Klausel mit Widerspruchsrecht.
 * - § 11 Haftungsabgrenzung für KI-erzeugte Inhalte und Chatbot-Antworten.
 * - § 12 Verjährung für Unternehmer auf ein Jahr verkürzt.
 */

export const AGB_STAND = "Oktober 2026";

export const agbIntro =
  "von HM Labs, Inhaber Henry Mirus, Pantaleonstraße 20, 53567 Buchholz (Westerwald)";

export const agb: RechtsAbschnitt[] = [
  {
    heading: "§ 1 Geltungsbereich",
    paragraphs: [
      "Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen HM Labs, Inhaber Henry Mirus (nachfolgend „Auftragnehmer“), und seinen Kundinnen und Kunden (nachfolgend „Auftraggeber“) über die Konzeption, Gestaltung und Entwicklung von Websites und Webanwendungen, die Einrichtung und den Betrieb von KI-Systemen und Chatbots, Audits und Beratungsleistungen sowie über laufende Leistungen wie Wartung und Hosting. Sie gelten sowohl gegenüber Verbrauchern als auch gegenüber Unternehmern, soweit nicht ausdrücklich nach Kundengruppe unterschieden wird.",
      "Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu einem Zweck abschließt, der überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden kann (§ 13 BGB).",
      "Unternehmer ist eine natürliche oder juristische Person oder eine rechtsfähige Personengesellschaft, die beim Abschluss des Vertrages in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt (§ 14 BGB).",
      "Abweichende, entgegenstehende oder ergänzende Bedingungen des Auftraggebers werden nicht Vertragsbestandteil, es sei denn, der Auftragnehmer stimmt ihrer Geltung ausdrücklich in Textform zu. Individuelle Vereinbarungen im Angebot gehen diesen Bedingungen vor.",
    ],
  },
  {
    heading: "§ 2 Leistungen",
    paragraphs: [
      "Art und Umfang der Leistungen ergeben sich aus dem jeweiligen Angebot des Auftragnehmers. Die Leistungsbeschreibungen und Preisspannen auf der Website dienen der unverbindlichen Orientierung und sind kein Angebot. Verbindlich ist erst der im Angebot vereinbarte Umfang und Preis.",
      "Für die Erstellung einer Website, Webanwendung oder eines KI-Systems schuldet der Auftragnehmer das im Angebot beschriebene Ergebnis (Werkleistung). Beratung, Audits, Wartung, Hosting und Support erbringt er als Dienstleistung, sofern im Angebot nichts anderes vereinbart ist.",
      "Der Auftragnehmer erbringt die Leistungen persönlich. Er darf geeignete Dritte (z. B. Hosting- und Infrastrukturanbieter) einsetzen, bleibt aber gegenüber dem Auftraggeber verantwortlich.",
    ],
  },
  {
    heading: "§ 3 Vertragsschluss",
    paragraphs: [
      "Anfragen über das Kontaktformular, den Projekt-Assistenten auf der Website, per E-Mail oder Telefon sind noch kein Vertragsangebot. Der Auftragnehmer erstellt auf dieser Grundlage ein schriftliches Angebot in Textform.",
      "Der Vertrag kommt zustande, wenn der Auftraggeber das Angebot in Textform annimmt (z. B. per E-Mail oder über das Kundenportal) oder der Auftragnehmer auf ausdrücklichen Wunsch des Auftraggebers mit der Leistung beginnt. Ein Angebot ist, sofern nicht anders angegeben, 30 Tage gültig.",
      "Die Vertragssprache ist Deutsch.",
    ],
  },
  {
    heading: "§ 4 Mitwirkung des Auftraggebers",
    paragraphs: [
      "Der Auftraggeber stellt rechtzeitig alle Inhalte, Informationen und Zugänge bereit, die für die Leistung nötig sind, insbesondere Texte, Bilder, Logos, Rechtsangaben, Zugangsdaten zu Domain, Hosting und Drittdiensten, und erteilt Freigaben ohne unnötige Verzögerung.",
      "Der Auftraggeber versichert, dass er an den von ihm gelieferten Inhalten die erforderlichen Rechte besitzt und deren Nutzung keine Rechte Dritter verletzt. Er stellt den Auftragnehmer insoweit von Ansprüchen Dritter frei. Für die inhaltliche und rechtliche Richtigkeit der vom Auftraggeber gelieferten oder freigegebenen Inhalte ist der Auftraggeber verantwortlich.",
      "Verzögert sich die Leistung, weil Mitwirkungen ausbleiben, verschieben sich vereinbarte Termine entsprechend. Dadurch entstehender Mehraufwand kann nach Aufwand berechnet werden.",
    ],
  },
  {
    heading: "§ 5 Ablauf, Revisionen und Abnahme",
    paragraphs: [
      "Der Auftragnehmer stellt Entwürfe und Zwischenstände zur Prüfung bereit. Im Preis enthalten sind zwei Revisionsrunden je Projektphase, sofern im Angebot nichts anderes vereinbart ist. Weitere Änderungswünsche sowie Änderungen am vereinbarten Umfang werden nach Aufwand zu dem im Angebot genannten Stundensatz berechnet und vorher abgestimmt.",
      "Nach Fertigstellung einer Werkleistung zeigt der Auftragnehmer diese an. Der Auftraggeber prüft die Leistung und erklärt die Abnahme oder teilt wesentliche Mängel in Textform mit. Unwesentliche Mängel berechtigen nicht zur Verweigerung der Abnahme.",
      "Die Leistung gilt als abgenommen, wenn der Auftraggeber sie nicht innerhalb von 14 Tagen nach Fertigstellungsanzeige unter Angabe mindestens eines Mangels zurückweist. Ist der Auftraggeber Verbraucher, tritt diese Wirkung nur ein, wenn der Auftragnehmer ihn mit der Fertigstellungsanzeige auf diese Folge hingewiesen hat. Die Live-Schaltung auf Wunsch des Auftraggebers gilt als Abnahme.",
    ],
  },
  {
    heading: "§ 6 Vergütung und Zahlung",
    paragraphs: [
      "Es gelten die im Angebot vereinbarten Preise. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und ausgewiesen (Kleinunternehmerregelung).",
      "Projekte werden in Teilbeträgen abgerechnet, sofern im Angebot nichts anderes vereinbart ist: bei einem Auftragswert bis 5.000 € 50 % bei Auftragserteilung und 50 % bei Abnahme, darüber 40 % bei Auftragserteilung, 40 % bei Abnahme des ersten funktionsfähigen Stands und 20 % bei Live-Schaltung. Laufende Leistungen (z. B. Wartung, Hosting, Chatbot-Betrieb) werden monatlich im Voraus berechnet.",
      "Rechnungen sind innerhalb von 14 Tagen ab Rechnungsdatum ohne Abzug fällig, sofern nichts anderes vereinbart ist. Kommt der Auftraggeber in Zahlungsverzug, ist der Auftragnehmer berechtigt, Verzugszinsen in gesetzlicher Höhe zu verlangen (§ 288 BGB) und die weitere Leistung bis zum Ausgleich zurückzuhalten.",
      "Kosten für Leistungen Dritter, die der Auftraggeber nutzt oder die im Angebot gesondert ausgewiesen sind (z. B. Domains, Lizenzen, Bilddatenbanken, Nutzungsentgelte für KI-Modelle), trägt der Auftraggeber.",
    ],
  },
  {
    heading: "§ 7 Laufende Leistungen: Wartung, Hosting und Betrieb",
    paragraphs: [
      "Verträge über laufende Leistungen haben keine Mindestlaufzeit. Sie können von beiden Seiten in Textform zum Ende des jeweiligen Kalendermonats gekündigt werden. Das Recht zur außerordentlichen Kündigung bleibt unberührt.",
      "Der Auftragnehmer sorgt im Rahmen des gewählten Pakets für Aktualisierungen, Datensicherungen und Überwachung der Erreichbarkeit. Eine ununterbrochene Verfügbarkeit kann nicht zugesagt werden. Geplante Wartungsarbeiten werden nach Möglichkeit vorher angekündigt.",
      "Nach Vertragsende stellt der Auftragnehmer dem Auftraggeber auf Wunsch die Website, den Quellcode und die gespeicherten Inhalte in einem üblichen Format bereit und unterstützt einen Umzug zu einem anderen Anbieter. Die Daten werden 30 Tage nach Vertragsende gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.",
    ],
  },
  {
    heading: "§ 8 Leistungen Dritter",
    paragraphs: [
      "Soweit Leistungen Dritter eingebunden werden (z. B. Domain-Registrierung, Hosting- und Datenbankanbieter, E-Mail-Dienste, KI-Modelle, Schnittstellen), gelten zusätzlich deren Bedingungen. Der Auftragnehmer haftet nicht für Ausfälle, Preis- oder Leistungsänderungen dieser Anbieter, soweit er sie nicht zu vertreten hat.",
    ],
  },
  {
    heading: "§ 9 Nutzungsrechte",
    paragraphs: [
      "Mit vollständiger Zahlung der vereinbarten Vergütung erhält der Auftraggeber an den für ihn erstellten Arbeitsergebnissen (insbesondere Gestaltung, Texte, Quellcode) das ausschließliche, zeitlich und räumlich unbeschränkte Recht zur Nutzung, Bearbeitung und Weitergabe. Auf Wunsch erhält er den vollständigen Quellcode. Bis zur vollständigen Zahlung ist die Nutzung nur widerruflich gestattet.",
      "Allgemeine Bausteine, Werkzeuge und Vorlagen, die der Auftragnehmer unabhängig vom Auftrag entwickelt hat und projektübergreifend verwendet, bleiben sein Eigentum. Der Auftraggeber erhält daran ein einfaches, zeitlich unbeschränktes Nutzungsrecht im Rahmen des Projekts.",
      "Eingesetzte Open-Source-Software und Inhalte Dritter (z. B. Schriften, Bildmaterial) unterliegen den jeweiligen Lizenzbedingungen.",
    ],
  },
  {
    heading: "§ 10 Referenznennung",
    paragraphs: [
      "Der Auftragnehmer darf das Projekt nach Fertigstellung als Referenz nennen, dabei Name und Logo des Auftraggebers zeigen, Bildschirmfotos verwenden und auf die Website des Auftraggebers verlinken. Der Auftraggeber kann dem jederzeit in Textform widersprechen; die Nennung wird dann in angemessener Frist entfernt. Vertrauliche Informationen werden nicht veröffentlicht.",
    ],
  },
  {
    heading: "§ 11 KI-gestützte Leistungen",
    paragraphs: [
      "Bei der Erstellung von Inhalten und bei Chatbots können KI-Systeme eingesetzt werden. Der Auftragnehmer prüft KI-erzeugte Inhalte vor der Übergabe mit der gebotenen Sorgfalt. Die abschließende inhaltliche und rechtliche Prüfung sowie gesetzliche Kennzeichnungspflichten auf der eigenen Website liegen beim Auftraggeber, soweit nichts anderes vereinbart ist.",
      "Antworten eines Chatbots werden automatisch erzeugt und können unvollständig oder fehlerhaft sein. Der Auftragnehmer richtet Chatbots so ein, dass sie als solche erkennbar sind, übernimmt aber keine Gewähr für die Richtigkeit einzelner Antworten.",
    ],
  },
  {
    heading: "§ 12 Mängelgewährleistung",
    paragraphs: [
      "Es gelten die gesetzlichen Gewährleistungsvorschriften. Der Auftragnehmer ist zunächst zur Nacherfüllung berechtigt. Ist der Auftraggeber Verbraucher, gelten die gesetzlichen Verjährungsfristen.",
      "Ist der Auftraggeber Unternehmer, verjähren Mängelansprüche ein Jahr nach Abnahme. Dies gilt nicht für Schadensersatzansprüche nach § 13 sowie bei Vorsatz oder arglistigem Verschweigen eines Mangels.",
      "Ein Mangel liegt nicht vor, soweit Störungen auf Änderungen des Auftraggebers oder Dritter am Code oder an der Konfiguration, auf Leistungen Dritter nach § 8 oder auf die Nutzung veralteter Browser beruhen.",
    ],
  },
  {
    heading: "§ 13 Haftung",
    paragraphs: [
      "Der Auftragnehmer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach dem Produkthaftungsgesetz. Für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit haftet er ebenfalls unbeschränkt.",
      "Bei leicht fahrlässiger Verletzung einer wesentlichen Vertragspflicht (Kardinalpflicht), deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung der Auftraggeber regelmäßig vertrauen darf, ist die Haftung des Auftragnehmers der Höhe nach auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden begrenzt. Im Übrigen ist die Haftung für leicht fahrlässige Pflichtverletzungen ausgeschlossen.",
      "Für den Verlust von Daten haftet der Auftragnehmer nur in dem Umfang, der bei ordnungsgemäßer Datensicherung entstanden wäre. Außerhalb laufender Wartungsverträge ist der Auftraggeber für die Sicherung seiner Daten selbst verantwortlich.",
    ],
  },
  {
    heading: "§ 14 Datenschutz und Auftragsverarbeitung",
    paragraphs: [
      "Hinsichtlich der Verarbeitung personenbezogener Daten gilt die auf der Website abrufbare Datenschutzerklärung. Verarbeitet der Auftragnehmer im Auftrag personenbezogene Daten des Auftraggebers oder seiner Kunden (z. B. beim Hosting oder beim Betrieb eines Chatbots), schließen die Parteien einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.",
    ],
  },
  {
    heading: "§ 15 Widerrufsrecht",
    paragraphs: [
      "Verbrauchern steht unter den in der Widerrufsbelehrung dargestellten Voraussetzungen ein gesetzliches Widerrufsrecht zu. Die Einzelheiten ergeben sich aus der dort abgedruckten Widerrufsbelehrung.",
    ],
  },
  {
    heading: "§ 16 Schlussbestimmungen",
    paragraphs: [
      "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Ist der Auftraggeber Verbraucher, gilt dies nur, soweit hierdurch der durch zwingende Bestimmungen des Rechts seines gewöhnlichen Aufenthaltsorts gewährte Schutz nicht eingeschränkt wird.",
      "Ist der Auftraggeber Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand für alle Streitigkeiten aus diesem Vertrag der Sitz des Auftragnehmers.",
      "Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
    ],
  },
];
