# 📋 TODO - Implémentation des Sections de Cours

## 🎯 Vue d'ensemble
Refonte complète de la structure des cours pour supporter des sections/sous-sections hiérarchiques illimitées avec suivi de progression utilisateur.

---

## Phase 1 : Base de données [EN ATTENTE]

### Migration
- [ ] Faire un backup complet de la base de données
- [ ] Remplacer `schema.prisma` par `schema-new-sections.prisma`
- [ ] Valider le nouveau schéma : `npx prisma validate`
- [ ] Créer la migration : `npx prisma migrate dev --name add_course_sections`
- [ ] Générer le client Prisma : `npx prisma generate`
- [ ] Exécuter le script de migration : `npx ts-node prisma/migrate-to-sections.ts`
- [ ] Vérifier les données dans Prisma Studio
- [ ] Tester les requêtes de base

### Validation
- [ ] Toutes les sections créées correctement
- [ ] Relations parent-enfant fonctionnelles
- [ ] Anciens tests toujours accessibles
- [ ] Aucune perte de données

---

## Phase 2 : Backend API [À FAIRE]

### Services

#### CourseSection Service
- [ ] Créer `backend/src/services/course-section.service.ts`
  - [ ] `getAllByCourse(courseId)` - Récupérer toutes les sections avec hiérarchie
  - [ ] `getById(id)` - Récupérer une section par ID
  - [ ] `create(data)` - Créer une section
  - [ ] `update(id, data)` - Mettre à jour une section
  - [ ] `delete(id)` - Supprimer une section (cascade sur enfants)
  - [ ] `reorder(updates)` - Réorganiser les sections
  - [ ] `getHierarchy(courseId)` - Construire l'arbre hiérarchique complet

#### CourseProgress Service
- [ ] Créer `backend/src/services/course-progress.service.ts`
  - [ ] `get(userId, courseId)` - Récupérer la progression
  - [ ] `create(userId, courseId)` - Initialiser la progression
  - [ ] `updateLastSection(userId, courseId, sectionId)` - MAJ dernière section
  - [ ] `calculateCompletion(userId, courseId)` - Calculer %
  - [ ] `updateLastAccessed(userId, courseId)` - MAJ dernier accès

#### SectionProgress Service
- [ ] Créer `backend/src/services/section-progress.service.ts`
  - [ ] `markAsVisited(userId, sectionId)` - Marquer comme visitée
  - [ ] `getProgressByUser(userId, courseId)` - Toutes les sections visitées
  - [ ] `getProgressBySection(sectionId)` - Stats d'une section

### Controllers

- [ ] Créer `backend/src/controllers/course-section.controller.ts`
  - [ ] `getAllByCourse(req, res, next)` - GET /courses/:courseId/sections
  - [ ] `getById(req, res, next)` - GET /sections/:id
  - [ ] `create(req, res, next)` - POST /courses/:courseId/sections
  - [ ] `update(req, res, next)` - PUT /sections/:id
  - [ ] `delete(req, res, next)` - DELETE /sections/:id
  - [ ] `reorder(req, res, next)` - POST /courses/:courseId/sections/reorder

- [ ] Créer `backend/src/controllers/course-progress.controller.ts`
  - [ ] `get(req, res, next)` - GET /courses/:courseId/progress
  - [ ] `updateLastSection(req, res, next)` - POST /courses/:courseId/progress/current-section
  - [ ] `calculateCompletion(req, res, next)` - GET /courses/:courseId/progress/calculate

- [ ] Créer `backend/src/controllers/section-progress.controller.ts`
  - [ ] `markAsVisited(req, res, next)` - POST /sections/:sectionId/mark-visited

### Routes

- [ ] Créer `backend/src/routes/course-section.routes.ts`
  - [ ] Routes publiques (GET sections)
  - [ ] Routes admin (CRUD sections)
  - [ ] Route de réorganisation

