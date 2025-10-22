# Interface visuelle - Menu de filtres PackagesShopScreen

## Vue 1 : Menu fermé (par défaut)

```
┌─────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────┐ 🔍│
│ │ Rechercher un forfait                   │ 🔽│  ← Icône filtre (gris)
│ └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ [ Tous ]  [ Type ]                              │  ← Segmented Buttons
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📦 Forfait Primaire Complet                    │
│  Description du forfait...                      │
│  [Voir les cours]  [Acheter 29,99€]             │
└─────────────────────────────────────────────────┘
```

## Vue 2 : Menu ouvert (avec filtres actifs)

```
┌─────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────┐ 🔍│
│ │ Rechercher un forfait                   │ 🔼│  ← Icône filter-off (bleu)
│ └─────────────────────────────────────────┘    │
│                                                 │
│ Cycle                                      [x]  │  ← Mini croix
│ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ Primaire │ │ Collège  │ │ Lycée    │        │
│ └──────────┘ └──────────┘ └──────────┘        │
│     ⭐️ (sélectionné = rempli bleu)             │
│                                                 │
│ Matière                                    [x]  │
│ ┌──────────┐ ┌──────────────┐ ┌──────────┐    │
│ │ Français │ │ Mathématiques│ │ Histoire │    │
│ └──────────┘ └──────────────┘ └──────────┘    │
│                                                 │
│ Année                                      [x]  │
│ ┌────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│ │ CP │ │ CE1 │ │ CE2 │ │ CM1 │ │ CM2 │       │
│ └────┘ └─────┘ └─────┘ └─────┘ └─────┘       │
│                                                 │
│        ┌──────────────────────────┐            │
│        │ ❌ Effacer les filtres   │            │
│        └──────────────────────────┘            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ [ Tous ]  [ Type ]                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📦 Forfait CP Mathématiques                    │
│  Pack complet pour l'année de CP                │
│  [Voir les cours]  [Acheter 19,99€]             │
└─────────────────────────────────────────────────┘
```

## Vue 3 : Filtres - États des chips

### Chip non sélectionné (outlined)
```
┌──────────┐
│ Primaire │  ← Bordure, fond transparent
└──────────┘
```

### Chip sélectionné (flat)
```
┌──────────┐
│ Primaire │  ← Fond bleu (couleur primaire), texte blanc
└──────────┘
```

### Chip "Effacer les filtres" (errorContainer)
```
┌──────────────────────────┐
│ ❌ Effacer les filtres   │  ← Fond rouge clair
└──────────────────────────┘
```

## Comportements interactifs

### 1. Sélection d'un cycle
```
Avant:              Après:
┌──────────┐       ┌──────────┐
│ Primaire │  -->  │ Primaire │  ← Devient bleu
└──────────┘       └──────────┘

                    Année apparaît:
                    ┌────┐ ┌─────┐ ┌─────┐
                    │ CP │ │ CE1 │ │ CE2 │ ...
                    └────┘ └─────┘ └─────┘
```

### 2. Changement de cycle
```
Si Primaire + CE1 sélectionné
Puis clic sur Collège:

→ Primaire se désélectionne
→ Collège se sélectionne
→ CE1 reste actif (car on change juste le cycle)
→ La liste Année change pour afficher 6ème, 5ème, etc.
```

### 3. Désélection d'un cycle
```
Si Collège + 5ème sélectionné
Puis reclic sur Collège:

→ Collège se désélectionne
→ 5ème se désélectionne automatiquement
→ Section Année disparaît
```

### 4. Indicateur visuel du bouton filtre
```
Sans filtres actifs:         Avec filtres actifs:
🔽 (gris/normal)             🔽 (bleu/primary)
```

## Architecture des filtres

```
FilterMenu
│
├── SearchBar (toujours visible)
│   └── Icône filtre toggle
│
└── Section expandable (si ouvert)
    │
    ├── Groupe Cycle
    │   ├── Label + mini-croix
    │   └── Chips: [Primaire] [Collège] [Lycée]
    │
    ├── Groupe Matière
    │   ├── Label + mini-croix
    │   └── Chips dynamiques: [Français] [Math] ...
    │
    ├── Groupe Année (conditionnel: si cycle sélectionné)
    │   ├── Label + mini-croix
    │   └── Chips filtrés: [CP] [CE1] ... (selon cycle)
    │
    └── Bouton "Effacer" (si filtres actifs)
```

## Flux de données

```
Utilisateur interagit
        ↓
FilterMenu (composant)
        ↓
onFiltersChange(newFilters)
        ↓
PackagesShopScreen met à jour l'état
        ↓
Recalcul de filteredPackages (useMemo)
        ↓
FlatList affiche les résultats
```

## Logique de filtrage

```javascript
Packages de départ
        ↓
Filtre 1: Recherche textuelle (nom + description)
        ↓
Filtre 2: Catégorie/Matière
        ↓
Filtre 3: Niveau/Année (si sélectionné)
        ↓
Filtre 4: Cycle (si niveau non sélectionné)
        ↓
Packages filtrés affichés
```

## Responsive design

Les chips s'adaptent automatiquement:
```
Écran large:
[Primaire] [Collège] [Lycée]

Écran étroit:
[Primaire]
[Collège]
[Lycée]
```
