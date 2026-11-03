import { STEPS } from "@/content/steps";
import ui from "@/styles/ui.module.css";
import styles from "./Principle.module.css";

export function Principle() {
  return (
    <section id="principe" aria-labelledby="h-principe" className={`${ui.wrap} ${styles.section}`}>
      <div className={ui.head}>
        <span className={ui.eyebrow}>LE PRINCIPE</span>
        <h2 id="h-principe" className={ui.h2}>
          Une partie, trois temps
        </h2>
      </div>
      <ol className={styles.list}>
        {STEPS.map((s, i) => (
          <li key={s.title} className={styles.item}>
            <span className={styles.num} aria-hidden="true">
              {i + 1}
            </span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
