/* ============================================================
   CoachFlow IA — JS partagé (vanilla, zéro dépendance)
   Toutes les fonctions attachées via addEventListener (pas de
   dépendance à window.* depuis d'autres scripts).
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Compte à rebours de lancement ----------
     Prix de lancement garanti 7 jours à partir de la 1re visite.
     Stocké en localStorage pour persister entre les pages. */
  var LS_KEY = "coachflow_lancement_fin";

  function getDeadline() {
    var stored = null;
    try { stored = localStorage.getItem(LS_KEY); } catch (e) {}
    if (stored) {
      var t = parseInt(stored, 10);
      if (!isNaN(t) && t > Date.now()) return t;
    }
    var fin = Date.now() + 7 * 24 * 3600 * 1000;
    try { localStorage.setItem(LS_KEY, String(fin)); } catch (e) {}
    return fin;
  }

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function tickCountdown() {
    var els = document.querySelectorAll("[data-countdown]");
    if (!els.length) return;
    var fin = getDeadline();
    var diff = fin - Date.now();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    els.forEach(function (el) {
      var spans = el.querySelectorAll(".unit");
      if (spans.length >= 4) {
        spans[0].textContent = pad(d);
        spans[1].textContent = pad(h);
        spans[2].textContent = pad(m);
        spans[3].textContent = pad(s);
      }
    });
  }

  /* ---------- Sélecteur de formule (Essentiel / Pro) ---------- */
  function initPlanSwitch() {
    var btns = document.querySelectorAll("[data-plan]");
    if (!btns.length) return;
    var meta = document.getElementById("plan-meta");
    var PLANS = {
      essentiel: { href: "paiement.html?formule=essentiel", label: "J'achète — 47 €" },
      pro: { href: "paiement.html?formule=pro", label: "J'achète — 97 €" }
    };
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-plan");
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        if (meta && PLANS[key]) {
          meta.setAttribute("href", PLANS[key].href);
          meta.textContent = PLANS[key].label;
        }
      });
    });
  }

  /* ---------- Validation d'email (CTA) ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function initEmailForms() {
    var forms = document.querySelectorAll("[data-email-form]");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var err = form.querySelector(".field-err");
        if (!input || !EMAIL_RE.test(input.value.trim())) {
          if (err) err.classList.add("show");
          if (input) input.classList.add("invalid");
          return;
        }
        if (err) err.classList.remove("show");
        if (input) input.classList.remove("invalid");
        /* En production : brancher ici votre outil d'email (MailerLite,
           Brevo, ConvertKit...) via leur endpoint. Ici : confirmation locale. */
        form.innerHTML =
          '<p style="color:#0e9f6e;font-weight:600;font-size:15px;margin:6px 0">✓ C\'est noté ! Vous recevrez les infos du lancement à ' +
          input.value.trim().replace(/</g, "&lt;") +
          ".</p>";
      });
    });
  }

  /* ---------- Paiement (page paiement.html) ---------- */
  function initCheckout() {
    var form = document.getElementById("checkout-form");
    if (!form) return;

    /* Formulaire EmailJS (paiement.html) : les champs carte bancaire n'existent
       plus — la commande est gérée par le script inline (EmailJS). On désactive
       l'ancienne logique Stripe/simulée pour éviter toute erreur. */
    var card = document.getElementById("cf-carte");
    if (!card) return;

    var formule = "essentiel";
    var params = new URLSearchParams(window.location.search);
    if (params.get("formule") === "pro") formule = "pro";

    var PRICES = {
      essentiel: { nom: "CoachFlow Essentiel", prix: 47, old: 87 },
      pro: { nom: "CoachFlow Pro", prix: 97, old: 147 }
    };
    var info = PRICES[formule];

    var nomEl = document.getElementById("cmd-nom");
    var prixEl = document.getElementById("cmd-prix");
    var oldEl = document.getElementById("cmd-old");
    var totalEl = document.getElementById("cmd-total");
    var btnEl = document.getElementById("pay-btn");
    if (nomEl) nomEl.textContent = info.nom;
    if (oldEl) oldEl.textContent = info.old + " €";
    if (prixEl) prixEl.textContent = info.prix + " €";
    if (totalEl) totalEl.textContent = info.prix + " €";
    if (btnEl) btnEl.textContent = "Payer " + info.prix + " €";
    document.title = "Paiement — CoachFlow IA";

    var email = document.getElementById("cf-email");
    var name = document.getElementById("cf-nom");
    var exp = document.getElementById("cf-exp");
    var cvc = document.getElementById("cf-cvc");

    function showErr(input, errId, msg) {
      var err = document.getElementById(errId);
      if (err) { err.textContent = msg; err.classList.add("show"); }
      if (input) input.classList.add("invalid");
    }
    function clearErr(input, errId) {
      var err = document.getElementById(errId);
      if (err) err.classList.remove("show");
      if (input) input.classList.remove("invalid");
    }

    /* Formatage carte : 1234 5678 9012 3456 (formulaire EmailJS : champs absents → guards) */
    if (card) card.addEventListener("input", function () {
      var v = card.value.replace(/\D/g, "").slice(0, 16);
      card.value = v.replace(/(\d{4})(?=\d)/g, "$1 ");
    });
    /* Formatage expiration : MM/AA */
    if (exp) exp.addEventListener("input", function () {
      var v = exp.value.replace(/\D/g, "").slice(0, 4);
      exp.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
    });
    if (cvc) cvc.addEventListener("input", function () {
      cvc.value = cvc.value.replace(/\D/g, "").slice(0, 4);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      if (!EMAIL_RE.test(email.value.trim())) {
        showErr(email, "err-email", "Adresse email invalide."); ok = false;
      } else clearErr(email, "err-email");

      if (name.value.trim().length < 2) {
        showErr(name, "err-nom", "Indiquez votre nom complet."); ok = false;
      } else clearErr(name, "err-nom");

      var cardDigits = card.value.replace(/\D/g, "");
      if (cardDigits.length !== 16) {
        showErr(card, "err-carte", "Numéro de carte incomplet (16 chiffres)."); ok = false;
      } else clearErr(card, "err-carte");

      var expMatch = exp.value.match(/^(\d{2})\/(\d{2})$/);
      if (!expMatch || +expMatch[1] < 1 || +expMatch[1] > 12) {
        showErr(exp, "err-exp", "Format attendu : MM/AA."); ok = false;
      } else clearErr(exp, "err-exp");

      if (cvc.value.length < 3) {
        showErr(cvc, "err-cvc", "CVC invalide (3-4 chiffres)."); ok = false;
      } else clearErr(cvc, "err-cvc");

      var cgv = document.getElementById("cf-cgv");
      if (cgv && !cgv.checked) {
        showErr(null, "err-cgv", "Merci d'accepter les conditions de vente pour continuer.");
        ok = false;
      } else if (cgv) {
        var errCgv = document.getElementById("err-cgv");
        if (errCgv) errCgv.classList.remove("show");
      }

      if (!ok) return;

      /* Paiement simulé : aucune carte n'est débitée. En production,
         remplacer ce bloc par Stripe Checkout / Payplug / Stripe Elements. */
      var btn = document.getElementById("pay-btn");
      var orig = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Traitement…";
      setTimeout(function () {
        try {
          localStorage.setItem(
            "coachflow_achat",
            JSON.stringify({
              formule: formule,
              nom: info.nom,
              prix: info.prix,
              email: email.value.trim(),
              date: new Date().toISOString()
            })
          );
        } catch (err2) {}
        window.location.href =
          "merci.html?formule=" + formule + "&email=" + encodeURIComponent(email.value.trim());
      }, 900);
      /* (le bouton ne redevient jamais actif : on quitte la page) */
      btn.textContent = orig;
    });
  }

  /* ---------- Page merci : confirmation ---------- */
  function initMerci() {
    var box = document.getElementById("merci-box");
    if (!box) return;
    var params = new URLSearchParams(window.location.search);
    var formule = params.get("formule") === "pro" ? "Pro" : "Essentiel";
    var email = params.get("email") || "";
    var noms = { Essentiel: "CoachFlow Essentiel", Pro: "CoachFlow Pro" };
    var prix = { Essentiel: "47 €", Pro: "97 €" };

    var orderId = "CF-" + Date.now().toString(36).toUpperCase().slice(-6);
    var el = document.getElementById("order-id");
    if (el) el.textContent = orderId;
    var e2 = document.getElementById("merci-produit");
    if (e2) e2.textContent = noms[formule];
    var e3 = document.getElementById("merci-prix");
    if (e3) e3.textContent = prix[formule];
    var e4 = document.getElementById("merci-email");
    if (e4) e4.textContent = email || "votre adresse email";

    /* Enregistre l'accès (démo) */
    try {
      var cur = JSON.parse(localStorage.getItem("coachflow_achat") || "null");
      localStorage.setItem("coachflow_achat", JSON.stringify({
        formule: formule.toLowerCase(),
        nom: noms[formule],
        prix: parseInt(prix[formule], 10),
        email: email || (cur && cur.email) || "",
        date: new Date().toISOString()
      }));
    } catch (err) {}
  }

  /* ---------- Porte d'entrée formation ---------- */
  function initGate() {
    var gate = document.getElementById("formation-gate");
    if (!gate) return;
    var achete = false;
    try { achete = !!localStorage.getItem("coachflow_achat"); } catch (e) {}
    var unlock = document.getElementById("btn-unlock-demo");
    if (unlock) {
      unlock.addEventListener("click", function () {
        try {
          localStorage.setItem("coachflow_achat", JSON.stringify({
            formule: "essentiel", nom: "CoachFlow Essentiel (démo)",
            prix: 0, email: "demo@local", date: new Date().toISOString()
          }));
        } catch (e) {}
        document.getElementById("gate-locked") && (document.getElementById("gate-locked").style.display = "none");
        document.getElementById("gate-open") && (document.getElementById("gate-open").style.display = "block");
      });
    }
    if (achete) {
      document.getElementById("gate-locked") && (document.getElementById("gate-locked").style.display = "none");
      document.getElementById("gate-open") && (document.getElementById("gate-open").style.display = "block");
    }
  }

  /* ---------- Animation au scroll (reveal) ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("visible");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          entries[j].target.classList.add("visible");
          io.unobserve(entries[j].target);
        }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    for (var k = 0; k < els.length; k++) io.observe(els[k]);
  }

  /* ---------- Init ---------- */
  function init() {
    tickCountdown();
    setInterval(tickCountdown, 1000);
    initPlanSwitch();
    initEmailForms();
    initCheckout();
    initMerci();
    initGate();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
