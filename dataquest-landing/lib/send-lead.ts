import { checkLeadFields, readLeadFields, type FieldErrors, type LeadInput } from "./lead-rules";
import { postToWeb3forms } from "./web3forms";
import { maskEmail, maskPhone } from "./mask";

export const MIN_FILL_MS = 3000;

export type SendResult =
  | { ok: true }
  | { ok: false; kind: "validation"; errors: FieldErrors }
  | { ok: false; kind: "too_fast" | "send_failed"; message: string };

export interface SendDeps {
  accessKey?: string;
  production?: boolean;
  fetchImpl?: typeof fetch;
}

const SEND_FAILED =
  "L’envoi n’a pas abouti. Vos informations sont conservées : merci de réessayer dans un instant.";

/**
 * Contact form pipeline, run in the browser (the site is a static export on GitHub Pages):
 * anti-spam, validation, delivery through Web3Forms.
 */
export async function sendLead(formData: FormData, deps: SendDeps = {}): Promise<SendResult> {
  const accessKey = deps.accessKey ?? process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
  const production = deps.production ?? process.env.NODE_ENV === "production";

  // Honeypot: bots fill the invisible field. Pretend success, send nothing.
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

  const raw = readLeadFields((k) => formData.get(k));
  const errors = checkLeadFields(raw);
  if (Object.keys(errors).length > 0) return { ok: false, kind: "validation", errors };
  const lead = raw as unknown as LeadInput;

  if (!accessKey) {
    if (production) return { ok: false, kind: "send_failed", message: SEND_FAILED };
    // Development without a key: nothing is sent, the confirmation is shown normally.
    console.info("[lead] dev mode, not sent", {
      need: lead.need,
      company: lead.company,
      email: maskEmail(lead.email),
      phone: maskPhone(lead.phone),
    });
    return { ok: true };
  }

  try {
    await postToWeb3forms(lead, accessKey, deps.fetchImpl);
    return { ok: true };
  } catch {
    return { ok: false, kind: "send_failed", message: SEND_FAILED };
  }
}
