import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { LeadInput } from "./lead-schema";

/** Development fallback: persist the lead as a JSON file in ./.leads (git-ignored). */
export async function saveLeadLocally(lead: LeadInput, dir = path.join(process.cwd(), ".leads")): Promise<string> {
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}.json`);
  await writeFile(file, JSON.stringify({ receivedAt: new Date().toISOString(), ...lead }, null, 2), "utf8");
  return file;
}
