"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { submitLead } from "@/app/actions";
import { track } from "@/lib/analytics";
import {
  ANALYTICS_LABELS,
  ANALYTICS_TOOLS,
  FIELD_ORDER,
  NEEDS,
  NEED_LABELS,
  NEED_SUBMIT_LABELS,
  PLAYERS_LABELS,
  PLAYERS_RANGES,
  readLeadFields,
  checkLeadFields,
  type FieldErrors,
  type FieldName,
  type Need,
} from "@/lib/lead-rules";
import styles from "./ContactForm.module.css";

type Status = "idle" | "sending" | "sent";

function isNeed(v: unknown): v is Need {
  return typeof v === "string" && (NEEDS as readonly string[]).includes(v);
}

export function ContactForm() {
  const [need, setNeed] = useState<Need>("demo");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAt = useRef(0);
  const started = useRef(false);
  const needRef = useRef(need);
  needRef.current = need;

  // Timer used by the anti-spam minimum delay (reset every time the form is (re)displayed).
  useEffect(() => {
    mountedAt.current = performance.now();
    started.current = false;
  }, [formKey]);

  // Pre-selection of the need: ?besoin= in the URL, or a CTA click (see Analytics component).
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("besoin");
    if (isNeed(fromUrl)) setNeed(fromUrl);
    const onNeed = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (isNeed(detail)) setNeed(detail);
    };
    window.addEventListener("dq:need", onNeed);
    return () => window.removeEventListener("dq:need", onNeed);
  }, []);

  const pickNeed = (n: Need) => {
    setNeed(n);
    track({ event: "form_need_select", need: n });
  };

  const onFirstInput = useCallback(() => {
    if (started.current) return;
    started.current = true;
    track({ event: "form_start", need: needRef.current });
  }, []);

  const focusFirstError = (errs: FieldErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (!first) return;
    requestAnimationFrame(() => {
      const form = formRef.current;
      if (!form) return;
      const el =
        first === "need"
          ? form.querySelector<HTMLElement>("[data-need-option]")
          : (form.elements.namedItem(first) as HTMLElement | null);
      el?.focus();
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("need", need);
    data.set("elapsedMs", String(Math.round(performance.now() - mountedAt.current)));

    const raw = readLeadFields((k) => data.get(k));
    const clientErrors = checkLeadFields(raw);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setFormError("");
      track({ event: "form_submit_error", error_type: "validation" });
      focusFirstError(clientErrors);
      return;
    }
    setErrors({});
    setFormError("");
    setStatus("sending");
    try {
      const result = await submitLead(data);
      if (result.ok) {
        track({
          event: "form_submit_success",
          need: raw.need,
          players_range: raw.players,
          analytics_tool: raw.tool,
        });
        setStatus("sent");
        return;
      }
      setStatus("idle");
      if (result.kind === "validation") {
        setErrors(result.errors);
        focusFirstError(result.errors);
        track({ event: "form_submit_error", error_type: "validation" });
      } else {
        setFormError(result.message);
        track({ event: "form_submit_error", error_type: result.kind });
      }
    } catch {
      setStatus("idle");
      setFormError("L’envoi n’a pas abouti. Vos informations sont conservées : merci de réessayer dans un instant.");
      track({ event: "form_submit_error", error_type: "network" });
    }
  };

  const reset = () => {
    setErrors({});
    setFormError("");
    setStatus("idle");
    setFormKey((k) => k + 1);
  };

  if (status === "sent") {
    return (
      <div role="status" className={styles.sent}>
        <svg aria-hidden="true" width="72" height="72" viewBox="0 0 72 72">
          <rect x="14" y="8" width="40" height="54" rx="6" fill="#2A9D8F" stroke="#22201C" strokeWidth="3" transform="rotate(-8 34 35)" />
          <path d="M24 36 L32 44 L48 26" stroke="#FFF7E8" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>Carte jouée&nbsp;!</h3>
        <p>Merci, votre demande est bien partie. Je reviens vers vous très vite pour caler la démo.</p>
        <button type="button" className={styles.link} onClick={reset}>
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  const err = (f: FieldName) => errors[f];
  const field = (f: FieldName) => ({
    "aria-invalid": err(f) ? (true as const) : undefined,
    "aria-describedby": err(f) ? `${f}-error` : undefined,
  });
  const renderError = (f: FieldName) =>
    err(f) ? (
      <span id={`${f}-error`} className={styles.error}>
        {err(f)}
      </span>
    ) : null;

  return (
    <form
      key={formKey}
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onChange={onFirstInput}
      className={styles.form}
      aria-label="Formulaire de contact"
    >
      <fieldset className={styles.needs} aria-describedby={err("need") ? "need-error" : undefined}>
        <legend>Votre besoin</legend>
        <div className={styles.needRow}>
          {NEEDS.map((n) => (
            <button
              key={n}
              type="button"
              data-need-option
              aria-pressed={need === n}
              className={styles.needBtn}
              onClick={() => pickNeed(n)}
            >
              {NEED_LABELS[n]}
            </button>
          ))}
        </div>
        {renderError("need")}
      </fieldset>

      <div className={styles.grid}>
        <label>
          Prénom et nom
          <input type="text" name="name" required autoComplete="name" placeholder="Camille Roux" maxLength={120} {...field("name")} />
          {renderError("name")}
        </label>
        <label>
          Email professionnel
          <input type="email" name="email" required autoComplete="email" placeholder="camille@entreprise.fr" maxLength={254} {...field("email")} />
          {renderError("email")}
        </label>
        <label>
          Entreprise
          <input type="text" name="company" required autoComplete="organization" placeholder="Maison Dupont" maxLength={120} {...field("company")} />
          {renderError("company")}
        </label>
        <label>
          Nombre de joueurs envisagés
          <select name="players" required defaultValue={PLAYERS_RANGES[0]} {...field("players")}>
            {PLAYERS_RANGES.map((p) => (
              <option key={p} value={p}>
                {PLAYERS_LABELS[p]}
              </option>
            ))}
          </select>
          {renderError("players")}
        </label>
        <label>
          Outil de mesure d’audience
          <select name="tool" required defaultValue={ANALYTICS_TOOLS[0]} {...field("tool")}>
            {ANALYTICS_TOOLS.map((t) => (
              <option key={t} value={t}>
                {ANALYTICS_LABELS[t]}
              </option>
            ))}
          </select>
          {renderError("tool")}
        </label>
        <label>
          <span>
            Téléphone <span className={styles.opt}>· facultatif</span>
          </span>
          <input type="tel" name="phone" autoComplete="tel" maxLength={30} {...field("phone")} />
          {renderError("phone")}
        </label>
      </div>

      <label>
        <span>
          Votre contexte en deux lignes <span className={styles.opt}>· facultatif</span>
        </span>
        <textarea
          name="message"
          rows={3}
          maxLength={1000}
          placeholder="Ex. : nos équipes marketing et magasins ne consultent jamais le dashboard hebdo…"
          {...field("message")}
        />
        {renderError("message")}
      </label>

      {/* Honeypot: invisible to people, tempting for bots. */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Site web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label className={styles.consent}>
          <input type="checkbox" name="consent" required {...field("consent")} />
          <span>
            J’accepte que Kimetrix utilise ces informations pour me recontacter au sujet de Data Quest.{" "}
            <a href="/confidentialite">Politique de confidentialité</a>
          </span>
        </label>
        {renderError("consent")}
      </div>

      {formError && (
        <p role="alert" className={styles.formError}>
          {formError}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={status === "sending"}>
        {status === "sending" ? "Envoi en cours…" : NEED_SUBMIT_LABELS[need]}
      </button>
    </form>
  );
}