- [ ] Créer `backend/src/routes/course-progress.routes.ts`
  - [ ] Routes utilisateur (GET/POST progression)

- [ ] Mettre à jour `backend/src/server.ts`
  - [ ] Importer et monter les nouvelles routes

### Mise à jour des services existants

- [ ] Modifier `backend/src/services/course.service.ts`
  - [ ] `getById()` : Inclure `sections` avec hiérarchie
  - [ ] `getAllAdmin()` : Inclure count des sections
  - [ ] Supprimer les références à `content`

- [ ] Modifier `backend/src/services/test.service.ts`
  - [ ] Support de `sectionId` en plus de `courseId`
  - [ ] Récupérer les tests par section

### Validators

- [ ] Créer `backend/src/validators/section-schemas.ts`
  - [ ] Schema de création de section
  - [ ] Schema de mise à jour de section
  - [ ] Validation de la hiérarchie

### Tests

- [ ] Tests unitaires des services
- [ ] Tests d'intégration des routes
- [ ] Tests de la hiérarchie récursive
- [ ] Tests de calcul de progression

---

## Phase 3 : Frontend Mobile - Types & API [À FAIRE]

### Types TypeScript

- [ ] Mettre à jour `mobile/src/types/index.ts`
  - [ ] Interface `CourseSection`
  - [ ] Interface `CourseProgress`
  - [ ] Interface `SectionProgress`
  - [ ] Mettre à jour interface `Course` (ajouter `sections[]`)
  - [ ] Mettre à jour interface `Test` (ajouter `sectionId?`)

### API Client

- [ ] Mettre à jour `mobile/src/services/api.ts`
  - [ ] `courseSectionApi`
    - [ ] `getAllByCourse(courseId)`
    - [ ] `create(courseId, data)`
    - [ ] `update(sectionId, data)`
    - [ ] `delete(sectionId)`
    - [ ] `reorder(courseId, updates)`
  - [ ] `courseProgressApi`
    - [ ] `get(courseId)`
    - [ ] `updateLastSection(courseId, sectionId)`
    - [ ] `calculateCompletion(courseId)`
  - [ ] `sectionProgressApi`
    - [ ] `markAsVisited(sectionId)`

---

## Phase 4 : Admin - Interface d'Édition [À FAIRE]

### Composants Principaux

#### CourseSectionTree
- [ ] Créer `mobile/src/screens/admin/AdminCoursesScreen/components/CourseSectionTree.tsx`
  - [ ] Affichage hiérarchique (arbre)
  - [ ] Indentation visuelle
  - [ ] Expand/collapse des sections
  - [ ] Actions par section (edit, delete, add child)
  - [ ] Bouton "Ajouter section racine"
  - [ ] Intégration drag & drop (optionnel)

#### SectionEditor
- [ ] Créer `mobile/src/screens/admin/AdminCoursesScreen/components/SectionEditor.tsx`
  - [ ] Modal ou écran d'édition
  - [ ] Champ titre
  - [ ] Éditeur de contenu (textarea ou markdown)
  - [ ] Sélection du parent (optionnel)
  - [ ] Ordre
  - [ ] Boutons Sauvegarder/Annuler

#### SectionTestManager
- [ ] Créer `mobile/src/screens/admin/AdminCoursesScreen/components/SectionTestManager.tsx`
  - [ ] Liste des tests disponibles
  - [ ] Liste des tests associés
  - [ ] Boutons Associer/Dissocier
  - [ ] Drag & drop pour ordre (optionnel)

### Modifications CourseForm

- [ ] Mettre à jour `mobile/src/screens/admin/AdminCoursesScreen/components/CourseForm.tsx`
  - [ ] Supprimer l'accordéon "Contenu"
  - [ ] Ajouter accordéon "Structure du cours"
  - [ ] Intégrer `CourseSectionTree`
  - [ ] Gérer l'état des sections
  - [ ] Modal d'édition de section

