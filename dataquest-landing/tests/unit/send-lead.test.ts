import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendLead } from "@/lib/send-lead";
import { buildSubject, postToWeb3forms } from "@/lib/web3forms";
import { maskEmail, maskPhone } from "@/lib/mask";
import type { LeadInput } from "@/lib/lead-rules";

function form(overrides: Record<string, string> = {}) {
  const f = new FormData();
  const base: Record<string, string> = {
    need: "quote", name: "Camille Roux", email: "camille@entreprise.fr", company: "Maison Dupont",
    players: "50-200", tool: "ga4", phone: "06 12 34 56 78", message: "Bonjour", consent: "on",
    website: "", elapsedMs: "8000",
  };
  for (const [k, v] of Object.entries({ ...base, ...overrides })) f.set(k, v);
  return f;
}
const ok = () => vi.fn(async () => new Response('{"success":true}', { status: 200 }));
type F = typeof fetch;

beforeEach(() => vi.spyOn(console, "info").mockImplementation(() => {}));
afterEach(() => vi.restoreAllMocks());

describe("sendLead", () => {
  it("posts the lead to Web3Forms with the right payload", async () => {
    const fetchImpl = ok();
    const r = await sendLead(form(), { accessKey: "test-key", production: true, fetchImpl: fetchImpl as unknown as F });
    expect(r).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.web3forms.com/submit");
    const body = JSON.parse(init.body as string);
    expect(body.access_key).toBe("test-key");
    expect(body.email).toBe("camille@entreprise.fr");
    expect(body.subject).toBe("[Data Quest] Nouvelle demande : Un devis Enterprise — Maison Dupont");
    expect(body.message).toContain("Camille Roux");
  });

  it("reports a delivery failure", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 500 }));
    const r = await sendLead(form(), { accessKey: "k", production: true, fetchImpl: fetchImpl as unknown as F });
    expect(!r.ok && r.kind).toBe("send_failed");
  });

  it("reports a network failure", async () => {
    const fetchImpl = vi.fn(async () => { throw new TypeError("offline"); });
    const r = await sendLead(form(), { accessKey: "k", production: true, fetchImpl: fetchImpl as unknown as F });
    expect(!r.ok && r.kind).toBe("send_failed");
  });

  it("fails in production without a key, simulates success in development", async () => {
    const fetchImpl = ok();
    const prod = await sendLead(form(), { accessKey: "", production: true, fetchImpl: fetchImpl as unknown as F });
    expect(!prod.ok && prod.kind).toBe("send_failed");
    const dev = await sendLead(form(), { accessKey: "", production: false, fetchImpl: fetchImpl as unknown as F });
    expect(dev).toEqual({ ok: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("silently ignores honeypot submissions", async () => {
    const fetchImpl = ok();
    const r = await sendLead(form({ website: "http://spam" }), { accessKey: "k", production: true, fetchImpl: fetchImpl as unknown as F });
    expect(r).toEqual({ ok: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects submissions sent in under 3 seconds or without timer", async () => {
    const fetchImpl = ok();
    const fast = await sendLead(form({ elapsedMs: "1200" }), { accessKey: "k", production: true, fetchImpl: fetchImpl as unknown as F });
    expect(!fast.ok && fast.kind).toBe("too_fast");
    const f = form(); f.delete("elapsedMs");
    const none = await sendLead(f, { accessKey: "k", production: true, fetchImpl: fetchImpl as unknown as F });
    expect(!none.ok && none.kind).toBe("too_fast");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns field errors and sends nothing when invalid", async () => {
    const fetchImpl = ok();
    const r = await sendLead(form({ email: "a@gmail.com" }), { accessKey: "k", production: true, fetchImpl: fetchImpl as unknown as F });
    expect(!r.ok && r.kind).toBe("validation");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("never logs the full email or phone", async () => {
    const info = vi.spyOn(console, "info");
    await sendLead(form(), { accessKey: "", production: false });
    const logged = JSON.stringify(info.mock.calls);
    expect(logged).not.toContain("camille@entreprise.fr");
    expect(logged).not.toContain("06 12 34 56 78");
  });
});

describe("web3forms helpers", () => {
  it("builds the subject", () => {
    expect(buildSubject({ need: "pilot", company: "ACME" })).toBe("[Data Quest] Nouvelle demande : Une partie pilote — ACME");
  });
  it("throws when Web3Forms answers success:false", async () => {
    const lead = { need: "demo", name: "A", email: "a@b.fr", company: "C", players: "lt20", tool: "piano", phone: "", message: "", consent: true } as LeadInput;
    const fetchImpl = vi.fn(async () => new Response('{"success":false}', { status: 400 }));
    await expect(postToWeb3forms(lead, "k", fetchImpl as unknown as F)).rejects.toThrow("400");
  });
});

describe("masking", () => {
  it("masks email and phone", () => {
    expect(maskEmail("camille@entreprise.fr")).toBe("c***@e***.fr");
    expect(maskPhone("06 12 34 56 78")).toBe("********78");
  });
});
