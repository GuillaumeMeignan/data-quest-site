import { DATA_SOURCES } from "@/content/steps";
import { THEMES } from "@/content/themes";
import ui from "@/styles/ui.module.css";
import styles from "./Data.module.css";

export function Data() {
  return (
    <section aria-labelledby="h-data" className={`${ui.wrap} ${styles.section}`}>
      <div className={ui.head}>
        <span className={ui.eyebrow}>VOS DONNÉES, PAS UN QUIZ GÉNÉRIQUE</span>
        <h2 id="h-data" className={ui.h2}>
          «&nbsp;Notre site&nbsp;», «&nbsp;nos clients&nbsp;», «&nbsp;nos ventes&nbsp;»&nbsp;: les cartes parlent de chez vous
        </h2>
        <p className={styles.intro}>
          Chaque joueur reçoit des cartes calculées pour son propre site ou sa langue. Trois sources se mélangent dans
          chaque partie.
        </p>
      </div>
      <div className={styles.grid}>
        {DATA_SOURCES.map((s) => (
          <div key={s.title} className={styles.card}>
            <h3>{s.title}</h3>
            <span>{s.text}</span>
          </div>
        ))}
      </div>
      <div className={styles.themes}>
        <span className={styles.themesTitle}>8 familles de cartes, dosées selon votre modèle (e-commerce, lead gen, SaaS)</span>
        <ul className={styles.pills}>
          {THEMES.map((t) => (
            <li key={t.name} style={{ background: t.pill ?? t.color, color: t.pillText ?? "#fff" }}>
              {t.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
