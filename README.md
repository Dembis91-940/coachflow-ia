# CoachFlow IA — Mini-formation « Automatisez le suivi de vos clients avec l'IA »

> **Produit** : mini-formation pour coachs sportifs & kinés — 4 modules courts + 4 agents IA prêts à copier (compte-rendu de séance, relance client, plan de séance personnalisé, onboarding).
> **Statut** : prêt à vendre. Livré avec landing page, page de paiement, séquence de lancement 7 emails et plan de posting 15 posts.
> **Dossier** : `~/Documents/livrables/mini-formations-ia/`

---

## 1. Business model

### La cible
- **Coachs sportifs** (indépendants, petites structures, coaching en ligne) et **kinés du sport / préparateurs physiques**.
- Profil : débordés par l'administratif, présents dans les groupes Facebook/Discord du secteur, sensibles aux arguments « temps gagné » et « fidélisation ».
- Pourquoi cette niche : communauté active et identifiable, problème de suivi client universel et douloureux (5 h/semaine), pouvoir d'achat correct, et cohérence avec l'écosystème ScoreCoach d'El mouskito.

### Le problème (le hook)
> 5 h/semaine passées en comptes-rendus, relances et programmes → des clients qui disparaissent faute de suivi, des soirées sacrifiées, un cabinet qui plafonne.

### La solution (le produit)
4 modules vidéo (54 min) + 4 agents IA prêts à copier dans ChatGPT/Claude. L'utilisateur final copie-colle, personnalise en 5 min, et automatise son suivi en 1 journée. Zéro compétence technique requise.

### Prix & marges
| Formule | Prix lancement | Prix normal | Marge |
|---|---|---|---|
| Essentiel | **47 €** | 87 € | ~100 % (coût marginal ≈ 0 : hébergement statique + emailing gratuit) |
| Pro | **97 €** | 147 € | ~100 % (même produit + fichiers bonus + accès groupe privé) |

- **Marge ~100 %** : le produit est numérique, livré automatiquement, sans coût unitaire. Seuls coûts réels : l'outil d'emailing (gratuit au début) et le processeur de paiement (~1,5-2,9 %).
- **Stratégie** : prix de lancement garanti 7 jours (urgence réelle + compte à rebours sur la page) → remontée à 87/147 €. Upsell naturel : la formule Pro au moment de l'achat.
- **Économie cible** : 20 ventes Essentiel/session = ~940 € ; 20 ventes Pro = ~1 940 €. En 2-3 sessions/an + evergreen, l'objectif réaliste à 6 mois est de 2 000-5 000 €/mois pour un temps de travail de quelques heures par semaine.

### Canaux de vente (communautés)
1. **Groupes Facebook** : « Coachs sportifs » (entraide/business), « Kinésithérapeutes libéraux », groupes régionaux, groupes de coaching en ligne. Règle : valeur d'abord, vente en commentaire/privé (beaucoup de groupes limitent les liens).
2. **Serveurs Discord fitness/coaching** : salons business/self-promo, version courte des posts + agents en bonus gratuit pour les membres actifs.
3. **Email** : capture des leads via la landing (formulaire CTA) → séquence de lancement 7 emails.
4. **Bonus à terme** : TikTok/Reels « démo du compte-rendu en 30 secondes » (le format démo est viral dans cette niche), puis LinkedIn pour le B2B (salles, centres de kiné).

---

## 2. Ce que contient le dossier

