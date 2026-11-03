import { BENEFITS } from "@/content/steps";
import ui from "@/styles/ui.module.css";
import styles from "./Results.module.css";

const KPIS = [
  { label: "Participation", value: "72 %", prev: "Semaine 2 : 69 %" },
  { label: "Questions / joueur", value: "19 / 25", prev: "Semaine 2 : 18" },
  { label: "Bonnes réponses", value: "63 %", prev: "Semaine 2 : 58 %" },
];

export function Results() {
  return (
    <section id="resultats" aria-labelledby="h-res" className={ui.light}>
      <div className={`${ui.wrap} ${styles.inner}`}>
        <div className={ui.head}>
          <span className={ui.eyebrow}>POUR VOUS, MAÎTRE DU JEU</span>
          <h2 id="h-res" className={ui.h2}>
            Chaque vendredi, la preuve que vos équipes progressent
          </h2>
          <p className={styles.intro}>
            Un bilan arrive dans votre boîte mail à la fin de chaque manche, et un bilan final clôt la partie. De quoi
            suivre l’évolution semaine après semaine… et la présenter à votre direction.
          </p>
        </div>
        <div className={styles.cols}>
          <div className={styles.benefits}>
            {BENEFITS.map((b) => (
              <div key={b.title} className={styles.benefit}>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.visuals} role="group" aria-label="Exemples de bilans">
            <article className={styles.mail}>
              <div className={styles.mailHead}>
                <span className={styles.mailTitle}>
                  <svg aria-hidden="true" width="20" height="16" viewBox="0 0 20 16">
                    <rect x="1" y="1" width="18" height="14" rx="2" fill="none" stroke="#F7C548" strokeWidth="2" />
                    <path d="M2 3 L10 9 L18 3" stroke="#F7C548" strokeWidth="2" fill="none" />
                  </svg>
                  Bilan de la semaine 3
                </span>
                <span className={styles.mailMeta}>Vendredi, 18&nbsp;h · email à l’admin</span>
              </div>
              <div className={styles.mailBody}>
                <div className={styles.kpis}>
                  {KPIS.map((k) => (
                    <div key={k.label} className={styles.kpi}>
                      <span className={styles.kpiLabel}>{k.label}</span>
                      <span className={styles.kpiValue}>{k.value}</span>
                      <span className={styles.kpiPrev}>{k.prev}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.chart}>
                  <span className={styles.chartTitle}>Taux de bonne réponse, manche après manche</span>
                  <div
                    role="img"
                    aria-label="Taux de bonne réponse : semaine 1 52 %, semaine 2 58 %, semaine 3 63 %"
                    className={styles.bars}
                  >
                    <span><b>52&nbsp;%</b><span style={{ height: "52%", background: "#2A9D8F" }} className={styles.bar} /></span>
                    <span><b>58&nbsp;%</b><span style={{ height: "58%", background: "#2A9D8F" }} className={styles.bar} /></span>
                    <span><b>63&nbsp;%</b><span style={{ height: "63%", background: "#1E6B5E" }} className={styles.bar} /></span>
                    <span><span className={styles.ghost} /></span>
                    <span><span className={styles.ghost} /></span>
                  </div>
                  <div aria-hidden="true" className={styles.axis}>
                    <span>S1</span><span>S2</span><span>S3</span><span>S4</span><span>S5 · finale</span>
                  </div>
                </div>
                <div className={styles.themes}>
                  <div className={styles.best}>
                    <span>Le mieux réussi</span>
                    <b>Outils &amp; dashboards · 74&nbsp;%</b>
                  </div>
                  <div className={styles.weak}>
                    <span>À renforcer</span>
                    <b>Culture data &amp; RGPD · 47&nbsp;%</b>
                  </div>
                </div>
              </div>
            </article>

            <article className={styles.radar}>
              <svg
                role="img"
                aria-label="Radar de progression ressentie sur 8 thèmes : la courbe de fin de partie englobe celle du début sur tous les thèmes"
                width="320"
                height="250"
                viewBox="-50 0 320 240"
                className={styles.radarSvg}
              >
                <polygon points="120.0,32.0 182.2,57.8 208.0,120.0 182.2,182.2 120.0,208.0 57.8,182.2 32.0,120.0 57.8,57.8" fill="#F4EEDF" stroke="#D8CDB5" strokeWidth="1" />
                <polygon points="120.0,76.0 151.1,88.9 164.0,120.0 151.1,151.1 120.0,164.0 88.9,151.1 76.0,120.0 88.9,88.9" fill="none" stroke="#D8CDB5" strokeWidth="1" />
                <path d="M120 120 L120 32 M120 120 L182.2 57.8 M120 120 L208 120 M120 120 L182.2 182.2 M120 120 L120 208 M120 120 L57.8 182.2 M120 120 L32 120 M120 120 L57.8 57.8" stroke="#D8CDB5" strokeWidth="1" />
                <polygon points="120.0,58.4 163.6,76.4 172.8,120.0 157.3,157.3 120.0,181.6 70.2,169.8 67.2,120.0 82.7,82.7" fill="#2A9D8F" fillOpacity=".35" stroke="#1E6B5E" strokeWidth="3" strokeLinejoin="round" />
                <polygon points="120.0,84.8 151.1,88.9 146.4,120.0 144.9,144.9 120.0,164.0 82.7,157.3 93.6,120.0 95.1,95.1" fill="none" stroke="#8A7F6B" strokeWidth="2.5" strokeDasharray="5 4" strokeLinejoin="round" />
                <g fontFamily="Nunito Sans, sans-serif" fontSize="12" fontWeight="700" fill="#3F3A31">
                  <text x="120" y="22" textAnchor="middle">Trafic</text>
                  <text x="188" y="50" textAnchor="start">Acquisition</text>
                  <text x="214" y="124" textAnchor="start">Conversion</text>
                  <text x="188" y="198" textAnchor="start">Ventes</text>
                  <text x="120" y="226" textAnchor="middle">Clients &amp; CRM</text>
                  <text x="52" y="198" textAnchor="end">Outils</text>
                  <text x="26" y="124" textAnchor="end">Culture data</text>
                  <text x="52" y="50" textAnchor="end">Marché</text>
                </g>
              </svg>
              <div className={styles.radarCopy}>
                <span className={styles.radarKicker}>BILAN FINAL</span>
                <h3>La progression ressentie de vos équipes</h3>
                <span className={styles.legend}>
                  <svg aria-hidden="true" width="28" height="8" viewBox="0 0 28 8"><path d="M1 4 H27" stroke="#8A7F6B" strokeWidth="2.5" strokeDasharray="5 4" /></svg>
                  Au lancement
                </span>
                <span className={`${styles.legend} ${styles.legendBold}`}>
                  <svg aria-hidden="true" width="28" height="8" viewBox="0 0 28 8"><path d="M1 4 H27" stroke="#1E6B5E" strokeWidth="3" /></svg>
                  À la fin de la partie
                </span>
                <span className={styles.radarNote}>Auto-évaluations anonymes, restituées pour toute l’entreprise.</span>
              </div>
            </article>
            <span className={styles.illustrative}>Exemples illustratifs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
