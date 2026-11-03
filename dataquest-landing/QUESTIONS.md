# QUESTIONS.md — décisions prises par défaut

Mis à jour après vos réponses : domaine `data-quest.fr`, Web3Forms, hébergement GitHub Pages, mesure d'audience reportée, photo conservée, lien « Connexion » supprimé.

Aucune réponse n'a été demandée en cours de route. Chaque point ci-dessous indique la décision prise et l'alternative.
Classement par priorité (le plus bloquant pour la mise en ligne en premier).

## Priorité haute (bloquant pour la production)

1. **Nom de domaine et URL finale** — ✅ Tranché : `data-quest.fr`. Renseigner `NEXT_PUBLIC_SITE_URL=https://data-quest.fr` dans Vercel (valeur d'exemple dans `.env.example`).
2. **Destinataire des demandes + confirmation au prospect** — ✅ Tranché : Web3Forms. Le destinataire est l'adresse liée à la clé `WEB3FORMS_ACCESS_KEY` ; pas d'email de confirmation au prospect. Point à vérifier : l'appel serveur à serveur peut dépendre du plan Web3Forms (voir README).
3. **Email de confirmation** — Non prévu (option payante Web3Forms).
4. **Stockage des demandes en plus de l'email** — Défaut : aucun (email seul via Web3Forms, en dev sans clé rien n'est stocké).
5. **Mentions légales et politique de confidentialité** — Défaut : structure standard avec des `[À COMPLÉTER]` (éditeur, SIREN, hébergeur, DPO/contact, durées de conservation, base légale). Aucune donnée inventée. À faire relire.

## Priorité moyenne

6. **Outil de mesure et bannière de consentement** — ✅ Tranché : rien pour le moment. Seuls des `dataLayer.push` sont émis, sans outil ni bannière.
7. **Photo de Guillaume** — ✅ Tranché : emplacement `[Photo]` conservé.
8. **Hébergement** — ✅ Tranché : GitHub Pages. Le site est donc un export statique (`output: "export"`), sans serveur : le formulaire appelle Web3Forms depuis le navigateur (clé publique `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`), validation côté navigateur uniquement, plus de limite par IP. Workflow de déploiement `.github/workflows/deploy.yml`, `public/CNAME` = `data-quest.fr`. L'image Open Graph est un fichier statique `public/og.png` (GitHub Pages ne sert pas correctement une route sans extension).
9. **Lien « Connexion »** — ✅ Tranché : supprimé (déjà absent de l'en-tête).
10. **Anti-spam** — Champ piège + délai minimal de 3 s côté navigateur ; limites propres à Web3Forms (option : restreindre la clé au domaine dans leur tableau de bord).

## Priorité basse (écarts de détail avec la maquette)

11. **Faute dans la maquette** — « Questions personnalisés » corrigé en « Questions personnalisées » (carte Enterprise).
12. **Contrastes AA** — Pastille « Trafic » : texte encre `#22201C` au lieu de blanc ; pastille « Acquisition » : fond `#1A7CA5` au lieu de `#1E88B5` ; bandeau de la carte d'illustration du hero : `#1F7D72` au lieu de `#2A9D8F`. Le blanc sur les couleurs d'origine ne passait pas le ratio 4,5:1. Alternative : revenir aux couleurs d'origine (le test axe échouera).
13. **Radar** — viewBox élargi : l'étiquette « Culture data » était rognée dans la maquette.
14. **Listes déroulantes** — Première option présélectionnée (comme la maquette) : « Moins de 20 » et « Piano Analytics ». Alternative : option vide « Choisir… » pour forcer un choix conscient.
15. **Domaines webmail** — En plus de la liste du brief, `googlemail` et `live` sont refusés. `orange.fr` est refusé mais pas `orange.com` (collaborateurs Orange) : à ajuster si besoin.
16. **Texte « 5 semaines »** (hero, offre Enterprise) vs « 4 à 5 semaines » (étapes) — repris tel quel de la maquette ; à harmoniser si vous le souhaitez.
17. **Pages légales** — `noindex` (tant qu'elles contiennent des `[À COMPLÉTER]`). À retirer une fois complétées.
18. **Dépendances** — `next`, `react`, `react-dom` ; `zod` retiré (plus de serveur) ; en dev : `typescript`, `eslint` (+ `eslint-config-next`, `@eslint/eslintrc`), `vitest`, `@playwright/test`, `@axe-core/playwright`, `serve` (serveur statique pour `npm start` et les tests e2e).
19. **Polices** — Bricolage Grotesque et Nunito Sans en police variable avec l'axe `opsz` (comme la maquette, qui utilise la taille optique automatique) ; ~125 ko de woff2 préchargés.