```
mini-formations-ia/
├── README.md                  ← ce fichier (business model, lancement, déploiement)
├── index.html                 ← LANDING PAGE DE VENTE (hero, problème, bénéfices, programme, templates, témoignages, tarifs, garantie, FAQ, CTA)
├── paiement.html              ← PAGE DE PAIEMENT (formulaire sécurisé simulé, récap commande, validation JS)
├── merci.html                 ← CONFIRMATION (n° de commande, accès formation, rappel démo)
├── assets/
│   ├── css/style.css          ← styles partagés (design pro, responsive)
│   └── js/main.js             ← compte à rebours, plan switch, validation, checkout, accès
├── formation/                 ← ESPACE FORMATION (accès conditionné à l'achat)
│   ├── index.html             ← porte d'entrée (module 1-4 + téléchargement des agents)
│   ├── module-1.html          ← slides + script complet prêt à filmer (12 min)
│   ├── module-2.html          ← agent Compte-rendu (14 min) + prompt intégré
│   ├── module-3.html          ← agent Relance (13 min) + prompt intégré
│   └── module-4.html          ← agents Plan de séance & Onboarding (15 min) + prompts intégrés
├── templates-agents/          ← LES 4 AGENTS IA (fichiers .md prêts à copier)
│   ├── 01-compte-rendu-seance.md
│   ├── 02-relance-client.md
│   ├── 03-plan-seance-personnalise.md
│   ├── 04-onboarding-nouveau-client.md
│   └── README.md              ← guide d'utilisation + chaînage des agents
└── lancement/
    ├── sequence-7-emails.md   ← 7 emails complets (J-7 → J+7, hooks + CTA)
    └── plan-posting-15-posts.md ← 15 posts prêts à copier (2 semaines, jours/heures/hooks)
```

### Fonctionnalités clés du site
- **Landing** : design pro responsive, compte à rebours de lancement (7 jours, persisté en localStorage), FAQ accordéon, 2 formules (47 € / 97 €), CTA cohérents.
- **Paiement** : récapitulatif dynamique selon la formule, validation complète du formulaire (email, carte formatée 16 chiffres, expiration MM/AA, CVC, CGV), bandeau « démo » explicite, redirection vers confirmation.
- **Confirmation** : n° de commande généré, récap, accès à la formation.
- **Espace formation** : verrouillé tant que l'achat n'est pas enregistré (localStorage) + bouton « mode démo » pour la présentation.
- **Tout est 100 % vanilla** (HTML/CSS/JS), aucune dépendance externe lourde, fonctionne en local.

---

## 3. Lancement en 2 semaines (pas à pas)

### Semaine 0 (préparation — 1 journée)
- [ ] Ouvrir un compte ChatGPT et/ou Claude (gratuit), tester les 4 agents sur des cas réels.
- [ ] Enregistrer le nom de domaine (ex. coachflow-ia.fr, ~10 €/an) et créer une adresse email pro.
- [ ] Créer un compte sur l'outil d'emailing (Brevo gratuit / MailerLite) + brancher le formulaire email de la landing.
- [ ] Préparer ses comptes : rejoindre 5-10 groupes Facebook de coachs/kinés, 2-3 serveurs Discord. **Ne RIEN vendre la 1re semaine** : commenter, aider, se faire connaître.

### Semaine 1 (autorité — avant le lancement)
- [ ] Poster les posts 1 à 7 du plan de posting (valeur pure, zéro vente).
- [ ] Répondre à tous les commentaires, engager en privé les intéressés.
- [ ] Vérifier la page de vente : serveur local, parcours complet landing → paiement → merci → formation.

