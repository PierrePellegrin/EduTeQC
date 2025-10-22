# Architecture des Sections de Cours - Refonte Complète

## 📋 Vue d'ensemble

Cette refonte transforme la structure des cours d'un système simple à contenu unique vers un système hiérarchique avancé avec sections, sous-sections, et suivi de progression utilisateur.

---

## 🗄️ Schéma de Base de Données

### Nouveaux modèles

#### 1. **CourseSection** - Sections hiérarchiques
```prisma
model CourseSection {
  id          String   @id @default(uuid())
  courseId    String
  parentId    String?  // null = section racine, sinon = sous-section
  title       String
  content     String?  @db.Text // Peut être null si c'est juste un conteneur
  order       Int      @default(0)
  
  course          Course
  parent          CourseSection?    // Section parent
  children        CourseSection[]   // Sous-sections
  tests           Test[]            // Tests associés
  sectionProgress SectionProgress[] // Suivi utilisateur
}
```

**Caractéristiques :**
- **Hiérarchie illimitée** : `parentId` permet de créer autant de niveaux que nécessaire
- **Contenu optionnel** : Les sections peuvent être des conteneurs ou avoir du contenu
- **Ordre flexible** : Chaque section a un ordre pour l'affichage

#### 2. **CourseProgress** - Suivi global du cours
```prisma
model CourseProgress {
  id                  String   @id @default(uuid())
  userId              String
  courseId            String
  lastSectionId       String?  // Dernière section consultée
  completionPercent   Float    @default(0) // Basé sur les tests réussis
  startedAt           DateTime
  lastAccessedAt      DateTime
}
```

**Fonctionnalités :**
- Sauvegarde la dernière section visitée pour reprendre où on s'est arrêté
- Calcule le pourcentage de complétion basé sur les tests
- Affiche sur la card du cours côté client

#### 3. **SectionProgress** - Suivi par section
```prisma
model SectionProgress {
  id          String   @id @default(uuid())
  userId      String
  sectionId   String
  visited     Boolean  @default(false)
  visitedAt   DateTime?
}
```

**Utilité :**
- Track quelles sections ont été visitées
- Permet de calculer la progression fine

### Modifications du modèle existant

#### **Course** - Suppression du champ `content`
```diff
model Course {
  id          String   @id
  title       String
  description String   @db.Text
  category    String
  niveauId    String
  imageUrl    String?
- content     String   @db.Text  ❌ SUPPRIMÉ
  order       Int      @default(0)
  isPublished Boolean  @default(false)
  
+ sections        CourseSection[]   ✅ NOUVEAU
+ courseProgress  CourseProgress[]  ✅ NOUVEAU
}
```

#### **Test** - Ajout de `sectionId`
```diff
model Test {
  id            String   @id
  title         String
  description   String   @db.Text
  courseId      String?  // Optionnel : tests globaux
+ sectionId     String?  // Optionnel : tests de section
  duration      Int
  passingScore  Int      @default(70)
  imageUrl      String?
  isPublished   Boolean  @default(false)
+ order         Int      @default(0)  ✅ NOUVEAU
}
```

---

## 🎨 Interface Admin - Édition de Cours

### Structure proposée avec accordéons

```
📝 Informations générales
   ├─ Titre
   └─ Description

🏷️ Classification
   ├─ Catégorie
   ├─ Cycle
   └─ Niveau

🖼️ Image
   └─ URL + Aperçu rectangle

📚 Structure du cours (NOUVEAU)
   ├─ Liste des sections (arbre hiérarchique)
   ├─ Bouton "Ajouter une section racine"
   └─ Pour chaque section :
      ├─ Titre de la section
      ├─ Bouton "Ajouter sous-section"
      ├─ Bouton "Ajouter contenu"
      ├─ Bouton "Associer test"
      ├─ Bouton "Déplacer" (ordre)
      └─ Bouton "Supprimer"

📝 Éditeur de contenu de section (NOUVEAU)
   └─ Zone de texte riche (markdown ou wysiwyg)

🧪 Tests globaux du cours
   └─ Liste des tests associés au cours global
```

