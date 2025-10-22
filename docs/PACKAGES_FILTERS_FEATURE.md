# Filtres avancés pour PackagesShopScreen

## Résumé des modifications

J'ai ajouté un système de filtres avancés sur l'écran de choix des packages de la vue client (`PackagesShopScreen`). Les filtres sont maintenant accessibles dans un menu repliable avec la barre de recherche.

## Fichiers créés

### 1. `mobile/src/screens/packages/PackagesShopScreen/components/FilterMenu.tsx`
Nouveau composant qui gère :
- Barre de recherche
- Filtre par cycle (Primaire, Collège, Lycée)
- Filtre par matière (catégories des cours)
- Filtre par année (niveaux : CP, CE1, 6ème, etc.)
- Bouton d'effacement des filtres

Caractéristiques :
- Menu fermé par défaut avec bouton toggle (icône filtre)
- L'icône filtre change de couleur quand des filtres sont actifs
- Le filtre "Année" n'apparaît que si un cycle est sélectionné
- Les filtres sont interactifs : cliquer à nouveau désactive le filtre
- Design responsive avec chips pour une meilleure UX

### 2. `mobile/src/screens/packages/PackagesShopScreen/components/styles.ts`
Styles pour le composant FilterMenu avec :
- Layout en flex pour une disposition responsive
- Espacements cohérents
- Animations fluides

### 3. `mobile/src/screens/packages/PackagesShopScreen/components/index.ts`
Fichier d'export pour le composant et son type `FilterState`

## Fichiers modifiés

### 1. `mobile/src/services/api.ts`
Ajout de l'API `cyclesApi` avec les méthodes :
- `getAllCycles()` : Récupère tous les cycles
- `getAllNiveaux()` : Récupère tous les niveaux
- `getNiveauxByCycle(cycleId)` : Récupère les niveaux d'un cycle spécifique

### 2. `mobile/src/screens/packages/PackagesShopScreen/index.tsx`
Modifications majeures :
- Import du composant `FilterMenu` et de l'API `cyclesApi`
- Ajout de l'état `filters` (type `FilterState`) pour gérer les filtres
- Ajout de requêtes pour récupérer les cycles et niveaux
- Extraction automatique des catégories uniques depuis les packages
- Logique de filtrage avancée qui combine :
  - Recherche textuelle (nom et description)
  - Filtre par catégorie (matière)
  - Filtre par niveau (année)
  - Filtre par cycle (avec cascade sur les niveaux)
- Remplacement de la barre de recherche standalone par le composant `FilterMenu`
- Déplacement des `SegmentedButtons` sous le `FilterMenu`

### 3. `backend/src/services/package.service.ts`
Ajout du champ `niveauId` dans la sélection des cours :
```typescript
courses: {
  select: {
    course: {
      select: {
        id: true,
        title: true,
        category: true,
        niveauId: true,  // Nouveau champ
      },
    },
  },
}
```

## Fonctionnement

### État initial
- Le menu de filtres est fermé par défaut
- Seule la barre de recherche et le bouton filtre sont visibles
- Le bouton filtre a une couleur normale

### Ouverture du menu
- Cliquer sur le bouton filtre ouvre/ferme le menu
- Le menu affiche 3 sections de filtres :
  1. **Cycle** : Primaire, Collège, Lycée
  2. **Matière** : Liste dynamique des catégories disponibles
  3. **Année** : Visible uniquement si un cycle est sélectionné

### Filtrage
Les filtres sont cumulatifs et fonctionnent ensemble :
1. **Recherche** : Filtre par nom ou description du package
2. **Matière** : Affiche uniquement les packages contenant des cours de cette catégorie
3. **Année** : Affiche uniquement les packages contenant des cours de ce niveau
4. **Cycle** : Si aucune année n'est sélectionnée, filtre par tous les niveaux du cycle

### Indicateurs visuels
- Les filtres actifs sont affichés en mode "flat" (remplis)
- Le bouton filtre principal change de couleur quand des filtres sont actifs
- Un bouton "Effacer les filtres" apparaît quand au moins un filtre est actif
- Chaque groupe de filtres a une petite croix pour réinitialiser rapidement

## Structure des données

### FilterState
```typescript
{
  search: string;           // Texte de recherche
  cycleId: string | null;   // ID du cycle sélectionné
  category: string | null;  // Catégorie (matière) sélectionnée
  niveauId: string | null;  // ID du niveau (année) sélectionné
}
```

### Cycle
```typescript
{
  id: string;
  name: string;      // Ex: "Primaire", "Collège", "Lycée"
  order: number;
}
```

### Niveau
```typescript
{
  id: string;
  name: string;      // Ex: "CP", "CE1", "6ème", "5ème"
  cycleId: string;
  order: number;
}
```

## API Backend requises

Les endpoints suivants doivent être disponibles :
- `GET /api/cycles` : Liste tous les cycles
- `GET /api/niveaux` : Liste tous les niveaux
- `GET /api/cycles/:cycleId/niveaux` : Liste les niveaux d'un cycle

Ces routes existent déjà dans `backend/src/routes/cycle.routes.ts`

## Tests recommandés

1. Vérifier que le menu s'ouvre/ferme correctement
2. Tester chaque filtre individuellement
3. Tester la combinaison de plusieurs filtres
4. Vérifier que le filtre "Année" n'apparaît que si un cycle est sélectionné
5. Tester le bouton "Effacer les filtres"
6. Vérifier que l'indicateur visuel (couleur du bouton) fonctionne
7. Tester avec des données réelles pour s'assurer que le filtrage est correct

## Notes techniques

- Utilisation de `useDeferredValue` pour optimiser les performances de la recherche
- Les catégories sont extraites dynamiquement des packages disponibles
- Le filtrage par cycle prend en compte tous les niveaux du cycle sélectionné
- Les données sont mises en cache par React Query pour de meilleures performances
