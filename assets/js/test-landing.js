/* Test landing : countdown, sélecteur de formule, formulaire email */
const fs = require("fs");
const path = require("path");

const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

class FakeEl {
  constructor(id) {
    this.id = id;
    this.value = "";
    this.textContent = "";
    this.innerHTML = "";
    this.href = "";
    this.listeners = {};
    this.classList = {
      _set: new Set(),
      add: function (c) { this._set.add(c); },
      remove: function (c) { this._set.delete(c); },
      contains: function (c) { return this._set.has(c); },
    };
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

/* Éléments de la landing */
const planBtns = [new FakeEl("plan-essentiel"), new FakeEl("plan-pro")];
planBtns[0].getAttribute = () => "essentiel";
planBtns[1].getAttribute = () => "pro";
const planMeta = makeEl("plan-meta");

const countdownEls = [];
for (let i = 0; i < 2; i++) {
  const c = new FakeEl("cd" + i);
  const units = [new FakeEl("u" + i + "0"), new FakeEl("u" + i + "1"), new FakeEl("u" + i + "2"), new FakeEl("u" + i + "3")];
  c.querySelectorAll = (s) => (s === ".unit" ? units : []);
  countdownEls.push(c);
}

const emailForm = new FakeEl("email-form");
const emailInput = makeEl("email-input");
const emailErr = makeEl("email-err");
emailForm.querySelector = (s) => (s === 'input[type="email"]' ? emailInput : s === ".field-err" ? emailErr : null);

global.document = {
  readyState: "complete",
  addEventListener() {},
  getElementById(id) { return byId[id] || null; },
  querySelectorAll(sel) {
    if (sel === "[data-countdown]") return countdownEls;
    if (sel === "[data-plan]") return planBtns;
    if (sel === "[data-email-form]") return [emailForm];
    return [];
  },
  title: "",
};
global.window = { location: { href: "http://localhost/index.html", search: "" } };
global.URLSearchParams = URLSearchParams;

const code = fs.readFileSync(path.join(__dirname, "main.js"), "utf-8");
eval(code);

let pass = 0, fail = 0;
function t(name, cond) { if (cond) { pass++; console.log("  ✅ " + name); } else { fail++; console.log("  ❌ " + name); } }

console.log("Test A — compte à rebours");
const units0 = countdownEls[0].querySelectorAll(".unit");
const before = units0.map((u) => u.textContent).join(",");
// attendre ~1.2s pour laisser setInterval(1000) tourner une fois
setTimeout(() => {
  const after = units0.map((u) => u.textContent).join(",");
  t("countdown affiche 4 unités numériques", /^\d{2},\d{2},\d{2},\d{2}$/.test(after));
  t("deadline persistée en localStorage", !!store["coachflow_lancement_fin"]);
  t("le compte à rebours tourne (valeur changée ou 00:00:00:00)", before !== after || after === "00,00,00,00");

  console.log("Test B — sélecteur de formule");
  planBtns[1].dispatch("click");
  t("meta href → paiement.html?formule=pro", planMeta.href === "paiement.html?formule=pro");
  t("meta label → J'achète — 97 €", planMeta.textContent === "J'achète — 97 €");
  planBtns[0].dispatch("click");
  t("meta href → paiement.html?formule=essentiel", planMeta.href === "paiement.html?formule=essentiel");

  console.log("Test C — formulaire email (CTA)");
  emailInput.value = "mauvais-email";
  emailForm.dispatch("submit");
  t("email invalide → message d'erreur", emailErr.classList.contains("show"));
  emailInput.value = "coach@exemple.fr";
  emailForm.dispatch("submit");
  t("email valide → confirmation affichée", emailForm.innerHTML.includes("C'est noté"));
  t("email valide → erreur masquée", !emailErr.classList.contains("show"));

  console.log(`\nRésultat : ${pass} ✅ / ${fail} ❌`);
  process.exit(fail === 0 ? 0 : 1);
}, 1300);
