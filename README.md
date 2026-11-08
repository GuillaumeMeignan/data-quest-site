# Data Quest — landing page de vente

Page one-page B2B en **HTML, CSS et JavaScript statiques**, sans framework, sans dépendance et sans étape de build (même approche que `layerdoc-site`). Hébergée sur GitHub Pages ; l'unique conversion est l'envoi du formulaire `#contact`.

## Structure

```
index.html                      page d'accueil (toutes les sections)
mentions-legales/index.html     pages légales (noindex tant qu'elles contiennent des [À COMPLÉTER])
confidentialite/index.html
404.html
assets/css/                     tokens.css (variables), base.css (polices, reset), site.css (composants)
assets/js/config.js             clé Web3Forms (publique)
assets/js/main.js               menu, formulaire (validation, anti-spam, envoi), dataLayer
assets/fonts, assets/img        polices hébergées, logo, image Open Graph
robots.txt, sitemap.xml, CNAME
scripts/dev.js                  serveur local sans dépendance
QUESTIONS.md                    décisions prises et points à valider
```

Les contenus (FAQ, tarifs, étapes, thèmes) sont écrits directement dans `index.html`.

## Tester en local

```bash
npm run dev
```

Puis ouvrir <http://localhost:8000> (aucune installation nécessaire). Autre option : `python3 -m http.server 8000`.

## Formulaire et clé Web3Forms

Le site étant statique, le formulaire appelle Web3Forms **depuis le navigateur**. Il faut renseigner `WEB3FORMS_ACCESS_KEY` dans `assets/js/config.js` (clé créée sur <https://web3forms.com>, liée à l'adresse qui reçoit les demandes). Cette clé est publique par conception : elle ne permet que d'envoyer des messages vers cette adresse. Dans le tableau de bord Web3Forms, lui associer le domaine `data-quest.fr` si l'offre le permet.

Sans clé (champ vide dans `assets/js/config.js`) : en local (`localhost`), rien n'est envoyé et la confirmation s'affiche ; en ligne, l'envoi échoue avec un message clair.

Anti-spam : champ piège invisible et délai minimal de 3 s avant l'envoi. Les événements de mesure (`cta_click`, `form_*`, `faq_open`) sont poussés dans `window.dataLayer`, sans outil ni donnée personnelle.

## Déploiement sur GitHub Pages (data-quest.fr)

Le workflow `.github/workflows/deploy.yml` copie les fichiers du site (sans build) et les publie à chaque push sur `main`.

1. **Settings → Pages → Source : GitHub Actions.**
2. **Domaine** : dans Settings → Pages, renseigner `data-quest.fr` (le fichier `CNAME` le garde à chaque déploiement) et cocher « Enforce HTTPS ». Chez le registrar : pour `data-quest.fr` (apex), enregistrements `A` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` ; pour `www`, un `CNAME` vers `<compte>.github.io`. Vérifier ces adresses dans la documentation GitHub Pages au moment de la mise en place.
3. **Avant la mise en ligne** : compléter les pages légales (puis retirer leur `noindex`), tester un envoi réel.
4. La branche de travail n'est pas déployée : fusionner dans `main` pour publier.
