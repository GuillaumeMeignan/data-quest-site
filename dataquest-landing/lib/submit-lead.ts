import { readLeadFields, validateLead, type FieldErrors } from "./lead-schema";
import { hasMailjetConfig, sendLeadEmail } from "./mailjet";
import { saveLeadLocally } from "./leads-store";
import { isRateLimited } from "./rate-limit";
import { maskEmail, maskPhone } from "./mask";

export const MIN_FILL_MS = 3000;

export type SubmitResult =
  | { ok: true }
  | { ok: false; kind: "validation"; errors: FieldErrors }
  | { ok: false; kind: "too_fast" | "rate_limited" | "send_failed"; message: string };

export interface SubmitDeps {
  ip: string;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
  save?: typeof saveLeadLocally;
  now?: number;
}

/** Core of the contact form: anti-spam, validation, delivery. Framework-agnostic for testing. */
export async function processLead(formData: FormData, deps: SubmitDeps): Promise<SubmitResult> {
  const env = deps.env ?? process.env;

  // Honeypot: bots fill the invisible field. Pretend success, do nothing.
  const trap = formData.get("website");
  if (typeof trap === "string" && trap.trim() !== "") return { ok: true };

  const elapsed = Number(formData.get("elapsedMs"));
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return {
      ok: false,
      kind: "too_fast",
      message: "Votre demande est partie un peu vite. Patientez un instant puis renvoyez-la.",
    };
  }

  const parsed = validateLead(readLeadFields((k) => formData.get(k)));
  if (!parsed.ok) return { ok: false, kind: "validation", errors: parsed.errors };

  if (isRateLimited(deps.ip, deps.now)) {
    return {
      ok: false,
      kind: "rate_limited",
      message: "Vous avez envoyé plusieurs demandes à la suite. Réessayez dans quelques minutes.",
    };
  }

  const lead = parsed.data;
  try {
    if (hasMailjetConfig(env)) {
      await sendLeadEmail(lead, env, deps.fetchImpl);
    } else {
      await (deps.save ?? saveLeadLocally)(lead);
    }
    console.info("[lead] received", {
      need: lead.need,
      company: lead.company,
      email: maskEmail(lead.email),
      phone: maskPhone(lead.phone),
    });
    return { ok: true };
  } catch (error) {
    console.error("[lead] delivery failed", {
      email: maskEmail(lead.email),
      reason: error instanceof Error ? error.message : "unknown",
    });
    return {
      ok: false,
      kind: "send_failed",
      message:
        "L’envoi n’a pas abouti. Vos informations sont conservées : merci de réessayer dans un instant.",
    };
  }
}