### Hooks Personnalisés

- [ ] Créer `mobile/src/hooks/useSectionTree.ts`
  - [ ] Gestion de l'état de l'arbre
  - [ ] Expand/collapse
  - [ ] Réorganisation

- [ ] Créer `mobile/src/hooks/useSectionMutations.ts`
  - [ ] Mutations CRUD sections (React Query)
  - [ ] Invalidation du cache

### Styles

- [ ] Créer `mobile/src/screens/admin/AdminCoursesScreen/components/section-styles.ts`
  - [ ] Styles pour l'arbre hiérarchique
  - [ ] Indentation visuelle
  - [ ] Boutons d'action

---

## Phase 5 : Client - Navigation et Contenu [À FAIRE]

### Écran Principal de Navigation

- [ ] Créer `mobile/src/screens/courses/CourseNavigatorScreen.tsx`
  - [ ] Layout principal (sidebar + content)
  - [ ] Gestion de l'état de navigation
  - [ ] Récupération de la progression
  - [ ] Ouverture sur `lastSectionId` ou première section
  - [ ] Sauvegarde automatique de la position

### Sidebar (Sommaire)

- [ ] Créer `mobile/src/components/CourseSidebar.tsx`
  - [ ] Affichage hiérarchique des sections
  - [ ] Indentation visuelle
  - [ ] Section active en surbrillance
  - [ ] Icônes d'état (visité ✓, actuel →, non visité ○)
  - [ ] Expand/collapse des sections
  - [ ] Scroll automatique vers section active
  - [ ] Click pour changer de section

### Affichage du Contenu

- [ ] Créer `mobile/src/components/SectionContent.tsx`
  - [ ] Affichage du titre de section
  - [ ] Rendu du contenu (markdown ou HTML)
  - [ ] Liste des tests associés
  - [ ] Boutons de navigation (précédent/suivant)
  - [ ] Breadcrumbs (chemin de navigation)

### Barre de Progression

- [ ] Créer `mobile/src/components/CourseProgressBar.tsx`
  - [ ] Barre de progression visuelle
  - [ ] Pourcentage affiché
  - [ ] Info : X/Y tests réussis
  - [ ] Animation fluide

### Mise à Jour des Cards de Cours

- [ ] Mettre à jour `mobile/src/components/CourseCard.tsx` (ou équivalent)
  - [ ] Afficher `completionPercent` si > 0
  - [ ] Changer "Commencer" en "Reprendre" si déjà commencé
  - [ ] Afficher la barre de progression

### Hooks Personnalisés

- [ ] Créer `mobile/src/hooks/useCourseNavigation.ts`
  - [ ] Gestion de la section courante
  - [ ] Navigation précédent/suivant
  - [ ] Sauvegarde de la position

- [ ] Créer `mobile/src/hooks/useCourseProgress.ts`
  - [ ] Récupération de la progression
  - [ ] Calcul du pourcentage
  - [ ] Mise à jour automatique

- [ ] Créer `mobile/src/hooks/useSectionProgress.ts`
  - [ ] Marquer section comme visitée
  - [ ] Récupérer l'état de visite

### Styles

- [ ] Créer `mobile/src/components/course-navigation-styles.ts`
  - [ ] Layout sidebar + content
  - [ ] Styles du sommaire
  - [ ] Styles du contenu
  - [ ] Responsive design

---

## Phase 6 : Fonctionnalités Avancées [OPTIONNEL]

### Drag & Drop
- [ ] Intégrer `react-native-draggable-flatlist` ou équivalent
- [ ] Permettre réorganisation des sections par drag & drop
- [ ] Sauvegarder l'ordre après drop

### Recherche
- [ ] Ajouter une barre de recherche dans le sommaire
- [ ] Filtrer les sections par titre
- [ ] Highlight des résultats

### Bookmarks
- [ ] Permettre de marquer des sections favorites
- [ ] Accès rapide aux favoris

