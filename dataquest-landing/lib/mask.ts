/** Mask an email for logs: "camille@entreprise.fr" -> "c***@e***.fr". */
export function maskEmail(email: string): string {
  const [local = "", domain = ""] = email.split("@");
  const dot = domain.lastIndexOf(".");
  const host = dot > 0 ? domain.slice(0, dot) : domain;
  const tld = dot > 0 ? domain.slice(dot) : "";
  return `${local.slice(0, 1)}***@${host.slice(0, 1)}***${tld}`;
}

/** Mask a phone number for logs: keep only the last two digits. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return `${"*".repeat(Math.max(digits.length - 2, 0))}${digits.slice(-2)}`;
}
