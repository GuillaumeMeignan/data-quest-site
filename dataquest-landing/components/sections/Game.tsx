import { MECHANICS } from "@/content/steps";
import ui from "@/styles/ui.module.css";
import styles from "./Game.module.css";

function MechanicIcon({ name }: { name: (typeof MECHANICS)[number]["icon"] }) {
  if (name === "rocket")
    return (
      <svg aria-hidden="true" width="44" height="44" viewBox="0 0 48 48" className={styles.icon}>
        <path d="M24 3 C33 10 35 21 32 31 L16 31 C13 21 15 10 24 3 Z" fill="#FFF7E8" stroke="#22201C" strokeWidth="2" />
        <circle cx="24" cy="16" r="4.5" fill="#4C7BE8" stroke="#22201C" strokeWidth="2" />
        <path d="M16 23 L8 33 L16 31 Z M32 23 L40 33 L32 31 Z" fill="#E4573D" stroke="#22201C" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 32 Q24 47 30 32 Z" fill="#F7C548" stroke="#22201C" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  if (name === "flame")
    return (
      <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" className={styles.icon}>
        <path d="M22 4 C24.5 11 33 14 31.5 24 C30.8 31 27 36 22 36 C16 36 12 32 12 25.5 C12 20 15.5 17 17 13 C18.6 16.5 20.5 17 21 16 C20.3 11.5 20.5 7.5 22 4 Z" fill="#F28C38" stroke="#22201C" strokeWidth="2" />
        <path d="M22 21 C24.5 24.5 27 26.5 25.3 31 C24.4 33 23 34 22 34 C19.5 34 17.8 32 18.3 29.3 C18.8 27 21 25.5 22 21 Z" fill="#F7C548" />
      </svg>
    );
  if (name === "rope")
    return (
      <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" className={styles.icon}>
        <path d="M4 22 H40" stroke="#C9A36B" strokeWidth="5" strokeLinecap="round" />
        <circle cx="10" cy="15" r="6" fill="#4C7BE8" stroke="#22201C" strokeWidth="2" />
        <circle cx="34" cy="15" r="6" fill="#F7C548" stroke="#22201C" strokeWidth="2" />
        <path d="M22 14 V30" stroke="#FFF7E8" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" className={styles.icon}>
      <rect x="8" y="6" width="24" height="32" rx="4" fill="#FFF7E8" stroke="#22201C" strokeWidth="2" />
      <rect x="14" y="10" width="24" height="32" rx="4" fill="#2A9D8F" stroke="#22201C" strokeWidth="2" />
      <path d="M21 26 L24.5 29.5 L31 22" stroke="#FFF7E8" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Game() {
  return (
    <section id="jeu" aria-labelledby="h-jeu" className={ui.surface}>
      <div className={`${ui.wrap} ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={ui.eyebrow}>LE JEU</span>
          <h2 id="h-jeu" className={ui.h2}>
            Pensé pour qu’on y revienne chaque matin
          </h2>
          <p className={styles.intro}>
            Un vrai jeu de société, pas un quiz de formation. Pas de rouge, pas de croix&nbsp;: une mauvaise réponse est une{" "}
            <strong>nouvelle découverte</strong>.
          </p>
          <ul className={styles.list}>
            {MECHANICS.map((m) => (
              <li key={m.title}>
                <MechanicIcon name={m.icon} />
                <span>
                  <strong>{m.title}</strong>
                  <br />
                  {m.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.board} aria-hidden="true">
          <div className={styles.boardHead}>
            <span>Plateau du jour</span>
            <span className={styles.pts}>245 pts</span>
          </div>
          <div className={styles.slots}>
            <span style={{ background: "#2A9D8F" }} />
            <span style={{ background: "#7B5EA7" }} />
            <span style={{ background: "#C97A22" }} />
            <span className={styles.empty} />
            <span className={styles.empty} />
          </div>
          <div className={styles.panel}>
            <span className={styles.panelTitle}>Duel des équipes · manche 2</span>
            <div className={styles.versus}>
              <span style={{ width: "56%", background: "#4C7BE8" }} />
              <span style={{ width: "44%", background: "#F7C548" }} />
            </div>
            <div className={styles.versusLabels}>
              <span>Les Pixels · 56&nbsp;%</span>
              <span>Les Médianes · 44&nbsp;%</span>
            </div>
          </div>
          <div className={`${styles.panel} ${styles.ranking}`}>
            <span className={styles.panelTitle}>Classement</span>
            <div><span>1 · Miss KPI</span><span>310</span></div>
            <div><span>2 · Capitaine Clic</span><span>285</span></div>
            <div className={styles.me}><span>3 · Toi</span><span>245</span></div>
          </div>
          <span className={styles.note}>Aperçu illustratif</span>
        </div>
      </div>
    </section>
  );
}
