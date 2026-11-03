import { NEED_LABELS, PLAYERS_LABELS, ANALYTICS_LABELS, type LeadInput } from "./lead-schema";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

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

export function hasWeb3formsConfig(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.WEB3FORMS_ACCESS_KEY);
}

/** Sends the notification through Web3Forms (the recipient is bound to the access key). */
export async function sendLeadEmail(
  lead: LeadInput,
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const { text } = buildLeadBody(lead);
  const res = await fetchImpl(WEB3FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_ACCESS_KEY,
      subject: buildSubject(lead),
      from_name: "Data Quest",
      name: lead.name,
      email: lead.email, // used by Web3Forms as Reply-To
      message: text,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const body = (await res.json().catch(() => null)) as { success?: boolean } | null;
  if (!res.ok || !body?.success) {
    throw new Error(`Web3Forms responded with HTTP ${res.status}`);
  }
}