### Composants à créer

#### 1. **CourseSectionTree** - Arbre hiérarchique
```tsx
<CourseSectionTree
  courseId={courseId}
  sections={sections}
  onAddSection={(parentId?) => {}}
  onEditSection={(sectionId) => {}}
  onDeleteSection={(sectionId) => {}}
  onReorder={(sectionId, newOrder) => {}}
/>
```

**Features :**
- Drag & drop pour réorganiser
- Indentation visuelle pour la hiérarchie
- Actions contextuelles (add, edit, delete)
- Expand/collapse des sous-sections

#### 2. **SectionContentEditor** - Éditeur de contenu
```tsx
<SectionContentEditor
  sectionId={sectionId}
  initialContent={content}
  onSave={(content) => {}}
  onCancel={() => {}}
/>
```

**Options :**
- Markdown simple avec preview
- Ou intégrer un éditeur WYSIWYG (ex: React-Quill, Draft.js)

#### 3. **SectionTestAssociator** - Associer des tests
```tsx
<SectionTestAssociator
  sectionId={sectionId}
  availableTests={tests}
  associatedTests={sectionTests}
  onAssociate={(testId) => {}}
  onDisassociate={(testId) => {}}
/>
```

---

## 📱 Interface Client - Navigation du Cours

### Structure proposée

```
┌─────────────────────────────────────────────────┐
│ [← Retour]  Titre du Cours        [Progress: 45%]│
├─────────────────────────────────────────────────┤
│                                                   │
│  📚 Sommaire          │  📄 Contenu               │
│  (30% largeur)        │  (70% largeur)            │
│  ─────────────────    │  ──────────────────────   │
│  ▼ 1. Introduction    │  # Introduction aux...    │
│     • 1.1 Présentation│  Lorem ipsum dolor sit... │
│     • 1.2 Objectifs   │                           │
│  ▶ 2. Chapitre 1      │  [Suivant: 1.2 Objectifs] │
│  ▶ 3. Chapitre 2      │                           │
│  ▼ 4. Exercices       │  Tests associés:          │
│     • 4.1 Quiz 1      │  🧪 Quiz Introduction     │
│     • 4.2 Quiz 2      │     [Commencer le test]   │
│                       │                           │
└───────────────────────┴───────────────────────────┘
```

### Composants à créer

#### 1. **CourseNavigator** - Navigation principale
```tsx
<CourseNavigator
  courseId={courseId}
  currentSectionId={currentSectionId}
  onSectionChange={(sectionId) => {}}
  progress={progress}
/>
```

#### 2. **CourseSidebar** - Sommaire/Menu
```tsx
<CourseSidebar
  sections={sections}
  currentSectionId={currentSectionId}
  sectionProgress={sectionProgress}
  onSelectSection={(sectionId) => {}}
/>
```

**Features :**
- Hiérarchie visuelle (indentation)
- État visité (✓) / non visité
- Section active en surbrillance
- Expand/collapse des sections
- Scroll automatique vers la section active

#### 3. **SectionContent** - Affichage du contenu
```tsx
<SectionContent
  section={section}
  onComplete={() => {}}
  onNext={() => {}}
  onPrevious={() => {}}
/>
```

#### 4. **CourseProgressBar** - Barre de progression
```tsx
<CourseProgressBar
  courseId={courseId}
  completionPercent={completionPercent}
  totalTests={totalTests}
  completedTests={completedTests}
/>
```

---

## 🔢 Calcul de la Progression

### Algorithme proposé

