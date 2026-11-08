(function () {
  "use strict";

  /* ---------- Mesure : dataLayer (aucun outil installé, événements prêts) ---------- */
  window.dataLayer = window.dataLayer || [];
  // Ne jamais y mettre de donnée personnelle.
  function track(payload) { window.dataLayer.push(payload); }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".header-toggle");
  var nav = document.getElementById("main-nav");
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.setAttribute("data-open", open ? "true" : "false");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Fermer" : "Menu";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(nav.getAttribute("data-open") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  }

  /* ---------- Formulaire : besoin, validation, anti-spam, envoi Web3Forms ---------- */
  var NEEDS = ["demo", "pilot", "quote"];
  var NEED_LABELS = { demo: "Une démo de 30 min", pilot: "Une partie pilote", quote: "Un devis Enterprise" };
  var NEED_SUBMIT = { demo: "Réserver ma démo", pilot: "Lancer ma partie pilote", quote: "Recevoir mon devis" };
  var PLAYERS = { lt20: "Moins de 20", "20-50": "20 à 50", "50-200": "50 à 200", gt200: "Plus de 200" };
  var TOOLS = { piano: "Piano Analytics", ga4: "Google Analytics 4", other: "Autre / je ne sais pas" };
  var WEBMAIL = ["gmail", "googlemail", "outlook", "hotmail", "live", "yahoo", "icloud", "orange", "free", "laposte", "wanadoo", "sfr"];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+()\d\s.\-]{6,30}$/;
  var MIN_FILL_MS = 3000; // délai minimal de remplissage (anti-robot)
  var FIELD_ORDER = ["need", "name", "email", "company", "players", "tool", "phone", "message", "consent"];
  var MSG = {
    need: "Choisissez votre besoin.",
    name: "Indiquez votre prénom et votre nom.",
    emailRequired: "Indiquez votre email professionnel.",
    emailInvalid: "Cet email ne semble pas valide. Exemple : camille@entreprise.fr",
    emailWebmail: "Merci d’utiliser votre adresse professionnelle : nous échangeons avec des entreprises.",
    company: "Indiquez le nom de votre entreprise.",
    players: "Choisissez le nombre de joueurs envisagés.",
    tool: "Choisissez votre outil de mesure d’audience.",
    phone: "Ce numéro de téléphone ne semble pas valide.",
    message: "Votre message est trop long (1 000 caractères maximum).",
    consent: "Merci de cocher la case pour que nous puissions vous recontacter.",
    sendFailed: "L’envoi n’a pas abouti. Vos informations sont conservées : merci de réessayer dans un instant.",
    tooFast: "Votre demande est partie un peu vite. Patientez un instant puis renvoyez-la."
  };

  var form = document.getElementById("contact-form");
  var sent = document.getElementById("form-sent");
  var formError = document.getElementById("form-error");
  if (!form) return;
  var needInput = form.elements.need;
  var needButtons = Array.prototype.slice.call(form.querySelectorAll("[data-need-option]"));
  var submit = form.querySelector('button[type="submit"]');
  var mountedAt = performance.now();
  var started = false;
  var sending = false;

  function currentNeed() { return needInput.value; }

  function setNeed(need) {
    if (NEEDS.indexOf(need) === -1) return;
    needInput.value = need;
    needButtons.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-need-option") === need ? "true" : "false"); });
    if (!sending) submit.textContent = NEED_SUBMIT[need];
  }

  // Présélection : ?besoin= dans l'URL, puis clic sur un bouton d'appel à l'action.
  var fromUrl = new URLSearchParams(window.location.search).get("besoin");
  if (fromUrl) setNeed(fromUrl);

  needButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      var need = b.getAttribute("data-need-option");
      setNeed(need);
      track({ event: "form_need_select", need: need });
    });
  });

  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a[data-cta]");
    if (!link) return;
    track({
      event: "cta_click",
      cta_location: link.getAttribute("data-cta") || "unknown",
      cta_label: (link.textContent || "").replace(/\s+/g, " ").trim()
    });
    var need = link.getAttribute("data-need");
    if (need) setNeed(need);
  });

  // « toggle » ne remonte pas dans l'arbre : écoute en phase de capture.
  document.addEventListener("toggle", function (e) {
    var el = e.target;
    if (el && el.tagName === "DETAILS" && el.open && el.getAttribute("data-faq")) {
      track({ event: "faq_open", faq_question: el.getAttribute("data-faq") });
    }
  }, true);

  form.addEventListener("input", function () {
    if (started) return;
    started = true;
    track({ event: "form_start", need: currentNeed() });
  });
  form.addEventListener("change", function () {
    if (started) return;
    started = true;
    track({ event: "form_start", need: currentNeed() });
  });

  /* --- Validation --- */
  function isWebmail(email) {
    var domain = (email.split("@")[1] || "").toLowerCase().trim();
    if (!domain) return false;
    return domain.split(".").slice(0, -1).some(function (label) { return WEBMAIL.indexOf(label) !== -1; });
  }

  function readFields() {
    var v = function (n) { return (form.elements[n].value || ""); };
    return {
      need: v("need"), name: v("name"), email: v("email"), company: v("company"),
      players: v("players"), tool: v("tool"), phone: v("phone"), message: v("message"),
      consent: form.elements.consent.checked
    };
  }

  function check(raw) {
    var e = {};
    if (NEEDS.indexOf(raw.need) === -1) e.need = MSG.need;
    var name = raw.name.trim();
    if (!name || name.length > 120) e.name = MSG.name;
    var email = raw.email.trim();
    if (!email) e.email = MSG.emailRequired;
    else if (email.length > 254 || !EMAIL_RE.test(email)) e.email = MSG.emailInvalid;
    else if (isWebmail(email)) e.email = MSG.emailWebmail;
    var company = raw.company.trim();
    if (!company || company.length > 120) e.company = MSG.company;
    if (!PLAYERS[raw.players]) e.players = MSG.players;
    if (!TOOLS[raw.tool]) e.tool = MSG.tool;
    var phone = raw.phone.trim();
    if (phone && (phone.length > 30 || !PHONE_RE.test(phone))) e.phone = MSG.phone;
    if (raw.message.trim().length > 1000) e.message = MSG.message;
    if (raw.consent !== true) e.consent = MSG.consent;
    return e;
  }

  /* --- Affichage des erreurs --- */
  function clearErrors() {
    form.querySelectorAll(".contact-form-error").forEach(function (n) { n.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (f) {
      f.removeAttribute("aria-invalid");
      f.removeAttribute("aria-describedby");
    });
    formError.hidden = true;
    formError.textContent = "";
  }

  function showFormError(text) { formError.textContent = text; formError.hidden = false; }

  function showErrors(errors) {
    clearErrors();
    FIELD_ORDER.forEach(function (f) {
      if (!errors[f]) return;
      var span = document.createElement("span");
      span.id = f + "-error";
      span.className = "contact-form-error";
      span.textContent = errors[f];
      if (f === "need") {
        form.querySelector(".contact-form-needs").appendChild(span);
        return;
      }
      var field = form.elements[f];
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", span.id);
      // Après le champ ; pour le consentement, après le libellé entier.
      var host = f === "consent" ? field.closest("label") : field;
      host.parentNode.insertBefore(span, host.nextSibling);
    });
    var first = FIELD_ORDER.filter(function (f) { return errors[f]; })[0];
    if (first) {
      var el = first === "need" ? needButtons[0] : form.elements[first];
      if (el) el.focus();
    }
  }

  /* --- Envoi --- */
  function buildMessage(raw) {
    var rows = [
      ["Besoin", NEED_LABELS[raw.need]],
      ["Nom", raw.name.trim()],
      ["Email", raw.email.trim()],
      ["Entreprise", raw.company.trim()],
      ["Joueurs envisagés", PLAYERS[raw.players]],
      ["Outil de mesure", TOOLS[raw.tool]],
      ["Téléphone", raw.phone.trim() || "—"],
      ["Contexte", raw.message.trim() || "—"]
    ];
    return rows.map(function (r) { return r[0] + " : " + r[1]; }).join("\n");
  }

  function failure(kind, text) {
    sending = false;
    submit.disabled = false;
    submit.textContent = NEED_SUBMIT[currentNeed()];
    showFormError(text);
    track({ event: "form_submit_error", error_type: kind });
  }

  function success(raw) {
    sending = false;
    track({ event: "form_submit_success", need: raw.need, players_range: raw.players, analytics_tool: raw.tool });
    form.hidden = true;
    sent.hidden = false;
    sent.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    clearErrors();

    var raw = readFields();
    var errors = check(raw);
    if (Object.keys(errors).length) {
      showErrors(errors);
      track({ event: "form_submit_error", error_type: "validation" });
      return;
    }

    // Champ piège rempli : on fait semblant de réussir, sans rien envoyer.
    if (form.elements.website.value.trim() !== "") { success(raw); return; }

    if (performance.now() - mountedAt < MIN_FILL_MS) {
      showFormError(MSG.tooFast);
      track({ event: "form_submit_error", error_type: "too_fast" });
      return;
    }

    if (typeof WEB3FORMS_ACCESS_KEY === "undefined" || !WEB3FORMS_ACCESS_KEY) {
      // En local sans clé : rien n'est envoyé, la confirmation s'affiche. En ligne : échec explicite.
      var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
      if (local) { success(raw); return; }
      failure("send_failed", MSG.sendFailed);
      return;
    }

    sending = true;
    submit.disabled = true;
    submit.textContent = "Envoi en cours…";

    var payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "[Data Quest] Nouvelle demande : " + NEED_LABELS[raw.need] + " — " + raw.company.trim(),
      from_name: "Data Quest",
      name: raw.name.trim(),
      email: raw.email.trim(), // utilisé par Web3Forms comme adresse de réponse
      message: buildMessage(raw),
      botcheck: ""
    };

    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 10000) : null;

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) { return res.json().catch(function () { return null; }).then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        // La confirmation ne s'affiche qu'après une réponse positive de l'API.
        if (r.ok && r.data && r.data.success === true) success(raw);
        else failure("send_failed", MSG.sendFailed);
      })
      .catch(function () { failure("network", MSG.sendFailed); })
      .then(function () { if (timer) clearTimeout(timer); });
  });

  /* --- Nouvelle demande après envoi --- */
  var again = document.getElementById("form-again");
  if (again) {
    again.addEventListener("click", function () {
      form.reset();
      setNeed("demo");
      clearErrors();
      sent.hidden = true;
      form.hidden = false;
      started = false;
      mountedAt = performance.now();
      form.elements.name.focus();
    });
  }
})();
