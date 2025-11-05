# 📝 Éditeur de Sections de Cours - Guide d'Utilisation

## Vue d'ensemble

L'éditeur de sections permet aux administrateurs de créer et gérer une structure hiérarchique pour les cours, avec des sections, sous-sections à profondeur illimitée, du contenu formaté en Markdown, et l'association de tests spécifiques.

---

## Accès à l'Éditeur

### Depuis l'Interface Admin

1. **Onglet Cours** → Sélectionner un cours existant → **Modifier**
2. Dans le formulaire d'édition, localiser la carte **"Sections du cours"**
3. Cliquer sur **"Gérer les sections"**

> ⚠️ **Important** : L'éditeur de sections n'est disponible que pour les cours déjà créés (mode édition uniquement). Créez d'abord le cours, puis ajoutez les sections.

---

## Fonctionnalités

### 1. Créer une Section Racine

- Cliquer sur le bouton flottant **"+ Nouvelle section"** en bas à droite
- Remplir le formulaire :
  - **Titre** (obligatoire) : Nom de la section
  - **Contenu** (optionnel) : Texte formaté en Markdown
- Cliquer sur **"Créer"**

### 2. Créer une Sous-Section

- Cliquer sur les **⋮** (menu) à droite d'une section existante
- Sélectionner **"Ajouter sous-section"**
- Remplir le formulaire (un badge indique la section parente)
- Cliquer sur **"Créer"**

### 3. Modifier une Section

- Cliquer sur les **⋮** (menu) à droite de la section
- Sélectionner **"Modifier"**
- Modifier le titre et/ou le contenu
- Cliquer sur **"Mettre à jour"**

### 4. Supprimer une Section

- Cliquer sur les **⋮** (menu) à droite de la section
- Sélectionner **"Supprimer"**
- Confirmer la suppression

> ⚠️ **Attention** : Supprimer une section supprime également toutes ses sous-sections et leur contenu.

### 5. Réorganiser les Sections

#### Méthode 1: Boutons Haut/Bas (Vue Arbre)
- Utiliser les boutons **↑** et **↓** pour déplacer une section vers le haut ou le bas
- L'ordre est automatiquement sauvegardé

#### Méthode 2: Drag & Drop (Vue Réorganiser)
1. Cliquer sur le bouton **"Réorganiser"** en haut de l'écran
2. Appuyer longuement sur l'icône **≡** à gauche d'une section
3. Glisser la section vers sa nouvelle position
4. Relâcher pour confirmer
5. L'ordre est sauvegardé automatiquement

> 💡 **Astuce** : La vue "Réorganiser" affiche uniquement les sections racines. Les sous-sections gardent leur ordre relatif à leur parent.

### 6. Dupliquer une Section

- Cliquer sur les **⋮** (menu) à droite de la section
- Sélectionner **"Dupliquer"**
- Une copie de la section est créée avec " (copie)" ajouté au titre
- La copie conserve tout le contenu Markdown de l'original

> ⚠️ **Note** : La duplication ne copie pas les sous-sections, uniquement la section sélectionnée. Les tests associés ne sont pas dupliqués non plus.

### 7. Prévisualiser le Rendu Markdown

Lors de l'édition d'une section :
1. Dans le formulaire d'édition, utiliser les boutons **"Édition"** / **"Aperçu"** en haut
2. Mode **Édition** : Zone de texte avec syntaxe Markdown + aide rapide
3. Mode **Aperçu** : Rendu en temps réel du contenu formaté

> 💡 **Astuce** : Alternez entre les deux modes pour vérifier le rendu pendant que vous écrivez.

### 8. Gérer les Tests Associés

- Cliquer sur les **⋮** (menu) à droite de la section
- Sélectionner **"Gérer les tests"**
- Cocher/décocher les tests à associer à cette section
- Les tests cochés apparaîtront automatiquement dans la section lors de la consultation

---

## Formatage Markdown

### Syntaxe Supportée

| Élément | Syntaxe | Résultat |
|---------|---------|----------|
| Titre 1 | `# Titre` | <h1>Titre</h1> |
| Titre 2 | `## Titre` | <h2>Titre</h2> |
| Titre 3 | `### Titre` | <h3>Titre</h3> |
| Gras | `**texte**` | **texte** |
| Italique | `*texte*` | *texte* |
| Code inline | `` `code` `` | `code` |
| Liste | `- élément` | • élément |
| Liste numérotée | `1. élément` | 1. élément |
| Citation | `> citation` | Citation en bloc |
| Lien | `[texte](url)` | Lien cliquable |
| Image | `![alt](url)` | Image |
| Code bloc | ` ```code``` ` | Bloc de code |

### Exemple de Contenu

```markdown
# Introduction aux Variables

Les **variables** sont des conteneurs qui permettent de stocker des valeurs en mémoire.

## Types de Variables

En programmation, on distingue plusieurs types :

1. **Entiers** : nombres sans décimales
2. **Réels** : nombres avec décimales
3. **Chaînes** : texte entre guillemets

### Exemple de Code

Voici comment déclarer une variable :

\`\`\`javascript
let age = 25;
let nom = "Pierre";
\`\`\`

> **Important** : Choisissez des noms de variables explicites !

Pour en savoir plus, consultez [la documentation](https://exemple.com).
```

---

## Structure Hiérarchique

### Exemple de Structure

