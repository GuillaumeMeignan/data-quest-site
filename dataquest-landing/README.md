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
| `npm test` | Vitest (validation, anti-spam, Web3Forms simulé, masquage des logs) |
| `npm run test:e2e` | Playwright (build + serveur sur le port 3100, parcours formulaire, dataLayer, axe, 390 px) |

Playwright : si Chromium est déjà installé sur la machine, `PW_CHROMIUM_PATH=/chemin/vers/chromium npm run test:e2e`. Sinon `npx playwright install chromium`.

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (Open Graph, sitemap, canonical), sans slash final |
| `WEB3FORMS_ACCESS_KEY` | Clé d'accès Web3Forms (liée à l'adresse qui reçoit les demandes) |
| `LEAD_RATE_LIMIT` | (optionnel) demandes max / IP / 10 min, défaut 5 |

**Sans clé Web3Forms** (développement) : rien n'est envoyé, la demande est écrite dans `.leads/*.json` (ignoré par git) et la confirmation s'affiche normalement.

## Déploiement sur Vercel

1. Importer le dépôt, **Root Directory** = `dataquest-landing`, framework Next.js (détecté).
2. Renseigner `NEXT_PUBLIC_SITE_URL=https://data-quest.fr` et `WEB3FORMS_ACCESS_KEY` (Production + Preview).
3. Déployer. La page est statique ; seule l'action serveur du formulaire s'exécute à la demande.

Le disque de Vercel est en lecture seule : en production, la clé Web3Forms est obligatoire (sinon l'envoi échoue avec un message clair).

## Configuration Web3Forms

1. Sur <https://web3forms.com>, créer une clé d'accès en indiquant l'adresse email qui doit recevoir les demandes (c'est elle, et non une variable du projet, qui définit le destinataire).
2. Mettre la clé dans `WEB3FORMS_ACCESS_KEY` (Vercel : Production + Preview).
3. L'envoi se fait depuis le serveur (`POST https://api.web3forms.com/submit`, JSON) : objet `[Data Quest] Nouvelle demande : <besoin> — <entreprise>`, `email` du prospect utilisé comme adresse de réponse.
4. ⚠️ Web3Forms réserve les appels serveur à serveur à certaines offres : si l'API répond par une erreur de type « server-side access restricted », vérifier le plan du compte (ou passer l'appel côté navigateur, la clé étant faite pour être publique).
5. Pas d'email de confirmation au prospect (option payante chez Web3Forms).

## Architecture

```
app/                 layout, page, action serveur (actions.ts), robots, sitemap, OG, pages légales
components/sections/ une section = un composant + son CSS Module
components/          ContactForm (client), Analytics (client : dataLayer + pré-sélection du besoin)
content/             données répétées (thèmes, FAQ, tarifs, étapes)
lib/                 lead-rules (validation sans dépendance, client) · lead-schema (zod, serveur)
                     submit-lead (anti-spam, envoi) · web3forms · leads-store · rate-limit · mask · analytics
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

Voir `QUESTIONS.md` : domaine, plan Web3Forms, mentions légales et confidentialité (`[À COMPLÉTER]`), photo, outil de mesure et consentement.
