"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Prepares measurement without installing any tool: pushes events to window.dataLayer.
 * Also forwards the "need" carried by CTA links to the contact form.
 */
export function Analytics() {
  useEffect(() => {
    window.dataLayer = window.dataLayer ?? [];

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target?.closest<HTMLElement>("a[data-cta]");
      if (!link) return;
      track({
        event: "cta_click",
        cta_location: link.dataset.cta ?? "unknown",
        cta_label: (link.textContent ?? "").replace(/\s+/g, " ").trim(),
      });
      const need = link.dataset.need;
      if (need) window.dispatchEvent(new CustomEvent("dq:need", { detail: need }));
    };

    // "toggle" does not bubble: listen in the capture phase.
    const onToggle = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (el instanceof HTMLDetailsElement && el.open && el.dataset.faq) {
        track({ event: "faq_open", faq_question: el.dataset.faq });
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("toggle", onToggle, true);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, []);

  return null;
}
