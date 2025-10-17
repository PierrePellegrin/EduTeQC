# Récapitulatif des Onglets d'Administration

## 📊 Vue d'ensemble des regroupements

### AdminCoursesScreen (Gestion des Cours)

```
┌─────────────────────────────────────────────────────┐
│ 🔍 Recherche                                         │
├─────────────────────────────────────────────────────┤
│ [Tous] [Matière] [Niveau] [Cycle]  ← Onglets       │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Mode "Matière" :                                    │
│  ▼ Français (12)                                    │
│    📘 Français - CP                                 │
│    📘 Français - CE1                                │
│    📘 Français - CE2                                │
│    ...                                              │
│  ▼ Mathématiques (12)                               │
│    📐 Mathématiques - CP                            │
│    📐 Mathématiques - CE1                           │
│    ...                                              │
│  ▼ Histoire de France (12)                          │
│    📜 Histoire de France - CP                       │
│    ...                                              │
│                                                      │
│ Mode "Niveau" :                                     │
│  ▼ CP (3)                                           │
│    📘 Français - CP                                 │
│    📐 Mathématiques - CP                            │
│    📜 Histoire de France - CP                       │
│  ▼ CE1 (3)                                          │
│    ...                                              │
│                                                      │
│ Mode "Cycle" :                                      │
│  ▼ Primaire (15)                                    │
│    📘 Français - CP                                 │
│    📘 Français - CE1                                │
│    📐 Mathématiques - CP                            │
│    ...                                              │
│  ▼ Collège (12)                                     │
│    ...                                              │
│  ▼ Lycée (9)                                        │
│    ...                                              │
└─────────────────────────────────────────────────────┘
```

### AdminTestsScreen (Gestion des Tests)

```
┌─────────────────────────────────────────────────────┐
│ 🔍 Recherche                                         │
├─────────────────────────────────────────────────────┤
│ [Tous] [Cours] [Niveau] [Cycle]  ← Onglets         │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Mode "Cours" :                                      │
│  ▼ Français - CP (1)                                │
│    📝 Test - Français CP                            │
│  ▼ Français - CE1 (1)                               │
│    📝 Test - Français CE1                           │
│  ▼ Mathématiques - CP (1)                           │
│    📝 Test - Mathématiques CP                       │
│    ...                                              │
│                                                      │
│ Mode "Niveau" :                                     │
│  ▼ CP (3)                                           │
│    📝 Test - Français CP                            │
│    📝 Test - Mathématiques CP                       │
│    📝 Test - Histoire de France CP                  │
│  ▼ CE1 (3)                                          │
│    ...                                              │
│                                                      │
│ Mode "Cycle" :                                      │
│  ▼ Primaire (15)                                    │
│    📝 Test - Français CP                            │
│    📝 Test - Français CE1                           │
│    📝 Test - Mathématiques CP                       │
│    ...                                              │
│  ▼ Collège (12)                                     │
│    ...                                              │
└─────────────────────────────────────────────────────┘
```

### AdminPackagesScreen (Gestion des Forfaits)

```
┌─────────────────────────────────────────────────────┐
│ 🔍 Recherche                                         │
├─────────────────────────────────────────────────────┤
│ [Tous] [Type] [Prix]  ← Onglets                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Mode "Type" :                                       │
│  ▼ Par matière (3)                                  │
│    📦 Pack Français                                 │
│    📦 Pack Mathématiques                            │
│    📦 Pack Histoire de France                       │
│  ▼ Par niveau (12)                                  │
│    📦 Pack CP                                       │
│    📦 Pack CE1                                      │
│    ...                                              │
│  ▼ Par cycle (3)                                    │
│    📦 Pack Primaire                                 │
│    📦 Pack Collège                                  │
│    📦 Pack Lycée                                    │
│  ▼ Par cycle et matière (9)                         │
│    📦 Pack Français - Primaire                      │
│    📦 Pack Français - Collège                       │
│    📦 Pack Mathématiques - Primaire                 │
│    ...                                              │
│                                                      │
│ Mode "Prix" :                                       │
│  ▼ Moins de 40€ (12)                                │
│    📦 Pack CP (29.99€)                              │
│    📦 Pack CE1 (29.99€)                             │
│    ...                                              │
│  ▼ 40€ - 70€ (12)                                   │
│    📦 Pack Français (49.99€)                        │
│    📦 Pack Mathématiques (49.99€)                   │
│    ...                                              │
│  ▼ Plus de 70€ (3)                                  │
│    📦 Pack Primaire (99.99€)                        │
│    📦 Pack Collège (99.99€)                         │
│    📦 Pack Lycée (99.99€)                           │
└─────────────────────────────────────────────────────┘
```

