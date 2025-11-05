# 📚 Refonte Complète : Cours avec Sections Hiérarchiques

## 🎯 Objectif

Transformer la structure simple des cours (titre + description + contenu unique) vers une **architecture hiérarchique avancée** avec :
- ✅ Sections et sous-sections illimitées
- ✅ Contenu par section
- ✅ Tests par section + tests globaux
- ✅ Suivi de progression utilisateur
- ✅ Reprise automatique de la dernière section
- ✅ Pourcentage d'avancement sur les cards

---

## 📊 Changements Majeurs

### Avant (Structure actuelle)
```
Course
├─ title
├─ description
├─ category
├─ content  ← UN SEUL BLOC DE CONTENU
├─ imageUrl
└─ tests[]  ← Tests associés au cours
```

### Après (Nouvelle structure)
```
Course
├─ title
├─ description
├─ category
├─ imageUrl
├─ sections[]  ← HIÉRARCHIE DE SECTIONS
│  ├─ Section 1
│  │  ├─ title
│  │  ├─ content
│  │  ├─ tests[]
│  │  └─ children[]  ← Sous-sections
│  │     ├─ Section 1.1
│  │     │  ├─ content
│  │     │  ├─ tests[]
│  │     │  └─ children[]
│  │     │     └─ Section 1.1.1
│  │     └─ Section 1.2
│  └─ Section 2
├─ tests[]  ← Tests globaux du cours
└─ courseProgress[]  ← Progression par utilisateur
   ├─ lastSectionId
   ├─ completionPercent
   └─ lastAccessedAt
```

---

## 🗄️ Nouveaux Modèles de Base de Données

### 1. CourseSection (Sections hiérarchiques)
```prisma
model CourseSection {
  id          String
  courseId    String
  parentId    String?     // null = racine, sinon = sous-section
  title       String
  content     String?     // Optionnel
  order       Int
  
  parent      CourseSection?   // Récursif
  children    CourseSection[]  // Récursif
  tests       Test[]
}
```

### 2. CourseProgress (Suivi global)
```prisma
model CourseProgress {
  id                String
  userId            String
  courseId          String
  lastSectionId     String?   // Reprendre où on s'est arrêté
  completionPercent Float     // Basé sur tests réussis
  lastAccessedAt    DateTime
}
```

### 3. SectionProgress (Suivi par section)
```prisma
model SectionProgress {
  id        String
  userId    String
  sectionId String
  visited   Boolean
  visitedAt DateTime?
}
```

---

## 🎨 Interface Admin : Édition avec Accordéons

### Nouveau formulaire de création/édition de cours

```
┌─────────────────────────────────────────────────────┐
│ 📝 Informations générales          [▼]              │
│    ├─ Titre                                         │
│    └─ Description                                   │
├─────────────────────────────────────────────────────┤
│ 🏷️ Classification                  [▼]              │
│    ├─ Catégorie (dropdown)                         │
│    ├─ Cycle (dropdown)                             │
│    └─ Niveau (dropdown filtré)                     │
├─────────────────────────────────────────────────────┤
│ 🖼️ Image                           [▼]              │
│    ├─ URL                                           │
│    └─ Aperçu (rectangle)                           │
├─────────────────────────────────────────────────────┤
│ 📚 Structure du cours              [▼]  ✨ NOUVEAU  │
│    ┌───────────────────────────────────────────┐   │
│    │ 📄 1. Introduction                        │   │
│    │    [✏️ Éditer] [➕ Sous-section] [🗑️]     │   │
│    │    └─ 📄 1.1 Présentation                │   │
│    │       [✏️] [➕] [🗑️]                       │   │
│    │       └─ 🧪 Quiz 1                        │   │
│    │ 📄 2. Chapitre 1                          │   │
│    │    [✏️] [➕] [🗑️]                          │   │
│    │                                            │   │
│    │ [➕ Ajouter une section racine]           │   │
│    └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│ 🧪 Tests globaux du cours         [▼]              │
│    ├─ Test final                                   │
│    └─ [➕ Associer un test]                        │
└─────────────────────────────────────────────────────┘
```

### Composants à créer

1. **CourseSectionTree** : Arbre hiérarchique drag & drop
2. **SectionEditor** : Modal d'édition de section
3. **SectionTestManager** : Associer tests à section

---

## 📱 Interface Client : Navigation Améliorée

### Vue cours avec sommaire + contenu

```
┌─────────────────────────────────────────────────────────────┐
│ [←]  Introduction à React              Progress: 65% ████▒  │
├──────────────┬──────────────────────────────────────────────┤
│ 📚 SOMMAIRE  │  📄 CONTENU                                  │
│ (30%)        │  (70%)                                       │
│              │                                              │
│ ▼ 1. Intro   │  # 1.1 Qu'est-ce que React ?               │
│   ✓ 1.1 ...  │                                             │
│   → 1.2 ...  │  React est une bibliothèque JavaScript...  │
│   ○ 1.3 ...  │                                             │
│ ▶ 2. State   │  Lorem ipsum dolor sit amet...             │
│ ▶ 3. Hooks   │                                             │
│              │  [◀ Précédent] [Suivant ▶]                 │
│              │                                             │
│              │  🧪 Tests associés:                        │
│              │  └─ Quiz React Basics [Commencer]         │
└──────────────┴──────────────────────────────────────────────┘

Légende:
✓ = Visité
→ = Section actuelle
○ = Non visité
```