### Semaine 2 (lancement)
- [ ] **Lundi** : post 8 (ouverture) + email 5 (J0) envoyé à la liste.
- [ ] **Mar-Ven** : posts 9-12 + emails 6-7 + relances privées des leads chauds.
- [ ] **Sam-Dim** : posts 13-15 (urgence + clôture), annonce des résultats.
- [ ] Livrer : accès automatique + répondre aux questions des participants (le groupe privé Pro est l'endroit idéal).
- [ ] À J+30 : mesurer (temps de suivi, re-réservations), collecter témoignages → les ajouter à la landing (remplacer les témoignages fictifs).

### Après le lancement (evergreen)
- [ ] Passer le prix à 87/147 €, activer la séquence email evergreen (emails 1, 2, 3, 5 espacés).
- [ ] Planifier la session suivante (tous les 1-2 mois) avec les témoignages réels.
- [ ] Créer la déclinaison « ScoreCoach » : la même formation peut devenir le contenu d'onboarding des utilisateurs du SaaS.

---

## 4. Déploiement

### Option A — Mise en ligne en 10 minutes (recommandée pour démarrer)
1. **Netlify Drop** : aller sur app.netlify.com/drop, glisser le dossier `mini-formations-ia/` → le site est en ligne avec une URL https.
2. Renommer l'URL (Settings → Domain) ou brancher le domaine acheté.
3. C'est tout : hébergement statique gratuit, HTTPS inclus.

### Option B — Vercel / GitHub Pages
- **Vercel** : `npx vercel` à la racine du dossier (ou import du repo GitHub).
- **GitHub Pages** : pousser le dossier dans un repo, activer Pages (branch main, dossier racine).

### Option C — Local (test seulement)
```bash
cd ~/Documents/livrables/mini-formations-ia
python3 -m http.server 8000
# ouvrir http://localhost:8000
```

### Brancher le vrai paiement (Stripe — ~30 min)
1. Créer un compte [Stripe](https://stripe.com) (gratuit, ~1,5 % + 0,25 €/transaction).
2. Créer 2 **Payment Links** (un pour Essentiel 47 €, un pour Pro 97 €) dans le dashboard Stripe.
3. Dans `paiement.html`, remplacer l'action du formulaire par les liens Stripe (ou utiliser Stripe Checkout via un mini-backend) ; dans `assets/js/main.js`, remplacer le bloc « Paiement simulé » (balisé `Paiement simulé` dans le code) par la redirection vers le Payment Link.
4. Sur Stripe, activer le webhook ou l'email de confirmation pour envoyer l'accès à la formation automatiquement (ou simplement inclure le lien d'accès dans l'email de reçu Stripe).
> Alternatives : Payplug, Lemon Squeezy (gère la TVA automatiquement — recommandé en France/UE pour ne pas gérer la TVA soi-même), ou Ko-fi/Stripe pour un premier test.

### Brancher l'emailing (10 min)
- Brevo ou MailerLite : créer un formulaire d'inscription, copier le code dans la section CTA de `index.html` (le formulaire actuel est un placeholder fonctionnel en local).
- Importer la séquence de lancement (`lancement/sequence-7-emails.md`) comme campagnes programmées.

### Points légaux à ne pas oublier
- **Mentions légales + CGV + politique de confidentialité** sur la page de paiement (la case CGV existe déjà, il faut y relier les textes).
- **RGPD** : formulaire email avec consentement explicite, lien de désinscription dans chaque email.
- **TVA** : en France, la vente de formations numériques à des particuliers relève de la TVA (taux 20 % sur les ebooks/formations selon le régime — se renseigner ou passer par Lemon Squeezy qui gère tout).
- **Statut** : micro-entrepreneur suffit pour démarrer.

---

## 5. Comment vendre dans les groupes (les règles qui marchent)

1. **Valeur d'abord, toujours** : 2-3 posts utiles (astuces, démos, questions) pour 1 post de vente. Les groupes bannissent les « vendeurs », pas les « contributeurs ».
2. **Lisez les règles du groupe** : certains interdisent la vente directe → postez de la valeur, vendez en privé.
3. **Le lien n'est pas l'objectif, la conversation est l'objectif** : posez une question, répondez à chaque commentaire, passez en privé quand l'intérêt est réel.
4. **Le mot-clé qui convertit** : « je vous montre » (démo) convertit mieux que « achetez ».
5. **La preuve avant le prix** : comptes-rendus générés, messages de relance, plans produits — montrez le résultat concret.
6. **Créez votre propre groupe** à terme : chaque acheteur y est invité (c'est inclus dans la formule Pro) → vous possédez l'audience, plus personne ne peut vous couper l'accès.

---

## 6. Prochaines étapes (au-delà du livrable)

1. **Filmer les 4 modules** : les scripts sont prêts à lire (chaque page de module contient le script complet). Enregistrement simple : téléphone + prompteur, ou Loom/écran + slides.
2. **Tester le parcours** de vente de bout en bout (landing → paiement → merci → formation) en mode démo.
3. **Premier lancement** : 2 semaines, selon le plan ci-dessus.
4. **Itérer avec les vrais chiffres** : taux de conversion, objections réelles, témoignages → améliorer la landing.
5. **Décliner** : la même architecture (landing + paiement + agents + lancement) est réutilisable pour d'autres niches — c'est le « catalogue de mini-formations » que l'orchestrateur vise. La prochaine niche peut reprendre 80 % de ce socle.
