import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type Posted = { url: string; body: Record<string, string> };

/** Intercepts Web3Forms: records the payload and answers with the given status. */
async function mockWeb3forms(page: Page, status = 200) {
  const posted: Posted[] = [];
  await page.route("https://api.web3forms.com/submit", async (route) => {
    posted.push({ url: route.request().url(), body: route.request().postDataJSON() });
    await route.fulfill({
      status,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ success: status === 200 }),
    });
  });
  return posted;
}

async function dataLayer(page: Page) {
  return page.evaluate(() => (window.dataLayer ?? []) as Record<string, unknown>[]);
}

async function fillValid(page: Page, overrides: { email?: string } = {}) {
  await page.getByLabel("Prénom et nom").fill("Camille Roux");
  await page.getByLabel("Email professionnel").fill(overrides.email ?? "camille@entreprise.fr");
  await page.getByLabel("Entreprise", { exact: true }).fill("Maison Dupont");
  await page.getByLabel("Nombre de joueurs envisagés").selectOption("50-200");
  await page.getByLabel("Outil de mesure d’audience").selectOption("ga4");
  await page.getByLabel("Téléphone").fill("06 12 34 56 78");
  await page.getByLabel("Votre contexte en deux lignes").fill("Test e2e");
  await page.getByLabel(/J’accepte que Kimetrix/).check();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("page structure: single H1, landmarks, FAQ and key texts", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Vos équipes ouvrent enfin leurs dashboards.");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { name: "Vous payez une partie, pas un abonnement" })).toBeVisible();
  await expect(page.getByText("Enterprise", { exact: true })).toBeVisible();
  await expect(page.getByText("PME")).toHaveCount(0);
  await expect(page.locator("#faq details")).toHaveCount(5);
});

test("contact form: empty submit shows errors, links them and focuses the first one", async ({ page }) => {
  await page.getByRole("button", { name: "Réserver ma démo" }).click();
  const name = page.getByLabel("Prénom et nom");
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  const describedBy = await name.getAttribute("aria-describedby");
  expect(describedBy).toBeTruthy();
  await expect(page.locator(`#${describedBy}`)).toHaveText("Indiquez votre prénom et votre nom.");
  await expect(page.locator("#email-error")).toBeVisible();
  await expect(page.locator("#company-error")).toBeVisible();
  await expect(page.locator("#consent-error")).toBeVisible();
  const events = await dataLayer(page);
  expect(events).toContainEqual({ event: "form_submit_error", error_type: "validation" });
});

test("contact form: webmail address is refused kindly", async ({ page }) => {
  await fillValid(page, { email: "camille@gmail.com" });
  await page.waitForTimeout(3200);
  await page.getByRole("button", { name: "Réserver ma démo" }).click();
  await expect(page.locator("#email-error")).toContainText("adresse professionnelle");
  await expect(page.getByLabel("Email professionnel")).toBeFocused();
  // typed data is preserved
  await expect(page.getByLabel("Entreprise", { exact: true })).toHaveValue("Maison Dupont");
});

test("contact form: full journey posts to Web3Forms and shows the confirmation", async ({ page }) => {
  const posted = await mockWeb3forms(page);
  await fillValid(page);
  await page.waitForTimeout(3200);
  await page.getByRole("button", { name: "Réserver ma démo" }).click();

  const status = page.getByRole("status");
  await expect(status).toBeVisible();
  await expect(status).toContainText("Carte jouée !");
  await expect(page.locator("form")).toHaveCount(0);

  expect(posted).toHaveLength(1);
  expect(posted[0]!.body).toMatchObject({
    access_key: "e2e-test-key",
    email: "camille@entreprise.fr",
    subject: "[Data Quest] Nouvelle demande : Une démo de 30 min — Maison Dupont",
  });
  expect(posted[0]!.body.message).toContain("Maison Dupont");

  const events = await dataLayer(page);
  expect(events).toContainEqual({ event: "form_start", need: "demo" });
  expect(events).toContainEqual({ event: "form_submit_success", need: "demo", players_range: "50-200", analytics_tool: "ga4" });
  // no personal data in the dataLayer
  expect(JSON.stringify(events)).not.toContain("camille");
  expect(JSON.stringify(events)).not.toContain("Dupont");

  await page.getByRole("button", { name: "Envoyer une autre demande" }).click();
  await expect(page.getByLabel("Prénom et nom")).toHaveValue("");
});

