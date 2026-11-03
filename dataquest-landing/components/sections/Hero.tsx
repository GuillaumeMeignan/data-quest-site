import { Check } from "@/components/ui/Check";
import ui from "@/styles/ui.module.css";
import styles from "./Hero.module.css";

const ASSURANCES = ["Prêt en une heure de votre temps", "Piano Analytics ou GA4", "Scores individuels privés"];

export function Hero() {
  return (
    <section id="top" aria-labelledby="h-hero" className={`${ui.wrap} ${styles.hero}`}>
      <div className={styles.copy}>
        <span className={styles.badge}>LE JEU DATA DES ÉQUIPES</span>
        <h1 id="h-hero" className={styles.h1}>
          Vos équipes ouvrent enfin leurs dashboards. <span className={styles.accent}>Chaque matin.</span>
        </h1>
        <p className={styles.lead}>
          Data Quest est un jeu de cartes quotidien sur <strong>les vraies données de votre entreprise</strong>. 5 cartes
          par jour, quelques minutes, pendant 5 semaines&nbsp;: vos salariés apprennent à lire leurs chiffres… et prennent
          l’habitude d’aller les chercher.
        </p>
        <div className={styles.actions}>
          <a href="#contact" className={ui.btn} data-cta="hero" data-need="demo">
            Réserver une démo de 30 min
          </a>
          <a href="#principe" className={ui.btnGhost}>
            Voir comment ça marche
          </a>
        </div>
        <ul className={styles.assurances}>
          {ASSURANCES.map((a) => (
            <li key={a}>
              <Check color="#2A9D8F" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.stage}>
          <div className={`${styles.back} ${styles.backLeft}`} />
          <div className={`${styles.back} ${styles.backRight}`} />
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span>Trafic</span>
              <span>★★☆</span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.question}>
                Le mois dernier, quelle part des visites de notre site s’est faite sur mobile&nbsp;?
              </span>
              <span className={styles.answer}>A · Moins de 40&nbsp;%</span>
              <span className={styles.answer}>B · 40 à 55&nbsp;%</span>
              <span className={`${styles.answer} ${styles.picked}`}>C · 55 à 70&nbsp;%</span>
              <span className={styles.answer}>D · Plus de 70&nbsp;%</span>
            </div>
          </div>
          <div className={styles.combo}>Combo x3&nbsp;! +5</div>
        </div>
      </div>
    </section>
  );
}
