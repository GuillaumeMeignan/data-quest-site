import ui from "@/styles/ui.module.css";
import styles from "./About.module.css";

export function About() {
  return (
    <section aria-labelledby="h-qui" className={ui.surface}>
      <div className={`${ui.wrap} ${styles.inner}`}>
        <div className={styles.photo}>[Photo]</div>
        <div className={styles.copy}>
          <h2 id="h-qui">Créé par un consultant data, pas par une agence de jeux</h2>
          <p>
            Data Quest est né chez Kimetrix, cabinet de conseil en web analytics fondé en 2017. Chaque carte est écrite par
            quelqu’un qui passe ses journées dans Piano Analytics, GA4 et les CRM de ses clients.
          </p>
          <span className={styles.sign}>Guillaume · fondateur de Kimetrix</span>
        </div>
      </div>
    </section>
  );
}