```
📚 Mathématiques - Niveau Débutant
├── 📄 Introduction
├── 📂 Chapitre 1 - Les bases
│   ├── 📄 1.1 - Premier concept
│   └── 📂 1.2 - Deuxième concept
│       └── 📄 1.2.1 - Détail important
├── 📄 Chapitre 2 - Approfondissement
└── 📄 Conclusion
```

### Navigation pour les Étudiants

Lorsqu'un étudiant consulte le cours :

1. **Liste des sections** : Vue arborescente expansible/réductible
2. **Détail de section** : 
   - Fil d'ariane (breadcrumb) en haut
   - Contenu formaté en Markdown
   - Tests associés (si configurés)
   - Boutons **Précédent** / **Suivant** pour naviguer
3. **Barre de progression** : Calculée automatiquement en fonction des sections visitées

---

## Bonnes Pratiques

### Organisation du Contenu

✅ **À faire** :
- Créer une structure logique et progressive
- Limiter la profondeur à 3-4 niveaux maximum
- Donner des titres clairs et descriptifs
- Ajouter du contenu riche avec images et exemples

❌ **À éviter** :
- Créer trop de sous-niveaux (complexifie la navigation)
- Laisser des sections vides
- Utiliser des titres trop longs
- Négliger la progression pédagogique

### Contenu Markdown

✅ **À faire** :
- Structurer avec des titres hiérarchiques
- Utiliser des listes pour les énumérations
- Ajouter des exemples de code si pertinent
- Mettre en valeur les points importants

❌ **À éviter** :
- Abuser du gras et de l'italique
- Créer des paragraphes trop longs
- Négliger les espaces entre les sections
- Oublier de prévisualiser le rendu

### Association des Tests

✅ **À faire** :
- Associer les tests aux sections pertinentes
- Placer les tests après le contenu théorique
- S'assurer que le test couvre le contenu de la section

❌ **À éviter** :
- Associer un test à plusieurs sections (il sera affiché plusieurs fois)
- Placer un test complexe en début de section
- Oublier de tester la cohérence test/contenu

### Réorganisation

✅ **À faire** :
- Utiliser le drag & drop pour les réorganisations importantes
- Tester la navigation après réorganisation
- Vérifier la logique pédagogique de l'ordre

❌ **À éviter** :
- Réorganiser pendant qu'un étudiant consulte le cours
- Changer l'ordre sans vérifier les dépendances entre sections
- Oublier de sauvegarder (le système sauvegarde automatiquement)

---

## API Backend

### Endpoints Utilisés

```
GET    /api/courses/:courseId/sections       # Liste sections d'un cours
POST   /api/courses/:courseId/sections       # Créer une section
GET    /api/sections/:sectionId              # Détails d'une section
PUT    /api/sections/:sectionId              # Modifier une section
DELETE /api/sections/:sectionId              # Supprimer une section
POST   /api/sections/reorder                 # Réorganiser sections
```

### Structure de Données

```typescript
CourseSection {
  id: string
  courseId: string
  parentId: string | null
  title: string
  content: string
  order: number
  children?: CourseSection[]
  createdAt: Date
  updatedAt: Date
}
```

---

## Dépannage

### La section ne s'enregistre pas

- Vérifier que le **titre** est rempli (obligatoire)
- Vérifier la connexion au backend
- Consulter les logs du backend pour les erreurs

### Les sous-sections n'apparaissent pas

- Vérifier que la section parente est bien **expansée** (cliquer sur ▶)
- Rafraîchir la liste des sections
- Vérifier que le `parentId` est correct dans la base de données

### Le contenu Markdown ne s'affiche pas correctement

- Vérifier la syntaxe Markdown
- Tester dans un éditeur Markdown externe
- S'assurer que les balises sont bien fermées

### Les tests ne s'associent pas

- Vérifier que le test existe et est publié
- S'assurer qu'il n'est pas déjà associé à une autre section
- Vérifier les permissions admin

### Le drag & drop ne fonctionne pas

- Vérifier que vous êtes bien en mode "Réorganiser"
- Appuyer **longuement** sur l'icône de déplacement (≡)
- S'assurer que les gestes tactiles sont activés sur l'appareil

### La duplication crée une erreur

- Vérifier que la section originale existe toujours
- S'assurer que le titre dupliqué n'est pas trop long
- Consulter les logs backend pour plus d'informations

---

## Évolutions Futures

### Fonctionnalités Prévues

- ~~**Drag & Drop**~~ : ✅ Implémenté - Réorganiser par glisser-déposer
- ~~**Prévisualisation en temps réel**~~ : ✅ Implémenté - Voir le rendu Markdown pendant l'édition
- ~~**Duplication de sections**~~ : ✅ Implémenté - Copier une section avec son contenu
- **Templates** : Modèles de sections prédéfinis
- **Import/Export** : Importer depuis/exporter vers Markdown/PDF
- **Médias** : Upload d'images et vidéos directement dans l'éditeur
- **Versioning** : Historique des modifications
- **Duplication récursive** : Dupliquer avec toutes les sous-sections

---

## Support

En cas de problème :
1. Consulter la documentation technique dans `docs/COURSE_SECTIONS_ARCHITECTURE.md`
2. Vérifier les logs du backend
3. Contacter le support technique

---

*Dernière mise à jour : Octobre 2025*
