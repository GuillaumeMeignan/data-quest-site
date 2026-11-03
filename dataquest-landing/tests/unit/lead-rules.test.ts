import { describe, expect, it } from "vitest";
import { MESSAGES, checkLeadFields, isWebmail } from "@/lib/lead-rules";

const valid = {
  need: "demo", name: "Camille Roux", email: "camille@entreprise.fr", company: "Maison Dupont",
  players: "20-50", tool: "piano", phone: "", message: "", consent: true,
};

describe("checkLeadFields", () => {
  it("accepts a complete valid lead", () => expect(checkLeadFields(valid)).toEqual({}));

  it("requires every mandatory field with a message", () => {
    const e = checkLeadFields({ ...valid, need: "", name: " ", email: "", company: "", players: "", tool: "", consent: false });
    expect(Object.keys(e).sort()).toEqual(["company", "consent", "email", "name", "need", "players", "tool"]);
    expect(e.consent).toBe(MESSAGES.consent);
  });

  it("rejects an invalid email", () => expect(checkLeadFields({ ...valid, email: "pas-un-email" }).email).toBe(MESSAGES.emailInvalid));

  it.each(["a@gmail.com", "a@outlook.fr", "a@hotmail.com", "a@yahoo.fr", "a@icloud.com", "a@orange.fr", "a@free.fr", "a@laposte.net", "a@wanadoo.fr", "a@sfr.fr", "a@Gmail.COM", "a@hotmail.co.uk"])(
    "rejects webmail %s with a friendly message",
    (email) => expect(checkLeadFields({ ...valid, email }).email).toBe(MESSAGES.emailWebmail),
  );

  it("accepts professional domains", () => {
    expect(isWebmail("a@kimetrix.fr")).toBe(false);
    expect(isWebmail("a@entreprise.com")).toBe(false);
  });

  it("limits the context to 1000 characters", () => {
    expect(checkLeadFields({ ...valid, message: "x".repeat(1000) })).toEqual({});
    expect(checkLeadFields({ ...valid, message: "x".repeat(1001) }).message).toBe(MESSAGES.message);
  });

  it("validates the optional phone", () => {
    expect(checkLeadFields({ ...valid, phone: "+33 6 12 34 56 78" })).toEqual({});
    expect(checkLeadFields({ ...valid, phone: "abc" }).phone).toBe(MESSAGES.phone);
  });

  it("rejects unknown enum values", () => {
    expect(checkLeadFields({ ...valid, need: "hack" }).need).toBeTruthy();
    expect(checkLeadFields({ ...valid, players: "999" }).players).toBeTruthy();
  });
});
