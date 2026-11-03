import { FAQ } from "@/content/faq";
import ui from "@/styles/ui.module.css";
import styles from "./Faq.module.css";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="h-faq" className={styles.section}>
      <h2 id="h-faq" className={ui.h2}>
        Vos questions
      </h2>
      <div className={styles.list}>
        {FAQ.map((item) => (
          <details key={item.q} className={styles.item} data-faq={item.q}>
            <summary>
              {item.q}
              <span className={styles.plus} aria-hidden="true">
                +
              </span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
