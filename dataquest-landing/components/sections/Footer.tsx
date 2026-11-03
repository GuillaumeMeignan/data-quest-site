import Link from "next/link";
import ui from "@/styles/ui.module.css";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`${ui.wrap} ${styles.footer}`}>
      <span>Data Quest · un produit Kimetrix</span>
      <nav aria-label="Liens légaux" className={styles.links}>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/confidentialite">Confidentialité</Link>
        <a href="#contact">Contact</a>
      </nav>
    </footer>
  );
}
