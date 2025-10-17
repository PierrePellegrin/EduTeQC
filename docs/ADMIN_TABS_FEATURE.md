# Ajout des Onglets de Regroupement dans l'Administration

## Modifications effectuées

### Pages d'administration mises à jour

Les pages d'administration suivantes ont été améliorées avec des onglets de regroupement similaires à ceux des pages client :

#### 1. **AdminCoursesScreen** (Gestion des cours)

**Onglets de regroupement :**
- **Tous** : Affichage de tous les cours sans regroupement
- **Matière** : Regroupement par catégorie/matière (Français, Mathématiques, Histoire de France)
- **Niveau** : Regroupement par niveau scolaire (CP, CE1, ..., Terminale)
- **Cycle** : Regroupement par cycle (Primaire, Collège, Lycée)

**Fonctionnalités :**
- Recherche par titre, description ou catégorie
- Accordéons dépliables pour chaque groupe
- Affichage du nombre de cours par groupe
- Icônes distinctes pour chaque type de regroupement

#### 2. **AdminTestsScreen** (Gestion des tests)

**Onglets de regroupement :**
- **Tous** : Affichage de tous les tests sans regroupement
- **Cours** : Regroupement par cours associé
- **Niveau** : Regroupement par niveau scolaire du cours
- **Cycle** : Regroupement par cycle du cours

**Fonctionnalités :**
- Recherche par titre, description ou nom du cours
- Accordéons dépliables pour chaque groupe
- Affichage du nombre de tests par groupe
- Navigation vers la gestion des questions

#### 3. **AdminPackagesScreen** (Gestion des forfaits)

**Onglets de regroupement :**
- **Tous** : Affichage de tous les packages sans regroupement
- **Type** : Regroupement par type de package :
  - Par matière (Pack Français, Pack Mathématiques, etc.)
  - Par niveau (Pack CP, Pack CE1, etc.)
  - Par cycle (Pack Primaire, Pack Collège, etc.)
  - Par cycle et matière (Pack Français - Primaire, etc.)
  - Autre
- **Prix** : Regroupement par tranche de prix :
  - Gratuit
  - Moins de 40€
  - 40€ - 70€
  - Plus de 70€

**Fonctionnalités :**
- Recherche par nom ou description
- Accordéons dépliables pour chaque groupe
- Affichage du nombre de packages par groupe
- Détection automatique du type de package

## Améliorations techniques

### Composants utilisés

- **SegmentedButtons** : Pour la sélection du mode de regroupement
- **List.Accordion** : Pour les groupes dépliables/repliables
- **Searchbar** : Pour la recherche textuelle

### Structure du code

Chaque écran d'administration implémente :

1. **État de regroupement** :
```typescript
const [groupBy, setGroupBy] = useState<GroupBy>('none');
const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
```

2. **Calcul des groupes avec useMemo** :
```typescript
const groupedItems = useMemo(() => {
  if (groupBy === 'none') return { 'all': filteredItems };
  // Logique de regroupement
}, [filteredItems, groupBy]);
```

3. **Fonction de basculement des groupes** :
```typescript
const toggleGroup = (groupKey: string) => {
  setExpandedGroups(prev => ({
    ...prev,
    [groupKey]: !prev[groupKey]
  }));
};
```

### Styles ajoutés

Dans chaque fichier `styles.ts` :
```typescript
header: {
  marginBottom: 8,
},
searchbar: {
  margin: 16,
  marginBottom: 8,
  elevation: 2,
},
segmentedButtons: {
  marginHorizontal: 16,
  marginBottom: 8,
},
accordion: {
  marginBottom: 8,
},
```

## Expérience utilisateur

### Avantages

1. **Navigation facilitée** : Les administrateurs peuvent rapidement trouver les éléments par catégorie
2. **Vue d'ensemble** : Le nombre d'éléments par groupe est affiché dans le titre
3. **Cohérence** : Interface similaire entre les pages admin et client
4. **Flexibilité** : Choix entre vue liste ou vue groupée selon les besoins

### Comportement des accordéons

- Par défaut, tous les groupes sont **ouverts** (`expanded={expandedGroups[groupKey] !== false}`)
- L'utilisateur peut replier/déplier chaque groupe individuellement
- L'état d'expansion est préservé lors du changement de recherche

## Cas d'usage

### Pour les cours

- **Vue par matière** : Facilite la gestion d'une matière spécifique
- **Vue par niveau** : Permet de vérifier qu'il y a un cours pour chaque niveau
- **Vue par cycle** : Vue d'ensemble par cycle scolaire

### Pour les tests

- **Vue par cours** : Vérifier les tests associés à chaque cours
- **Vue par niveau** : S'assurer que chaque niveau a ses tests
- **Vue par cycle** : Organisation globale par cycle

### Pour les packages

- **Vue par type** : Distinguer rapidement les packages par matière, niveau, cycle
- **Vue par prix** : Gérer les packages par gamme tarifaire

## Intégration avec le backend

Les regroupements utilisent les données enrichies retournées par l'API backend :

```typescript
// Exemple pour les cours
{
  id: "uuid",
  title: "Français - CP",
  category: "Français",
  niveau: {
    id: "uuid",
    name: "CP",
    cycle: {
      id: "uuid",
      name: "Primaire"
    }
  }
}
```

## Prochaines améliorations possibles

1. **Tri** : Ajouter des options de tri (alphabétique, date, etc.)
2. **Filtres multiples** : Combiner recherche + regroupement + filtres actifs
3. **Persistance** : Sauvegarder les préférences de regroupement de l'utilisateur
4. **Export** : Permettre d'exporter la liste filtrée/groupée
5. **Actions groupées** : Sélection multiple et actions par lot

## Notes techniques

- Les regroupements sont calculés côté client pour une meilleure réactivité
- L'utilisation de `useMemo` optimise les performances lors de la recherche
- Les accordéons sont tous ouverts par défaut pour une meilleure accessibilité
- Le mode de regroupement est masqué lors de l'affichage du formulaire de création/édition
