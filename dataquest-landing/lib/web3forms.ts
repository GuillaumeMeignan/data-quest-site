import { NEED_LABELS, PLAYERS_LABELS, ANALYTICS_LABELS, type LeadInput } from "./lead-rules";

export const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export function buildSubject(lead: Pick<LeadInput, "need" | "company">): string {
  return `[Data Quest] Nouvelle demande : ${NEED_LABELS[lead.need]} — ${lead.company}`;
}

export function buildLeadText(lead: LeadInput): string {
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
  return rows.map(([k, v]) => `${k} : ${v}`).join("\n");
}

/** Posts the lead to Web3Forms (the recipient address is bound to the access key). */
export async function postToWeb3forms(
  lead: LeadInput,
  accessKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const res = await fetchImpl(WEB3FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: buildSubject(lead),
      from_name: "Data Quest",
      name: lead.name,
      email: lead.email, // used by Web3Forms as reply-to
      message: buildLeadText(lead),
      botcheck: "",
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const body = (await res.json().catch(() => null)) as { success?: boolean } | null;
  if (!res.ok || !body?.success) throw new Error(`Web3Forms responded with HTTP ${res.status}`);
}
