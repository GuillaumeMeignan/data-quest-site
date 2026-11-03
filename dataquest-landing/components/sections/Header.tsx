"use client";

import { useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import ui from "@/styles/ui.module.css";
import styles from "./Header.module.css";

const LINKS = [
  { href: "#principe", label: "Le principe" },
  { href: "#jeu", label: "Le jeu" },
  { href: "#resultats", label: "Pour vous" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className={`${ui.wrap} ${styles.bar}`}>
        <a href="#top" className={styles.logo}>
          <LogoMark />
          Data Quest
        </a>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fermer" : "Menu"}
        </button>
        <nav id="main-nav" aria-label="Navigation principale" className={styles.nav} data-open={open}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className={`${ui.btn} ${ui.btnSm} ${styles.cta}`}
          data-cta="header"
          data-need="demo"
        >
          Demander une démo
        </a>
      </div>
    </header>
  );
}
