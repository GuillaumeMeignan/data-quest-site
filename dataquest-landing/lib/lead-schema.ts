import { z } from "zod";
import {
  ANALYTICS_TOOLS, MESSAGES, NEEDS, PHONE_RE, PLAYERS_RANGES, isWebmail,
  type FieldErrors, type FieldName, type LeadInput,
} from "./lead-rules";

export * from "./lead-rules";

const trimmed = (msg: string) => z.string({ error: msg }).trim().min(1, msg);

export const leadSchema = z.object({
  need: z.enum(NEEDS, { error: MESSAGES.need }),
  name: trimmed(MESSAGES.name).max(120, MESSAGES.name),
  email: trimmed(MESSAGES.emailRequired)
    .max(254, MESSAGES.emailInvalid)
    .pipe(z.email({ error: MESSAGES.emailInvalid }))
    .refine((v) => !isWebmail(v), { message: MESSAGES.emailWebmail }),
  company: trimmed(MESSAGES.company).max(120, MESSAGES.company),
  players: z.enum(PLAYERS_RANGES, { error: MESSAGES.players }),
  tool: z.enum(ANALYTICS_TOOLS, { error: MESSAGES.tool }),
  phone: z
    .string()
    .trim()
    .max(30, MESSAGES.phone)
    .refine((v) => v === "" || PHONE_RE.test(v), { message: MESSAGES.phone })
    .optional()
    .default(""),
  message: z.string().trim().max(1000, MESSAGES.message).optional().default(""),
  consent: z.literal(true, { error: MESSAGES.consent }),
});


/** Server-side validation (zod). */
export function validateLead(raw: unknown):
  | { ok: true; data: LeadInput }
  | { ok: false; errors: FieldErrors } {
  const parsed = leadSchema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as FieldName | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

