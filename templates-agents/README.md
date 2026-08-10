# Guide d'utilisation des 4 agents CoachFlow IA

> Les 4 agents ci-dessous sont des **prompts système** : des instructions que vous collez **une seule fois** dans ChatGPT (chatgpt.com) ou Claude (claude.ai), et qui transforment la conversation en un assistant spécialisé pour votre métier.

## Les 4 agents

| # | Fichier | Rôle | Module |
|---|---------|------|--------|
| 1 | `01-compte-rendu-seance.md` | Compte-rendu de séance automatique (dictée → CR envoyable) | Module 2 |
| 2 | `02-relance-client.md` | Messages de relance J+1 / J+3 / J+7 qui ramènent les clients | Module 3 |
| 3 | `03-plan-seance-personnalise.md` | Plan de séance sur mesure en 30 secondes | Module 4 |
| 4 | `04-onboarding-nouveau-client.md` | Entretien de départ + fiche client + programme de démarrage | Module 4 (bonus) |

## Mise en place (10 minutes)

1. **Créez un projet dédié** dans ChatGPT (« CoachFlow ») ou une liste de conversations dans Claude — tout au même endroit.
2. **Copiez chaque prompt** dans une conversation séparée (1 agent = 1 conversation).
3. **Personnalisez** chaque agent (2-3 minutes chacun) :
   - votre métier exact (kiné du sport / coach sportif / prépa physique),
   - votre ton (tutoiement/vouvoiement, direct/doux),
   - votre vocabulaire (vos exercices, vos abréviations).
4. **Testez** chacun avec une situation réelle (votre dernière séance, un vrai client).
5. **Utilisez au quotidien** : dictez, collez, relisez 30 secondes, envoyez.

## Bonnes pratiques (à relire régulièrement)

- **Anonymisez** : utilisez « client A », « client B » ou des prénoms fictifs dans vos prompts. Jamais de nom complet + donnée sensible ensemble.
- **Pas de données médicales sensibles** dans les échanges : l'agent fonctionne avec un minimum d'informations (objectif, ressenti, contraintes).
- **Relisez toujours** avant d'envoyer — 30 secondes, surtout les chiffres (séries, répétitions, charges). Vous restez le professionnel responsable.
- **L'IA ne diagnostique pas** : toute douleur ou blessure = point de vigilance + avis médical si pertinent.
- **L'humain garde la main** : l'IA rédige, vous décidez et vous envoyez. C'est le principe CoachFlow.

## Chaînage entre agents (le flux complet)

```
Nouveau client
   └─► Agent 4 (Onboarding) : entretien → Fiche client + programme de démarrage
          └─► Agent 3 (Plan de séance) : fiche client + objectif → plan de séance n°1
Après chaque séance
   └─► Agent 1 (Compte-rendu) : dictée → CR envoyé au client
Suivi
   └─► Agent 2 (Relance) : situation + contexte → message J+1 / J+3 / J+7
```

## Versionner et améliorer

- Si un agent produit quelque chose que vous n'aimez pas, corrigez en une phrase (« plus concis », « ajoute toujours le temps de repos ») — l'agent s'adapte immédiatement.
- Une fois par mois, relisez les sorties : ce que vous corrigez souvent, ajoutez-le en règle dans le prompt (ex. : « mentionne toujours la progression par rapport à la séance précédente »).
- Conservez vos meilleurs comptes-rendus, relances et plans : ce sont vos futurs exemples et vos futurs témoignages.
