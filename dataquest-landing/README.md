# Data Quest — landing page de vente

Page one-page B2B (Next.js 15 App Router, TypeScript strict, CSS Modules) dont l'unique conversion est l'envoi du formulaire `#contact`.

## Installation

```bash
npm install
cp .env.example .env.local   # puis ajuster
npm run dev                  # http://localhost:3000
```

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript strict |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm test` | Vitest (validation, anti-spam, Mailjet simulé, masquage des logs) |
| `npm run test:e2e` | Playwright (build + serveur sur le port 3100, parcours formulaire, dataLayer, axe, 390 px) |

Playwright : si Chromium est déjà installé sur la machine, `PW_CHROMIUM_PATH=/chemin/vers/chromium npm run test:e2e`. Sinon `npx playwright install chromium`.

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (Open Graph, sitemap, canonical), sans slash final |
| `MAILJET_API_KEY`, `MAILJET_API_SECRET` | Clés API Mailjet |
| `MAIL_FROM` | Adresse expéditrice (domaine à valider dans Mailjet) |
| `LEAD_NOTIFY_EMAIL` | Destinataire des notifications |
| `LEAD_RATE_LIMIT` | (optionnel) demandes max / IP / 10 min, défaut 5 |

**Sans clés Mailjet** (développement) : rien n'est envoyé, la demande est écrite dans `.leads/*.json` (ignoré par git) et la confirmation s'affiche normalement.

## Déploiement sur Vercel

1. Importer le dépôt, **Root Directory** = `dataquest-landing`, framework Next.js (détecté).
2. Renseigner les 5 variables ci-dessus (Production + Preview).
3. Déployer. La page est statique ; seule l'action serveur du formulaire s'exécute à la demande.

Le disque de Vercel est en lecture seule : en production, les clés Mailjet sont obligatoires (sinon l'envoi échoue avec un message clair).

## Configuration Mailjet

1. Créer les clés sur <https://app.mailjet.com/account/apikeys>.
2. **Valider le domaine expéditeur** (Account → Sender domains & addresses) : ajouter les enregistrements SPF et DKIM du domaine de `MAIL_FROM`. Sans validation, Mailjet refuse l'envoi ou le message part en spam.
3. Les emails sont envoyés via l'API Send v3.1 (`fetch`, sans SDK) : objet `[Data Quest] Nouvelle demande : <besoin> — <entreprise>`, `Reply-To` = email du prospect.

## Architecture

```
app/                 layout, page, action serveur (actions.ts), robots, sitemap, OG, pages légales
components/sections/ une section = un composant + son CSS Module
components/          ContactForm (client), Analytics (client : dataLayer + pré-sélection du besoin)
content/             données répétées (thèmes, FAQ, tarifs, étapes)
lib/                 lead-rules (validation sans dépendance, client) · lead-schema (zod, serveur)
                     submit-lead (anti-spam, envoi) · mailjet · leads-store · rate-limit · mask · analytics
styles/ui.module.css composants partagés (boutons, titres, conteneur)
tests/               unit (Vitest) et e2e (Playwright)
docs/captures/       captures 1440 px et 390 px, image OG
```

### Formulaire

- Validation client (`lib/lead-rules.ts`, sans zod pour garder le JS léger) **et** serveur (zod). Un test vérifie que les deux donnent les mêmes erreurs.
- Anti-spam : champ piège `website`, délai minimal de 3 s (mesuré côté client, envoyé en `elapsedMs`), limite par IP en mémoire.
- Logs : email et téléphone toujours masqués.

### Mesure d'audience (préparée, non branchée)

Événements poussés dans `window.dataLayer` : `cta_click`, `form_need_select`, `form_start`, `form_submit_success`, `form_submit_error`, `faq_open`. Aucune donnée personnelle. Les boutons d'action portent `data-cta="<emplacement>"` et `data-need="demo|pilot|quote"` ; `?besoin=demo|pilot|quote` pré-sélectionne aussi le besoin.

## À compléter avant mise en ligne

Voir `QUESTIONS.md` : domaine, destinataire, domaine Mailjet, mentions légales et confidentialité (`[À COMPLÉTER]`), photo, outil de mesure et consentement.