```typescript
function calculateCourseProgress(userId: string, courseId: string): number {
  // 1. Récupérer tous les tests du cours (globaux + sections)
  const allTests = await getTestsForCourse(courseId);
  
  // 2. Récupérer les résultats réussis de l'utilisateur
  const passedTests = await getPassedTestResults(userId, courseId);
  
  // 3. Calculer le pourcentage
  if (allTests.length === 0) return 0;
  
  const progressPercent = (passedTests.length / allTests.length) * 100;
  
  // 4. Mettre à jour CourseProgress
  await updateCourseProgress(userId, courseId, progressPercent);
  
  return progressPercent;
}
```

### Points clés :
- **Basé uniquement sur les tests réussis** (passed = true)
- **Inclut tous les tests** : globaux + tests de chaque section
- **Mis à jour automatiquement** après chaque test complété
- **Affiché sur la card** du cours dans la liste

---

## 🔄 Fonctionnalité "Reprendre où on s'est arrêté"

### Implémentation

```typescript
async function openCourse(userId: string, courseId: string) {
  // 1. Récupérer la progression
  const progress = await CourseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } }
  });
  
  // 2. Déterminer la section à ouvrir
  let targetSectionId: string;
  
  if (progress?.lastSectionId) {
    // Reprendre la dernière section visitée
    targetSectionId = progress.lastSectionId;
  } else {
    // Première visite : ouvrir la première section
    const firstSection = await getFirstSection(courseId);
    targetSectionId = firstSection.id;
  }
  
  // 3. Mettre à jour lastAccessedAt
  await updateLastAccessed(userId, courseId);
  
  // 4. Naviguer vers la section
  return targetSectionId;
}

async function onSectionChange(userId: string, courseId: string, sectionId: string) {
  // Mettre à jour lastSectionId à chaque changement
  await updateCourseProgress(userId, courseId, { 
    lastSectionId: sectionId,
    lastAccessedAt: new Date()
  });
  
  // Marquer la section comme visitée
  await upsertSectionProgress(userId, sectionId, {
    visited: true,
    visitedAt: new Date()
  });
}
```

---

## 📊 API Endpoints à créer/modifier

### Backend Routes

#### Sections
```typescript
// Récupérer les sections d'un cours (avec hiérarchie)
GET    /api/courses/:courseId/sections

// Créer une section
POST   /api/courses/:courseId/sections
Body: { title, parentId?, content?, order }

// Modifier une section
PUT    /api/sections/:sectionId
Body: { title?, content?, order? }

// Supprimer une section
DELETE /api/sections/:sectionId

// Réorganiser les sections
POST   /api/courses/:courseId/sections/reorder
Body: { sectionOrders: [{ id, order }] }
```

#### Progression
```typescript
// Récupérer la progression d'un cours
GET    /api/courses/:courseId/progress

// Mettre à jour la section courante
POST   /api/courses/:courseId/progress/current-section
Body: { sectionId }

// Marquer une section comme visitée
POST   /api/sections/:sectionId/mark-visited

// Calculer et mettre à jour le pourcentage
GET    /api/courses/:courseId/progress/calculate
```

#### Tests
```typescript
// Récupérer les tests d'une section
GET    /api/sections/:sectionId/tests

// Associer un test à une section
POST   /api/sections/:sectionId/tests/:testId

// Dissocier un test d'une section
DELETE /api/sections/:sectionId/tests/:testId
```

---

## 🗂️ Migration des données existantes

### Script de migration

```typescript
// prisma/migrate-to-sections.ts

async function migrateCoursesToSections() {
  const courses = await prisma.course.findMany();
  
  for (const course of courses) {
    if (course.content) {
      // Créer une section "Contenu principal" pour le contenu existant
      await prisma.courseSection.create({
        data: {
          courseId: course.id,
          parentId: null,
          title: "Contenu principal",
          content: course.content,
          order: 0
        }
      });
      
      console.log(`✅ Migrated course: ${course.title}`);
    }
  }
  
  console.log(`🎉 Migration completed for ${courses.length} courses`);
}
```

---

## 🎯 Plan d'implémentation

