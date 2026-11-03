import { PROBLEMS } from "@/content/steps";
import ui from "@/styles/ui.module.css";
import styles from "./Problem.module.css";

function Icon({ name }: { name: (typeof PROBLEMS)[number]["icon"] }) {
  if (name === "dashboard")
    return (
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40">
        <rect x="4" y="8" width="32" height="24" rx="3" fill="#E6EFEA" stroke="#22201C" strokeWidth="2" />
        <path d="M10 26 L16 19 L21 23 L30 13" stroke="#2A9D8F" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "training")
    return (
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40">
        <path d="M6 10 H26 V32 H6 Z" fill="#F1E8D4" stroke="#22201C" strokeWidth="2" />
        <path d="M26 10 L34 6 V28 L26 32" fill="#E6EFEA" stroke="#22201C" strokeWidth="2" strokeLinejoin="round" />
        <path d="M10 16 H22 M10 21 H22 M10 26 H18" stroke="#22201C" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="14" cy="14" r="6" fill="#F7C548" stroke="#22201C" strokeWidth="2" />
      <circle cx="28" cy="16" r="5" fill="#E6EFEA" stroke="#22201C" strokeWidth="2" />
      <path d="M4 34 Q14 20 24 34 Z" fill="#F7C548" stroke="#22201C" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 34 Q28 23 36 34 Z" fill="#E6EFEA" stroke="#22201C" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Problem() {
  return (
    <section aria-labelledby="h-pb" className={ui.light}>
      <div className={`${ui.wrap} ${styles.inner}`}>
        <div className={ui.head}>
          <span className={ui.eyebrow}>LE CONSTAT</span>
          <h2 id="h-pb" className={ui.h2}>
            Vous avez investi dans vos outils data. Qui les regarde vraiment&nbsp;?
          </h2>
        </div>
        <div className={styles.grid}>
          {PROBLEMS.map((p) => (
            <article key={p.title} className={styles.card}>
              <Icon name={p.icon} />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
        <p className={styles.pivot}>
          Data Quest change l’approche&nbsp;: <span>on ne forme pas à la data, on y joue</span>. Un peu chaque jour, assez
          longtemps pour que ça devienne un réflexe.
        </p>
      </div>
    </section>
  );
}
