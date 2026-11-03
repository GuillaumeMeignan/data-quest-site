"use server";

import { headers } from "next/headers";
import { processLead, type SubmitResult } from "@/lib/submit-lead";

export async function submitLead(formData: FormData): Promise<SubmitResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return processLead(formData, { ip });
}
