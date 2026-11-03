export type DataLayerEvent =
  | { event: "cta_click"; cta_location: string; cta_label: string }
  | { event: "form_need_select"; need: string }
  | { event: "form_start"; need: string }
  | { event: "form_submit_success"; need: string; players_range: string; analytics_tool: string }
  | { event: "form_submit_error"; error_type: string }
  | { event: "faq_open"; faq_question: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push an event to window.dataLayer (created if missing). Never put personal data in here. */
export function track(payload: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ ...payload });
}
