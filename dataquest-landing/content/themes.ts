/**
 * Theme colours from the design system. `pill`/`pillText` are accessible variants
 * (WCAG AA 4.5:1) used for the text pills when white on the brand colour is too light.
 */
export const THEMES: readonly { name: string; color: string; pill?: string; pillText?: string }[] = [
  { name: "Trafic", color: "#2A9D8F", pillText: "#22201C" },
  { name: "Acquisition", color: "#1E88B5", pill: "#1A7CA5" },
  { name: "Conversion", color: "#7B5EA7" },
  { name: "Ventes", color: "#B4533A" },
  { name: "Clients & CRM", color: "#A8641B" },
  { name: "Outils & dashboards", color: "#3E7D4F" },
  { name: "Culture data & RGPD", color: "#4A6378" },
  { name: "Marché", color: "#96406F" },
];
