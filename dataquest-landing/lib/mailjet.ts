import { NEED_LABELS, PLAYERS_LABELS, ANALYTICS_LABELS, type LeadInput } from "./lead-schema";

const MAILJET_URL = "https://api.mailjet.com/v3.1/send";

export function buildSubject(lead: Pick<LeadInput, "need" | "company">): string {
  return `[Data Quest] Nouvelle demande : ${NEED_LABELS[lead.need]} — ${lead.company}`;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildLeadBody(lead: LeadInput) {
  const rows: [string, string][] = [
    ["Besoin", NEED_LABELS[lead.need]],
    ["Nom", lead.name],
    ["Email", lead.email],
    ["Entreprise", lead.company],
    ["Joueurs envisagés", PLAYERS_LABELS[lead.players]],
    ["Outil de mesure", ANALYTICS_LABELS[lead.tool]],
    ["Téléphone", lead.phone || "—"],
    ["Contexte", lead.message || "—"],
  ];
  const text = rows.map(([k, v]) => `${k} : ${v}`).join("\n");
  const html =
    `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">` +
    rows
      .map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
      .join("") +
    `</table>`;
  return { text, html };
}

export function hasMailjetConfig(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.MAILJET_API_KEY && env.MAILJET_API_SECRET && env.MAIL_FROM && env.LEAD_NOTIFY_EMAIL);
}

export async function sendLeadEmail(
  lead: LeadInput,
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const { text, html } = buildLeadBody(lead);
  const auth = Buffer.from(`${env.MAILJET_API_KEY}:${env.MAILJET_API_SECRET}`).toString("base64");
  const res = await fetchImpl(MAILJET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: env.MAIL_FROM, Name: "Data Quest" },
          To: [{ Email: env.LEAD_NOTIFY_EMAIL }],
          ReplyTo: { Email: lead.email, Name: lead.name },
          Subject: buildSubject(lead),
          TextPart: text,
          HTMLPart: html,
        },
      ],
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Mailjet responded with HTTP ${res.status}`);
  }
}