### Annotations
- [ ] Permettre aux utilisateurs d'ajouter des notes
- [ ] Associées à une section

### Export PDF
- [ ] Export du cours complet en PDF
- [ ] Avec sommaire et table des matières

---

## Phase 7 : Tests & Validation [À FAIRE]

### Tests Backend
- [ ] Tests unitaires des services
- [ ] Tests d'intégration des routes
- [ ] Tests de la hiérarchie
- [ ] Tests de calcul de progression
- [ ] Tests de performance (requêtes récursives)

### Tests Frontend
- [ ] Tests unitaires des composants
- [ ] Tests d'intégration de navigation
- [ ] Tests E2E du parcours utilisateur
- [ ] Tests de sauvegarde de progression

### Validation UX
- [ ] Navigation fluide
- [ ] Pas de lag lors du changement de section
- [ ] Sauvegarde automatique fonctionne
- [ ] Reprise correcte après fermeture
- [ ] Affichage correct de la progression

### Performance
- [ ] Lazy loading du contenu
- [ ] Cache des sections visitées
- [ ] Optimisation des requêtes
- [ ] Temps de chargement < 1s

---

## Phase 8 : Documentation [À FAIRE]

### Documentation Utilisateur
- [ ] Guide d'utilisation admin (créer des sections)
- [ ] Guide d'utilisation client (naviguer dans un cours)
- [ ] FAQ

### Documentation Développeur
- [ ] Architecture des sections
- [ ] API endpoints
- [ ] Structure des données
- [ ] Guide de contribution

### Vidéos/Tutoriels
- [ ] Tutoriel admin : créer un cours avec sections
- [ ] Tutoriel client : suivre un cours

---

## Phase 9 : Déploiement [À FAIRE]

### Préparation
- [ ] Backup complet de la base de données
- [ ] Tests sur environnement de staging
- [ ] Validation par les utilisateurs beta

### Migration Production
- [ ] Planifier une fenêtre de maintenance
- [ ] Exécuter la migration
- [ ] Vérifier les données migrées
- [ ] Déployer le nouveau code backend
- [ ] Déployer la nouvelle app mobile
- [ ] Monitoring post-déploiement

### Rollback (si nécessaire)
- [ ] Procédure de rollback documentée
- [ ] Backup restaurable rapidement

---

## 🎯 Priorités

### P0 - Critique
- Migration base de données
- Services backend CRUD
- API Routes
- Interface admin de base (création/édition sections)
- Interface client de base (navigation)
- Progression basique

### P1 - Important
- Drag & drop admin
- Sauvegarde automatique position
- Affichage % sur cards
- Tests unitaires

### P2 - Nice to have
- Recherche dans sections
- Bookmarks
- Annotations
- Export PDF

---

## 📊 Suivi d'Avancement

**Phase 1 - Base de données** : ⏳ 0% (0/8)
**Phase 2 - Backend API** : ⏳ 0% (0/40)
**Phase 3 - Frontend Types/API** : ⏳ 0% (0/12)
**Phase 4 - Admin Interface** : ⏳ 0% (0/18)
**Phase 5 - Client Interface** : ⏳ 0% (0/20)
**Phase 6 - Avancé** : ⏳ 0% (0/10)
**Phase 7 - Tests** : ⏳ 0% (0/13)
**Phase 8 - Documentation** : ⏳ 0% (0/9)
**Phase 9 - Déploiement** : ⏳ 0% (0/10)

**TOTAL** : ⏳ 0% (0/140 tâches)

---

## 📝 Notes

- Commencer par Phase 1 (migration BDD) absolument
- Phases 2-3-4 peuvent être faites en parallèle (backend + admin)
- Phase 5 (client) dépend de phases 2-3
- Phase 7 (tests) tout au long du développement
- Faire des commits fréquents pour pouvoir rollback

---

**Dernière mise à jour** : 2025-10-22