test("contact form: delivery failure shows a clear message and keeps the data", async ({ page }) => {
  await mockWeb3forms(page, 500);
  await fillValid(page);
  await page.waitForTimeout(3200);
  await page.getByRole("button", { name: "Réserver ma démo" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("L’envoi n’a pas abouti");
  await expect(page.getByLabel("Entreprise", { exact: true })).toHaveValue("Maison Dupont");
  expect(await dataLayer(page)).toContainEqual({ event: "form_submit_error", error_type: "send_failed" });
});

test("contact form: submitting too fast is refused with a clear message and data is kept", async ({ page }) => {
  const posted = await mockWeb3forms(page);
  await fillValid(page);
  await page.getByRole("button", { name: "Réserver ma démo" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("un peu vite");
  await expect(page.getByLabel("Entreprise", { exact: true })).toHaveValue("Maison Dupont");
  expect(posted).toHaveLength(0);
});

test("CTA buttons pre-select the need and push cta_click events", async ({ page }) => {
  const pressed = async (label: string) =>
    page.getByRole("button", { name: label, exact: true }).getAttribute("aria-pressed");

  await page.locator("#tarifs").getByRole("link", { name: "Essayer gratuitement" }).click();
  expect(await pressed("Une partie pilote")).toBe("true");
  expect(await pressed("Une démo de 30 min")).toBe("false");
  await expect(page.getByRole("button", { name: "Lancer ma partie pilote" })).toBeVisible();

  await page.locator("#tarifs").getByRole("link", { name: "Recevoir une proposition" }).click();
  expect(await pressed("Un devis Enterprise")).toBe("true");
  await expect(page.getByRole("button", { name: "Recevoir mon devis" })).toBeVisible();

  await page.getByRole("link", { name: "Réserver une démo de 30 min" }).click();
  expect(await pressed("Une démo de 30 min")).toBe("true");

  const events = await dataLayer(page);
  expect(events).toContainEqual({ event: "cta_click", cta_location: "pricing_discovery", cta_label: "Essayer gratuitement" });
  expect(events).toContainEqual({ event: "cta_click", cta_location: "pricing_enterprise", cta_label: "Recevoir une proposition" });
  expect(events).toContainEqual({ event: "cta_click", cta_location: "hero", cta_label: "Réserver une démo de 30 min" });
});

test("need buttons are exclusive and push form_need_select", async ({ page }) => {
  await page.getByRole("button", { name: "Un devis Enterprise", exact: true }).click();
  await expect(page.getByRole("button", { name: "Un devis Enterprise", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Une démo de 30 min", exact: true })).toHaveAttribute("aria-pressed", "false");
  expect(await dataLayer(page)).toContainEqual({ event: "form_need_select", need: "quote" });
});

test("?besoin= pre-selects the need", async ({ page }) => {
  await page.goto("/?besoin=pilot");
  await expect(page.getByRole("button", { name: "Une partie pilote", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("FAQ opens with the keyboard and pushes faq_open", async ({ page }) => {
  const summary = page.locator("#faq summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#faq details").first()).toHaveAttribute("open", "");
  expect(await dataLayer(page)).toContainEqual({ event: "faq_open", faq_question: "Combien de temps par jour pour un joueur ?" });
});

test("mobile 390px: no horizontal scroll and collapsible menu", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/");
  const overflow = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    inner: window.innerWidth,
  }));
  expect(overflow.doc).toBeLessThanOrEqual(overflow.inner);
  expect(overflow.body).toBeLessThanOrEqual(overflow.inner);

  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("link", { name: "Tarifs" }).first()).toBeHidden();
  await toggle.click();
  await expect(page.getByRole("button", { name: "Fermer" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Tarifs" }).first()).toBeVisible();
  await context.close();
});

test("touch targets of buttons and form controls are at least 44px", async ({ page }) => {
  const small = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("button, select, input:not([type=checkbox]):not([name=website])"));
    return els
      .filter((e) => e.offsetParent !== null)
      .map((e) => ({ tag: e.tagName, text: (e.textContent || e.getAttribute("name") || "").trim().slice(0, 30), h: e.getBoundingClientRect().height }))
      .filter((e) => e.h < 44);
  });
  expect(small).toEqual([]);
});

test("accessibility: no axe violations (WCAG A/AA)", async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
});

test("legal pages exist with placeholders", async ({ page }) => {
  await page.goto("/mentions-legales");
  await expect(page.getByRole("heading", { level: 1, name: "Mentions légales" })).toBeVisible();
  await expect(page.getByText("[À COMPLÉTER", { exact: false }).first()).toBeVisible();
  await page.goto("/confidentialite");
  await expect(page.getByRole("heading", { level: 1, name: "Politique de confidentialité" })).toBeVisible();
});

test("seo: robots, sitemap and open graph image", async ({ request, page }) => {
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  expect(await (await request.get("/sitemap.xml")).text()).toContain("<urlset");
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(og).toBeTruthy();
  const img = await request.get(new URL(og!).pathname);
  expect(og).toContain("/og.png");
  expect(img.headers()["content-type"]).toContain("image/png");
});
