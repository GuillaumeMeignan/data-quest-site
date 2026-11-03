export const NEEDS = ["demo", "pilot", "quote"] as const;
export type Need = (typeof NEEDS)[number];

export const NEED_LABELS: Record<Need, string> = {
  demo: "Une démo de 30 min",
  pilot: "Une partie pilote",
  quote: "Un devis Enterprise",
};

export const NEED_SUBMIT_LABELS: Record<Need, string> = {
  demo: "Réserver ma démo",
  pilot: "Lancer ma partie pilote",
  quote: "Recevoir mon devis",
};

export const PLAYERS_RANGES = ["lt20", "20-50", "50-200", "gt200"] as const;
export type PlayersRange = (typeof PLAYERS_RANGES)[number];
export const PLAYERS_LABELS: Record<PlayersRange, string> = {
  lt20: "Moins de 20",
  "20-50": "20 à 50",
  "50-200": "50 à 200",
  gt200: "Plus de 200",
};

export const ANALYTICS_TOOLS = ["piano", "ga4", "other"] as const;
export type AnalyticsTool = (typeof ANALYTICS_TOOLS)[number];
export const ANALYTICS_LABELS: Record<AnalyticsTool, string> = {
  piano: "Piano Analytics",
  ga4: "Google Analytics 4",
  other: "Autre / je ne sais pas",
};

export const WEBMAIL_DOMAINS = [
  "gmail", "googlemail", "outlook", "hotmail", "live", "yahoo", "icloud",
  "orange", "free", "laposte", "wanadoo", "sfr",
];

/** True when the email's domain belongs to a consumer webmail provider. */
export function isWebmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  // gmail.com, free.fr, hotmail.co.uk, mail.orange.fr : any label before the TLD.
  return domain.split(".").slice(0, -1).some((label) => WEBMAIL_DOMAINS.includes(label));
}

export const MESSAGES = {
  need: "Choisissez votre besoin.",
  name: "Indiquez votre prénom et votre nom.",
  emailRequired: "Indiquez votre email professionnel.",
  emailInvalid: "Cet email ne semble pas valide. Exemple : camille@entreprise.fr",
  emailWebmail: "Merci d’utiliser votre adresse professionnelle : nous échangeons avec des entreprises.",
  company: "Indiquez le nom de votre entreprise.",
  players: "Choisissez le nombre de joueurs envisagés.",
  tool: "Choisissez votre outil de mesure d’audience.",
  phone: "Ce numéro de téléphone ne semble pas valide.",
  message: "Votre message est trop long (1 000 caractères maximum).",
  consent: "Merci de cocher la case pour que nous puissions vous recontacter.",
} as const;


export interface LeadInput {
  need: Need;
  name: string;
  email: string;
  company: string;
  players: PlayersRange;
  tool: AnalyticsTool;
  phone: string;
  message: string;
  consent: true;
}
export type FieldName = keyof LeadInput;
export type FieldErrors = Partial<Record<FieldName, string>>;

/** Raw values as read from the form (strings only). */
export function readLeadFields(get: (key: string) => FormDataEntryValue | null) {
  const str = (k: string) => {
    const v = get(k);
    return typeof v === "string" ? v : "";
  };
  return {
    need: str("need"),
    name: str("name"),
    email: str("email"),
    company: str("company"),
    players: str("players"),
    tool: str("tool"),
    phone: str("phone"),
    message: str("message"),
    consent: get("consent") === "on" || get("consent") === "true" ? true : false,
  };
}

/** Display order of fields in the form (used to focus the first error). */
export const FIELD_ORDER: FieldName[] = [
  "need", "name", "email", "company", "players", "tool", "phone", "message", "consent",
];

const inList = <T extends string>(list: readonly T[], v: string): v is T => (list as readonly string[]).includes(v);

/**
 * Dependency-free validation used in the browser .
 * Validation runs in the browser (static site).
 */
export function checkLeadFields(raw: ReturnType<typeof readLeadFields>): FieldErrors {
  const e: FieldErrors = {};
  if (!inList(NEEDS, raw.need)) e.need = MESSAGES.need;
  const name = raw.name.trim();
  if (!name || name.length > 120) e.name = MESSAGES.name;
  const email = raw.email.trim();
  if (!email) e.email = MESSAGES.emailRequired;
  else if (email.length > 254 || !EMAIL_RE.test(email)) e.email = MESSAGES.emailInvalid;
  else if (isWebmail(email)) e.email = MESSAGES.emailWebmail;
  const company = raw.company.trim();
  if (!company || company.length > 120) e.company = MESSAGES.company;
  if (!inList(PLAYERS_RANGES, raw.players)) e.players = MESSAGES.players;
  if (!inList(ANALYTICS_TOOLS, raw.tool)) e.tool = MESSAGES.tool;
  const phone = raw.phone.trim();
  if (phone && (phone.length > 30 || !PHONE_RE.test(phone))) e.phone = MESSAGES.phone;
  if (raw.message.trim().length > 1000) e.message = MESSAGES.message;
  if (raw.consent !== true) e.consent = MESSAGES.consent;
  return e;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^[+()\d\s.\-]{6,30}$/;
