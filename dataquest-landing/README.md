# Data Quest — landing page de vente

Page one-page B2B (Next.js 15 App Router en export statique, TypeScript strict, CSS Modules), hébergée sur GitHub Pages dont l'unique conversion est l'envoi du formulaire `#contact`.

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
| `npm run build` / `npm start` | Export statique dans `out/` / serveur statique local sur <http://localhost:3000> |
| `npm test` | Vitest (validation, anti-spam, Web3Forms simulé, masquage des logs) |
| `npm run test:e2e` | Playwright (build + serveur statique sur le port 3100, Web3Forms intercepté, parcours formulaire, dataLayer, axe, 390 px) |

Playwright : si Chromium est déjà installé sur la machine, `PW_CHROMIUM_PATH=/chemin/vers/chromium npm run test:e2e`. Sinon `npx playwright install chromium`.

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (`https://data-quest.fr`), pour canonical, sitemap et Open Graph |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Clé d'accès Web3Forms, liée à l'adresse qui reçoit les demandes |

Le site étant statique, il n'y a pas de serveur : le formulaire appelle Web3Forms **depuis le navigateur**. La clé est donc publique par conception (elle est visible dans le JavaScript) ; elle ne permet que d'envoyer des messages vers votre adresse. Sans clé en développement, rien n'est envoyé et la confirmation s'affiche normalement (en production, l'envoi échoue avec un message clair).

## Déploiement sur GitHub Pages (data-quest.fr)

Le workflow `.github/workflows/deploy.yml` (à la racine du dépôt) lint, teste, construit `dataquest-landing/` et publie `out/` à chaque push sur `main`.

1. **Settings → Pages → Source : GitHub Actions.**
2. **Settings → Secrets and variables → Actions** : ajouter `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (variable ou secret).
3. **Domaine** : dans Settings → Pages, renseigner `data-quest.fr` (le fichier `public/CNAME` le garde à chaque déploiement) et cocher « Enforce HTTPS ». Chez le registrar : pour `data-quest.fr` (apex), enregistrements `A` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` ; pour `www`, un `CNAME` vers `<compte>.github.io`. Vérifier ces adresses dans la documentation GitHub Pages au moment de la mise en place.
4. La branche de travail n'est pas déployée : fusionner dans `main` pour publier.

## Configuration Web3Forms

1. Sur <https://web3forms.com>, créer une clé d'accès en indiquant l'adresse email qui doit recevoir les demandes (c'est elle qui définit le destinataire).
2. L'appel est un `POST https://api.web3forms.com/submit` en JSON : objet `[Data Quest] Nouvelle demande : <besoin> — <entreprise>`, `email` du prospect utilisé comme adresse de réponse.
3. Pas d'email de confirmation au prospect (option payante chez Web3Forms).
4. Dans le tableau de bord Web3Forms, vous pouvez restreindre la clé au domaine `data-quest.fr`.

## Architecture

```
app/                 layout, page, robots, sitemap, pages légales (+ public/og.png, CNAME)
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

- Validation dans le navigateur (`lib/lead-rules.ts`) : attributs HTML + messages sous chaque champ.
- Anti-spam sans service tiers : champ piège `website` et délai minimal de 3 s. Il n'y a plus de limite par IP (pas de serveur) ; Web3Forms applique ses propres limites.
- Logs : email et téléphone toujours masqués (mode développement uniquement).

### Mesure d'audience (préparée, non branchée)

Événements poussés dans `window.dataLayer` : `cta_click`, `form_need_select`, `form_start`, `form_submit_success`, `form_submit_error`, `faq_open`. Aucune donnée personnelle. Les boutons d'action portent `data-cta="<emplacement>"` et `data-need="demo|pilot|quote"` ; `?besoin=demo|pilot|quote` pré-sélectionne aussi le besoin.

## À compléter avant mise en ligne

Voir `QUESTIONS.md` : plan Web3Forms, mentions légales et confidentialité (`[À COMPLÉTER]`), photo, outil de mesure et consentement.