### Phase 1 : Base de données ✅ (Fait)
- [x] Créer le nouveau schéma avec sections
- [ ] Créer la migration Prisma
- [ ] Exécuter la migration
- [ ] Migrer les données existantes

### Phase 2 : Backend API
- [ ] Services pour CourseSection CRUD
- [ ] Services pour CourseProgress
- [ ] Services pour SectionProgress
- [ ] Endpoints API REST
- [ ] Tests unitaires

### Phase 3 : Admin - Structure du cours
- [ ] Composant CourseSectionTree
- [ ] Composant SectionContentEditor
- [ ] Composant SectionTestAssociator
- [ ] Intégration dans CourseForm
- [ ] Drag & drop pour réorganisation

### Phase 4 : Admin - Tests
- [ ] Modifier le formulaire de création de test
- [ ] Ajouter option "Test global" vs "Test de section"
- [ ] Interface d'association test ↔ section

### Phase 5 : Client - Navigation
- [ ] Composant CourseNavigator
- [ ] Composant CourseSidebar (sommaire)
- [ ] Composant SectionContent
- [ ] Logique "reprendre où on s'est arrêté"
- [ ] Sauvegarde automatique de la position

### Phase 6 : Client - Progression
- [ ] Composant CourseProgressBar
- [ ] Affichage % sur les cards de cours
- [ ] Calcul automatique après chaque test
- [ ] Indicateurs visuels (sections visitées)

### Phase 7 : Tests & Polish
- [ ] Tests end-to-end
- [ ] Optimisation performances
- [ ] UX polish
- [ ] Documentation utilisateur

---

## 🔍 Exemples d'utilisation

### Exemple de structure de cours

```
📘 Cours: Introduction à React
├─ 1. Les Fondamentaux
│  ├─ 1.1 Qu'est-ce que React ?
│  │   └─ 🧪 Quiz: Concepts de base
│  ├─ 1.2 Installation
│  └─ 1.3 Premier composant
│      └─ 🧪 Quiz: Composants
├─ 2. State et Props
│  ├─ 2.1 Comprendre le State
│  ├─ 2.2 Les Props
│  └─ 2.3 Communication parent-enfant
│      └─ 🧪 Test pratique
├─ 3. Hooks
│  ├─ 3.1 useState
│  ├─ 3.2 useEffect
│  ├─ 3.3 useContext
│  └─ 3.4 Hooks personnalisés
└─ 🧪 Test final (global)
```

---

## 💡 Recommandations

### UX
- **Sauvegarde automatique** : Ne pas perdre la progression en cas de fermeture
- **Breadcrumbs** : Afficher le chemin de navigation actuel
- **Recherche** : Permettre de chercher dans les sections
- **Bookmarks** : Permettre de marquer des sections favorites

### Performance
- **Lazy loading** : Charger le contenu des sections à la demande
- **Cache** : Mettre en cache les sections visitées
- **Pagination** : Si trop de sections, paginer l'arbre

### Accessibilité
- **Navigation clavier** : Flèches pour naviguer entre sections
- **ARIA labels** : Indiquer la structure hiérarchique
- **Focus management** : Gérer le focus lors des transitions

---

## 📝 Notes importantes

⚠️ **Breaking changes** :
- Le champ `content` de `Course` est supprimé
- Les tests doivent avoir soit `courseId` soit `sectionId` (ou les deux)
- L'API client pour récupérer un cours change significativement

✅ **Avantages** :
- Structure beaucoup plus flexible et scalable
- Meilleure expérience utilisateur (navigation, progression)
- Possibilité de cours complexes avec chapitres/sous-chapitres
- Suivi détaillé de la progression utilisateur

🚀 **Évolutions futures possibles** :
- Export PDF du cours complet
- Annotations utilisateur sur les sections
- Discussion/commentaires par section
- Temps estimé de lecture par section
- Quiz inline dans le contenu
