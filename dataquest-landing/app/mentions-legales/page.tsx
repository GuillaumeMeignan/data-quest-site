import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import styles from "@/components/legal/LegalPage.module.css";

export const metadata: Metadata = {
  title: "Mentions légales — Data Quest",
  robots: { index: false, follow: true },
  alternates: { canonical: "/mentions-legales" },
};

const T = ({ children }: { children: string }) => <span className={styles.todo}>[À COMPLÉTER : {children}]</span>;

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="[À COMPLÉTER]">
      <h2>Éditeur du site</h2>
      <p>
        Le site Data Quest est édité par <T>dénomination sociale</T>, <T>forme juridique</T> au capital de{" "}
        <T>montant</T>, immatriculée au RCS de <T>ville</T> sous le numéro <T>SIREN</T>.
      </p>
      <p>
        Siège social : <T>adresse postale</T>.<br />
        N° de TVA intracommunautaire : <T>numéro</T>.<br />
        Contact : <T>adresse email</T> · <T>téléphone</T>.
      </p>
      <p>
        Directeur de la publication : <T>nom et prénom</T>.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par <T>hébergeur (ex. Vercel Inc.)</T>, <T>adresse de l’hébergeur</T>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus de ce site (textes, illustrations, logo, marque Data Quest) est la propriété de l’éditeur
        ou utilisé avec autorisation. Toute reproduction sans accord écrit préalable est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données collectées via le formulaire de contact est décrit dans la{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question concernant le site : <T>adresse email</T>.
      </p>
    </LegalPage>
  );
}
