import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { processLead } from "@/lib/submit-lead";
import { resetRateLimit } from "@/lib/rate-limit";
import { buildSubject, sendLeadEmail } from "@/lib/mailjet";
import { maskEmail, maskPhone } from "@/lib/mask";
import { validateLead } from "@/lib/lead-schema";

function form(overrides: Record<string, string> = {}) {
  const f = new FormData();
  const base: Record<string, string> = {
    need: "quote",
    name: "Camille Roux",
    email: "camille@entreprise.fr",
    company: "Maison Dupont",
    players: "50-200",
    tool: "ga4",
    phone: "06 12 34 56 78",
    message: "Bonjour",
    consent: "on",
    website: "",
    elapsedMs: "8000",
  };
  for (const [k, v] of Object.entries({ ...base, ...overrides })) f.set(k, v);
  return f;
}

const mailEnv = {
  MAILJET_API_KEY: "key",
  MAILJET_API_SECRET: "secret",
  MAIL_FROM: "contact@data-quest.test",
  LEAD_NOTIFY_EMAIL: "guillaume@kimetrix.test",
} as unknown as NodeJS.ProcessEnv;

beforeEach(() => {
  resetRateLimit();
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("processLead", () => {
  it("sends the lead through the Mailjet API v3.1 with the right payload", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    const save = vi.fn();
    const r = await processLead(form(), { ip: "1.1.1.1", env: mailEnv, fetchImpl: fetchImpl as unknown as typeof fetch, save });
    expect(r).toEqual({ ok: true });
    expect(save).not.toHaveBeenCalled();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.mailjet.com/v3.1/send");
    expect((init.headers as Record<string, string>).Authorization).toBe(`Basic ${Buffer.from("key:secret").toString("base64")}`);
    const msg = JSON.parse(init.body as string).Messages[0];
    expect(msg.From.Email).toBe("contact@data-quest.test");
    expect(msg.To[0].Email).toBe("guillaume@kimetrix.test");
    expect(msg.ReplyTo.Email).toBe("camille@entreprise.fr");
    expect(msg.Subject).toBe("[Data Quest] Nouvelle demande : Un devis Enterprise — Maison Dupont");
    expect(msg.TextPart).toContain("Camille Roux");
  });

  it("escapes HTML in the email body", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    await processLead(form({ message: "<script>alert(1)</script>" }), {
      ip: "1.1.1.2", env: mailEnv, fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    const body = JSON.parse(((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body) as string);
    expect(body.Messages[0].HTMLPart).not.toContain("<script>");
    expect(body.Messages[0].HTMLPart).toContain("&lt;script&gt;");
  });

  it("reports a delivery failure and keeps the user informed", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 500 }));
    const r = await processLead(form(), { ip: "1.1.1.3", env: mailEnv, fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.kind).toBe("send_failed");
  });

  it("falls back to local storage without Mailjet keys", async () => {
    const save = vi.fn(async () => "/tmp/x.json");
    const fetchImpl = vi.fn();
    const r = await processLead(form(), { ip: "1.1.1.4", env: {} as NodeJS.ProcessEnv, fetchImpl: fetchImpl as unknown as typeof fetch, save });
    expect(r).toEqual({ ok: true });
    expect(save).toHaveBeenCalledTimes(1);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("silently ignores honeypot submissions", async () => {
    const save = vi.fn();
    const r = await processLead(form({ website: "http://spam" }), { ip: "1.1.1.5", env: {} as NodeJS.ProcessEnv, save });
    expect(r).toEqual({ ok: true });
    expect(save).not.toHaveBeenCalled();
  });

  it("rejects submissions sent in under 3 seconds", async () => {
    const save = vi.fn();
    const r = await processLead(form({ elapsedMs: "1200" }), { ip: "1.1.1.6", env: {} as NodeJS.ProcessEnv, save });
    expect(!r.ok && r.kind).toBe("too_fast");
    expect(save).not.toHaveBeenCalled();
  });

  it("rejects submissions without timer", async () => {
    const f = form();
    f.delete("elapsedMs");
    const r = await processLead(f, { ip: "1.1.1.7", env: {} as NodeJS.ProcessEnv, save: vi.fn() });
    expect(!r.ok && r.kind).toBe("too_fast");
  });

  it("returns field errors from server-side validation", async () => {
    const r = await processLead(form({ email: "a@gmail.com" }), { ip: "1.1.1.8", env: {} as NodeJS.ProcessEnv, save: vi.fn() });
    expect(!r.ok && r.kind).toBe("validation");
    expect(!r.ok && r.kind === "validation" && r.errors.email).toBeTruthy();
  });

  it("rate-limits by IP", async () => {
    const env = { LEAD_RATE_LIMIT: "2" } as unknown as NodeJS.ProcessEnv;
    process.env.LEAD_RATE_LIMIT = "2";
    const save = vi.fn(async () => "x");
    const deps = { ip: "9.9.9.9", env, save };
    expect((await processLead(form(), deps)).ok).toBe(true);
    expect((await processLead(form(), deps)).ok).toBe(true);
    const third = await processLead(form(), deps);
    expect(!third.ok && third.kind).toBe("rate_limited");
    // another IP is unaffected
    expect((await processLead(form(), { ...deps, ip: "8.8.8.8" })).ok).toBe(true);
    delete process.env.LEAD_RATE_LIMIT;
  });

  it("never logs the full email or phone", async () => {
    const info = vi.spyOn(console, "info");
    await processLead(form(), { ip: "1.1.1.9", env: {} as NodeJS.ProcessEnv, save: vi.fn(async () => "x") });
    const logged = JSON.stringify(info.mock.calls);
    expect(logged).not.toContain("camille@entreprise.fr");
    expect(logged).not.toContain("06 12 34 56 78");
    expect(logged).not.toContain("0612345678");
  });
});

describe("mailjet helpers", () => {
  it("builds the subject", () => {
    expect(buildSubject({ need: "pilot", company: "ACME" })).toBe("[Data Quest] Nouvelle demande : Une partie pilote — ACME");
  });

  it("throws on a non-2xx Mailjet response", async () => {
    const parsed = validateLead({
      need: "demo", name: "A B", email: "a@b.fr", company: "C", players: "lt20", tool: "piano", consent: true,
    });
    if (!parsed.ok) throw new Error("invalid fixture");
    const fetchImpl = vi.fn(async () => new Response("", { status: 401 }));
    await expect(sendLeadEmail(parsed.data, mailEnv, fetchImpl as unknown as typeof fetch)).rejects.toThrow("401");
  });
});

describe("masking", () => {
  it("masks email and phone", () => {
    expect(maskEmail("camille@entreprise.fr")).toBe("c***@e***.fr");
    expect(maskPhone("06 12 34 56 78")).toBe("********78");
  });
});
