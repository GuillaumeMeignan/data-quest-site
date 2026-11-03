import { ContactForm } from "@/components/ContactForm";
import styles from "./Contact.module.css";

const STEPS = ["Vous remplissez ce formulaire", "Je vous recontacte personnellement", "30 minutes de démo, sans engagement"];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="h-contact" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="h-contact">Prêt à lancer la première partie&nbsp;?</h2>
          <p>
            Parlons de vos équipes et de vos outils. Je vous montre le jeu sur un exemple proche de votre activité.
          </p>
          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li key={s}>
                <span aria-hidden="true">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.formWrap}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