## 🎯 Cas d'usage pratiques

### Scénario 1 : Vérifier tous les cours de mathématiques
1. Aller dans **AdminCoursesScreen**
2. Sélectionner l'onglet **"Matière"**
3. Ouvrir le groupe **"Mathématiques"**
4. Visualiser les 12 cours (CP → Terminale)

### Scénario 2 : Créer des tests pour le niveau 6ème
1. Aller dans **AdminTestsScreen**
2. Sélectionner l'onglet **"Niveau"**
3. Ouvrir le groupe **"6ème"**
4. Vérifier quels tests existent déjà
5. Créer les tests manquants

### Scénario 3 : Gérer les packages par gamme de prix
1. Aller dans **AdminPackagesScreen**
2. Sélectionner l'onglet **"Prix"**
3. Naviguer dans les différentes tranches
4. Ajuster les prix selon la stratégie commerciale

### Scénario 4 : Audit complet d'un cycle
1. Aller dans **AdminCoursesScreen** → onglet **"Cycle"**
2. Vérifier les cours du **"Primaire"** (doit avoir 15 cours)
3. Aller dans **AdminTestsScreen** → onglet **"Cycle"**
4. Vérifier les tests du **"Primaire"** (doit avoir 15 tests)
5. Aller dans **AdminPackagesScreen** → onglet **"Type"**
6. Vérifier les packages pour le cycle **"Primaire"**

## 📈 Statistiques par regroupement

### Cours (Total: 36)
- **Par matière** : 12 Français + 12 Mathématiques + 12 Histoire = 36
- **Par niveau** : 3 par niveau × 12 niveaux = 36
- **Par cycle** : 15 Primaire + 12 Collège + 9 Lycée = 36

### Tests (Total: 36)
- Même répartition que les cours (1 test par cours)

### Packages (Total: 27)
- **Par matière** : 3 packages
- **Par niveau** : 12 packages
- **Par cycle** : 3 packages
- **Par cycle et matière** : 9 packages

## 🔧 Fonctionnalités communes à tous les écrans

### Barre de recherche
- Filtre en temps réel
- Recherche dans titre, description, et champs associés
- Fonctionne avec ou sans regroupement actif

### Accordéons
- Tous ouverts par défaut
- Clic pour ouvrir/fermer individuellement
- Affiche le nombre d'éléments dans le titre
- Icône adaptée au type de regroupement

### Interface responsive
- S'adapte à la taille de l'écran
- Les onglets se redimensionnent automatiquement
- Scrolling fluide même avec beaucoup de contenu

### Bouton d'action flottant (FAB)
- Toujours accessible en bas à droite
- Masqué pendant la création/édition
- Permet de créer rapidement un nouvel élément

## 🎨 Design et UX

### Icônes utilisées
- **view-list** : Vue liste (Tous)
- **folder** : Matière/Catégorie
- **school** : Niveau scolaire
- **repeat** : Cycle
- **book-open-variant** : Cours
- **shape** : Type de package
- **currency-eur** : Prix

### Couleurs et thème
- Utilise le thème de l'application (ThemeContext)
- Support mode clair et sombre
- Cohérence visuelle avec le reste de l'app

### Espacement et marges
- Header : 8px en bas
- Searchbar : 16px horizontal, 8px en bas
- SegmentedButtons : 16px horizontal, 8px en bas
- Accordion : 8px en bas
- Content : 16px padding, 80px padding-bottom (pour le FAB)

## 💡 Conseils d'utilisation

1. **Utiliser la recherche** : Toujours commencer par chercher avant de naviguer
2. **Combiner recherche + regroupement** : Chercher "Français" puis regrouper par "Niveau"
3. **Vérifier les compteurs** : Les nombres entre parenthèses aident à identifier les manques
4. **Replier les groupes** : Pour se concentrer sur un seul groupe à la fois
5. **Mode "Tous"** : Utile quand on ne sait pas dans quel groupe chercher