### Composants à créer

1. **CourseNavigator** : Wrapper principal
2. **CourseSidebar** : Sommaire avec hiérarchie
3. **SectionContent** : Affichage du contenu
4. **CourseProgressBar** : Barre de progression

---

## 📊 Card de Cours avec Progression

### Avant
```
┌─────────────────┐
│   [Image]       │
│                 │
│ Titre du cours  │
│ Description     │
│                 │
│ [Commencer]     │
└─────────────────┘
```

### Après
```
┌─────────────────┐
│   [Image]       │
│ ████▒▒▒▒▒ 45%  │ ← Progression
│ Titre du cours  │
│ Description     │
│                 │
│ [Reprendre]     │ ← "Reprendre" si déjà commencé
└─────────────────┘
```

---

## 🔢 Calcul de la Progression

### Formule
```typescript
completionPercent = (testsRéussis / totalTests) * 100

où:
- testsRéussis = nombre de tests avec passed=true
- totalTests = tests globaux + tests de toutes les sections
```

### Mise à jour automatique
- Après chaque test complété
- Recalculé en temps réel
- Affiché sur la card et dans le cours

---

## 🔄 Reprise Automatique

### Comportement

1. **Première visite** :
   → Ouvre la première section

2. **Visites suivantes** :
   → Ouvre `lastSectionId`

3. **À chaque changement de section** :
   → Sauvegarde `lastSectionId` et `lastAccessedAt`

---

## 📁 Fichiers Créés

### Documentation
- ✅ `docs/COURSE_SECTIONS_ARCHITECTURE.md` - Architecture complète
- ✅ `docs/MIGRATION_GUIDE.md` - Guide de migration pas à pas
- ✅ `docs/COURSE_SECTIONS_SUMMARY.md` - Ce fichier

### Base de données
- ✅ `backend/prisma/schema-new-sections.prisma` - Nouveau schéma
- ✅ `backend/prisma/migrations/add_course_sections.sql` - Migration SQL
- ✅ `backend/prisma/migrate-to-sections.ts` - Script de migration

### Backend (À créer)
- [ ] `backend/src/services/course-section.service.ts`
- [ ] `backend/src/services/course-progress.service.ts`
- [ ] `backend/src/controllers/course-section.controller.ts`
- [ ] `backend/src/controllers/course-progress.controller.ts`
- [ ] `backend/src/routes/course-section.routes.ts`

### Frontend Admin (À créer)
- [ ] `mobile/src/screens/admin/AdminCoursesScreen/components/CourseSectionTree.tsx`
- [ ] `mobile/src/screens/admin/AdminCoursesScreen/components/SectionEditor.tsx`
- [ ] `mobile/src/screens/admin/AdminCoursesScreen/components/SectionTestManager.tsx`

### Frontend Client (À créer)
- [ ] `mobile/src/screens/courses/CourseNavigatorScreen.tsx`
- [ ] `mobile/src/components/CourseSidebar.tsx`
- [ ] `mobile/src/components/SectionContent.tsx`
- [ ] `mobile/src/components/CourseProgressBar.tsx`

---

## 🚀 Plan d'Implémentation

### Phase 1 : Base de données ✅
- [x] Nouveau schéma Prisma
- [x] Migration SQL
- [x] Script de migration des données
- [ ] Exécuter la migration
- [ ] Valider les données

### Phase 2 : Backend API (2-3 jours)
- [ ] Services CRUD sections
- [ ] Services progression
- [ ] Controllers
- [ ] Routes API
- [ ] Tests unitaires

### Phase 3 : Admin - Structure (3-4 jours)
- [ ] CourseSectionTree
- [ ] SectionEditor
- [ ] SectionTestManager
- [ ] Drag & drop
- [ ] Intégration dans CourseForm

### Phase 4 : Client - Navigation (3-4 jours)
- [ ] CourseNavigator
- [ ] CourseSidebar
- [ ] SectionContent
- [ ] Logique de reprise
- [ ] Sauvegarde auto

### Phase 5 : Progression (2 jours)
- [ ] CourseProgressBar
- [ ] Affichage sur cards
- [ ] Calcul automatique
- [ ] Indicateurs visuels

### Phase 6 : Tests & Polish (2-3 jours)
- [ ] Tests E2E
- [ ] Optimisations
- [ ] UX polish
- [ ] Documentation

**Durée estimée totale : 12-16 jours**

---

## ⚠️ Points d'Attention

### Breaking Changes
- ❌ Le champ `content` de `Course` est supprimé
- ❌ L'API de récupération de cours change
- ❌ Structure de données complètement différente

### Compatibilité
- ✅ Les tests existants restent fonctionnels
- ✅ Migration automatique des données
- ✅ Rollback possible en cas de problème

### Performance
- ⚡ Lazy loading des sections
- ⚡ Cache des sections visitées
- ⚡ Optimisation des requêtes récursives

---

## 📞 Prochaines Étapes

1. **Validation** : Confirmer l'architecture proposée
2. **Migration** : Suivre le guide de migration
3. **Développement** : Implémenter phase par phase
4. **Tests** : Valider chaque fonctionnalité
5. **Déploiement** : Mise en production progressive

---

**Questions ? Consultez :**
- `COURSE_SECTIONS_ARCHITECTURE.md` pour les détails techniques
- `MIGRATION_GUIDE.md` pour le guide de migration
- Les commentaires dans le code pour l'implémentation

🎉 **Bonne refonte !**
