import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/Logo";
import styles from "./LegalPage.module.css";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <LogoMark />
          Data Quest
        </Link>
      </header>
      <main className={styles.main}>
        <h1>{title}</h1>
        <p className={styles.updated}>Dernière mise à jour : {updated}</p>
        {children}
        <p>
          <Link href="/">← Retour à l’accueil</Link>
        </p>
      </main>
    </>
  );
}
