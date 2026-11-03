import { describe, expect, it } from "vitest";
import { isWebmail, validateLead, MESSAGES } from "@/lib/lead-schema";
import { checkLeadFields } from "@/lib/lead-rules";

const valid = {
  need: "demo",
  name: "Camille Roux",
  email: "camille@entreprise.fr",
  company: "Maison Dupont",
  players: "20-50",
  tool: "piano",
  phone: "",
  message: "",
  consent: true,
};

describe("validateLead", () => {
  it("accepts a complete valid lead", () => {
    const r = validateLead(valid);
    expect(r.ok).toBe(true);
  });

  it("requires every mandatory field with a message", () => {
    const r = validateLead({ ...valid, need: "", name: " ", email: "", company: "", players: "", tool: "", consent: false });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["company", "consent", "email", "name", "need", "players", "tool"]);
      expect(r.errors.consent).toBe(MESSAGES.consent);
    }
  });

  it("rejects an invalid email", () => {
    const r = validateLead({ ...valid, email: "pas-un-email" });
    expect(!r.ok && r.errors.email).toBe(MESSAGES.emailInvalid);
  });

  it.each(["a@gmail.com", "a@outlook.fr", "a@hotmail.com", "a@yahoo.fr", "a@icloud.com", "a@orange.fr", "a@free.fr", "a@laposte.net", "a@wanadoo.fr", "a@sfr.fr", "a@Gmail.COM"])(
    "rejects webmail %s with a friendly message",
    (email) => {
      const r = validateLead({ ...valid, email });
      expect(!r.ok && r.errors.email).toBe(MESSAGES.emailWebmail);
    },
  );

  it("accepts professional domains", () => {
    expect(isWebmail("a@kimetrix.fr")).toBe(false);
    expect(isWebmail("a@entreprise.com")).toBe(false);
  });

  it("limits the context to 1000 characters", () => {
    expect(validateLead({ ...valid, message: "x".repeat(1000) }).ok).toBe(true);
    const r = validateLead({ ...valid, message: "x".repeat(1001) });
    expect(!r.ok && r.errors.message).toBe(MESSAGES.message);
  });

  it("validates the optional phone", () => {
    expect(validateLead({ ...valid, phone: "+33 6 12 34 56 78" }).ok).toBe(true);
    const r = validateLead({ ...valid, phone: "abc" });
    expect(!r.ok && r.errors.phone).toBe(MESSAGES.phone);
  });

  it("rejects unknown enum values", () => {
    expect(validateLead({ ...valid, need: "hack" }).ok).toBe(false);
    expect(validateLead({ ...valid, players: "999" }).ok).toBe(false);
  });
});

describe("client rules and server schema agree", () => {
  const base = { need: "demo", name: "Camille Roux", email: "camille@entreprise.fr", company: "Maison Dupont", players: "20-50", tool: "piano", phone: "", message: "", consent: true };
  const cases: Record<string, Partial<typeof base>> = {
    valid: {},
    "no need": { need: "" },
    "blank name": { name: "   " },
    "bad email": { email: "pas-un-email" },
    "empty email": { email: "" },
    webmail: { email: "x@gmail.com" },
    "webmail uk": { email: "x@hotmail.co.uk" },
    "no company": { company: "" },
    "bad players": { players: "x" },
    "bad tool": { tool: "x" },
    "bad phone": { phone: "abc" },
    "good phone": { phone: "+33 6 12 34 56 78" },
    "long message": { message: "x".repeat(1001) },
    "no consent": { consent: false as unknown as true },
  };
  it.each(Object.entries(cases))("%s", (_label, patch) => {
    const raw = { ...base, ...patch };
    const server = validateLead(raw);
    const client = checkLeadFields(raw);
    const serverErrors = server.ok ? {} : server.errors;
    expect(client).toEqual(serverErrors);
  });
});
