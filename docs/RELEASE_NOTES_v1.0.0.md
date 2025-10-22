# 🚀 Release v1.0.0 — Sections hiérarchiques + Progression

Date: 2025-10-22

## Points forts

- Cours avec sections hiérarchiques illimitées (sections, sous-sections, ...)
- Navigation suivante/précédente et fil d’ariane
- Rendu Markdown du contenu des sections
- Suivi de progression par cours et par section
- UI mobile: arbre de sections, écran détail section, barre de progression
- Endpoints backend pour sections et progression
- Données de test et scripts utilitaires

## Breaking change

Le champ `Course.content` a été déplacé vers les nouvelles entités `CourseSection`.

- Ancien: le contenu était stocké directement dans `Course`
- Nouveau: chaque `Course` possède des `CourseSection` (arbre parent/enfants)

Conséquence: une migration des données est nécessaire. Les endpoints et l’UI lisent désormais le contenu via les sections.

## Schéma de données (Prisma)

- `CourseSection`: hiérarchie via `parentId` (self-relation), `order` pour l’affichage
- `CourseProgress`: progression globale par cours et utilisateur
- `SectionProgress`: progression par section et utilisateur

## Backend

- Services: `section.service.ts`, `progress.service.ts`
- Contrôleurs: `section.controller.ts`, `progress.controller.ts`
- Routes: `/api/sections/*`, `/api/progress/*`
- Intégration dans `src/server.ts`

## Mobile (Expo/React Native)

- Types: `CourseSection`, `CourseProgress`, `SectionProgress`
- Services API: `sectionService.ts`, `progressService.ts`
- Composants: `SectionTree`, `SectionItem`, `MarkdownRenderer`, `ProgressBar`
- Écrans: `CourseSectionsScreen`, `SectionDetailScreen`
- Navigation: routes ajoutées dans `App.tsx`

## Scripts et données

- `prisma/create-test-sections.ts`: crée des sections de test pour un cours publié
- Seed: cycles et niveaux par défaut (Primaire, Collège, Lycée)

## Instructions de migration

1. Sauvegarder la base de données
2. Appliquer la migration Prisma
3. Régénérer le client Prisma
4. Adapter les seeds (supprimer les accès à `Course.content`)
5. Créer des sections de test si nécessaire

Détails pas-à-pas dans `docs/MIGRATION_GUIDE.md`.

## Démarrage rapide

- Backend: `npm run dev` (ou `npm run prisma:migrate` puis `npm run prisma:seed` au besoin)
- Mobile: `npm start` (Expo) et scanner le QR code

## Remarques

- Avertissement Expo: `@react-native-async-storage/async-storage@2.2.0` (attendu: `1.21.0`) — non bloquant. Possible downgrade si nécessaire.

Bon test et bon déploiement ! 🎉
