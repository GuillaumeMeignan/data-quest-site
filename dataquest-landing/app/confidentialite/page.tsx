import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import styles from "@/components/legal/LegalPage.module.css";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Data Quest",
  robots: { index: false, follow: true },
  alternates: { canonical: "/confidentialite" },
};

const T = ({ children }: { children: string }) => <span className={styles.todo}>[À COMPLÉTER : {children}]</span>;

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated="[À COMPLÉTER]">
      <h2>Responsable du traitement</h2>
      <p>
        Le responsable du traitement est <T>dénomination sociale de l’éditeur</T>, <T>adresse</T>. Contact pour toute
        question relative aux données personnelles : <T>adresse email</T>.
      </p>

      <h2>Données collectées</h2>
      <p>
        Via le formulaire de contact : prénom et nom, email professionnel, entreprise, nombre de joueurs envisagés, outil
        de mesure d’audience, téléphone (facultatif) et message (facultatif).
      </p>

      <h2>Finalités et bases légales</h2>
      <p>
        Ces données servent à répondre à votre demande de démo, de partie pilote ou de devis, et à vous recontacter à ce
        sujet. Base légale : votre consentement, exprimé en cochant la case du formulaire <T>à confirmer</T>.
      </p>

      <h2>Destinataires</h2>
      <p>
        Les données sont destinées à l’éditeur. Elles sont transmises par email via un prestataire d’envoi
        (Mailjet) <T>et, le cas échéant, autres sous-traitants : stockage, CRM</T>.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Vos données sont conservées <T>durée, ex. 3 ans à compter du dernier contact</T>.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité.
        Pour les exercer, écrivez à <T>adresse email</T>. Vous pouvez aussi introduire une réclamation auprès de la CNIL
        (www.cnil.fr).
      </p>

      <h2>Mesure d’audience et cookies</h2>
      <p>
        <T>À renseigner selon l’outil de mesure retenu et le bandeau de consentement éventuel.</T> À ce jour, ce site ne
        dépose pas de cookie de mesure.
      </p>
    </LegalPage>
  );
}
