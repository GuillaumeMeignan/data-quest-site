import { Check } from "@/components/ui/Check";
import { DISCOVERY_POINTS, ENTERPRISE_INCLUSIONS } from "@/content/pricing";
import ui from "@/styles/ui.module.css";
import styles from "./Pricing.module.css";

export function Pricing() {
  return (
    <section id="tarifs" aria-labelledby="h-tarifs" className={`${ui.wrap} ${styles.section}`}>
      <div className={ui.head}>
        <span className={ui.eyebrow}>TARIFS</span>
        <h2 id="h-tarifs" className={ui.h2}>
          Vous payez une partie, pas un abonnement
        </h2>
      </div>
      <div className={styles.cols}>
        <div className={styles.enterprise}>
          <span className={styles.ribbon}>L’offre complète</span>
          <div className={styles.titleRow}>
            <h3 className={styles.name}>Enterprise</h3>
            <span className={styles.price}>
              Sur devis <span className={styles.unit}>· à la partie</span>
            </span>
          </div>
          <p className={styles.desc}>
            Une partie de 5 semaines construite sur vos données, avec un accompagnement de bout en bout.
          </p>
          <ul className={styles.inclusions}>
            {ENTERPRISE_INCLUSIONS.map((t) => (
              <li key={t}>
                <Check color="#1E6B5E" size={18} className={styles.check} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className={`${ui.btn} ${ui.btnOnLight} ${styles.cta}`}
            data-cta="pricing_enterprise"
            data-need="quote"
          >
            Recevoir une proposition
          </a>
        </div>

        <div className={styles.discovery}>
          <h3 className={styles.discName}>Découverte</h3>
          <span className={styles.free}>Gratuit</span>
          <ul>
            {DISCOVERY_POINTS.map((p) => (
              <li key={p.text}>{"strong" in p ? <strong>{p.text}</strong> : p.text}</li>
            ))}
          </ul>
          <a href="#contact" className={styles.discCta} data-cta="pricing_discovery" data-need="pilot">
            Essayer gratuitement
          </a>
        </div>
      </div>
    </section>
  );
}
