/* Harness de test : stub DOM + localStorage, puis exécution de main.js */
const fs = require("fs");
const path = require("path");

/* ---------- Stub localStorage ---------- */
const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

/* ---------- Stub éléments ---------- */
class FakeEl {
  constructor(id) {
    this.id = id;
    this.value = "";
    this.textContent = "";
    this.innerHTML = "";
    this.disabled = false;
    this.checked = false;
    this.href = "";
    this.listeners = {};
    this.classList = {
      _set: new Set(),
      add: function (c) { this._set.add(c); },
      remove: function (c) { this._set.delete(c); },
      contains: function (c) { return this._set.has(c); },
    };
    this.dataset = {};
    this.style = {};
  }
  addEventListener(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); }
  dispatch(evName) { (this.listeners[evName] || []).forEach((fn) => fn({ preventDefault() {}, target: this })); }
  setAttribute(k, v) { this[k] = v; }
  getAttribute(k) { return this[k]; }
  querySelector(sel) { return null; }
}
FakeEl.prototype.querySelectorAll = () => [];

const byId = {};
function makeEl(id) { if (!byId[id]) byId[id] = new FakeEl(id); return byId[id]; }

/* ---------- Stub document ---------- */
const elsWithDataCountdown = [];
global.document = {
  readyState: "loading",
  _readyFns: [],
  addEventListener(ev, fn) { if (ev === "DOMContentLoaded") this._readyFns.push(fn); },
  getElementById(id) { return byId[id] || null; },
  querySelectorAll(sel) {
    if (sel === "[data-countdown]") return elsWithDataCountdown;
    if (sel === "[data-plan]") return [];
    if (sel === "[data-email-form]") return [];
    return [];
  },
  title: "",
};
// deux compteurs
for (let i = 0; i < 2; i++) {
  const c = new FakeEl("cd" + i);
  c.querySelectorAll = (s) => {
    if (s === ".unit") return [new FakeEl("u" + i + "0"), new FakeEl("u" + i + "1"), new FakeEl("u" + i + "2"), new FakeEl("u" + i + "3")];
    return [];
  };
  elsWithDataCountdown.push(c);
}

/* ---------- Stub window / URLSearchParams ---------- */
let currentUrl = "http://localhost/paiement.html?formule=pro";
let redirectedTo = null;
const fakeLocation = {
  _href: currentUrl,
  get href() { return this._href; },
  set href(v) { redirectedTo = v; this._href = v; },
  get search() { return "?formule=pro"; },
};
global.window = { location: fakeLocation };
global.URLSearchParams = URLSearchParams;

/* ---------- Charger main.js ---------- */
const code = fs.readFileSync(path.join(__dirname, "main.js"), "utf-8");
eval(code);

/* ---------- Tests ---------- */
let pass = 0, fail = 0;
function t(name, cond) { if (cond) { pass++; console.log("  ✅ " + name); } else { fail++; console.log("  ❌ " + name); } }

console.log("Test 1 — initCheckout formule=pro");
// éléments requis par initCheckout
["cmd-nom", "cmd-prix", "cmd-old", "cmd-total", "pay-btn", "checkout-form",
 "cf-email", "cf-nom", "cf-carte", "cf-exp", "cf-cvc", "cf-cgv",
 "err-email", "err-nom", "err-carte", "err-exp", "err-cvc", "err-cgv"].forEach(makeEl);
// prétend que le DOM est chargé
document.readyState = "complete";
// (re)set les valeurs
byId["cmd-nom"].textContent = ""; byId["cmd-prix"].textContent = ""; byId["cmd-old"].textContent = ""; byId["cmd-total"].textContent = ""; byId["pay-btn"].textContent = "";

const fakeSubmit = { preventDefault() {} };
// On force l'init : readyState "loading" à l'évaluation → on ré-évalue avec readyState "complete"
// pour que init() s'exécute immédiatement avec les éléments du stub déjà en place.

console.log("Test 1b — rechargement propre du script");
// Ré-exécuter : les fonctions sont dans une IIFE, on ne peut pas les rappeler — on refait un eval
// après avoir remis readyState à "complete" pour que init() tourne immédiatement.
eval(code);
t("prix affiché = 97 € (formule pro)", byId["cmd-prix"].textContent === "97 €");
t("ancien prix = 147 €", byId["cmd-old"].textContent === "147 €");
t("total = 97 €", byId["cmd-total"].textContent === "97 €");
t("bouton = Payer 97 €", byId["pay-btn"].textContent === "Payer 97 €");
t("titre = Paiement — CoachFlow IA", document.title === "Paiement — CoachFlow IA");

console.log("Test 2 — validation du formulaire (données invalides)");
byId["cf-email"].value = "pas-un-email";
byId["cf-nom"].value = "";
byId["cf-carte"].value = "1234";
byId["cf-exp"].value = "99/99";
byId["cf-cvc"].value = "1";
byId["cf-cgv"].checked = false;
byId["checkout-form"].dispatch("submit");
t("email invalide signalé", byId["err-email"].classList.contains("show"));
t("nom manquant signalé", byId["err-nom"].classList.contains("show"));
t("carte incomplète signalée", byId["err-carte"].classList.contains("show"));
t("expiration invalide signalée", byId["err-exp"].classList.contains("show"));
t("CVC invalide signalé", byId["err-cvc"].classList.contains("show"));
t("CGV non cochée signalée", byId["err-cgv"].classList.contains("show"));
t("pas de redirection sur formulaire invalide", redirectedTo === null);

console.log("Test 3 — validation OK → achat enregistré + redirection");
byId["cf-email"].value = "test@exemple.fr";
byId["cf-nom"].value = "Test User";
byId["cf-carte"].value = "4242 4242 4242 4242";
byId["cf-exp"].value = "12/28";
byId["cf-cvc"].value = "123";
byId["cf-cgv"].checked = true;
// simule le submit → setTimeout 900ms
byId["checkout-form"].dispatch("submit");
t("bouton désactivé pendant traitement", byId["pay-btn"].disabled === true);
// attendre le timeout
setTimeout(() => {
  const achat = JSON.parse(store["coachflow_achat"] || "null");
  t("achat enregistré en localStorage", achat !== null && achat.formule === "pro" && achat.prix === 97);
  t("email de l'acheteur stocké", achat && achat.email === "test@exemple.fr");
  t("redirection vers merci.html avec formule=pro", redirectedTo === "merci.html?formule=pro&email=test%40exemple.fr");

  console.log("Test 4 — formatage carte/expiration");
  const card = byId["cf-carte"];
  card.value = "1234567890123456";
  card.dispatch("input");
  t("carte formatée 4-4-4-4", card.value === "1234 5678 9012 3456");
  const exp = byId["cf-exp"];
  exp.value = "1228";
  exp.dispatch("input");
  t("expiration formatée MM/AA", exp.value === "12/28");

  console.log(`\nRésultat : ${pass} ✅ / ${fail} ❌`);
  process.exit(fail === 0 ? 0 : 1);
}, 1000);