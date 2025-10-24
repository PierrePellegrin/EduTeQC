# Système de Progression des Cours

## Vue d'ensemble

Le système de progression d'EduTeQC permet de suivre l'avancement des utilisateurs dans leurs cours. La progression est calculée automatiquement en fonction de deux critères :

## Calcul de la Progression

### 1. Cours AVEC tests
Si un cours contient des tests (globaux ou associés à des sections), la progression est basée sur les **tests réussis** :
- Un test est considéré comme réussi si le score obtenu ≥ `passingScore`
- Formule : `(tests réussis / tests totaux) × 100`

### 2. Cours SANS tests
Si un cours ne contient aucun test, la progression est basée sur les **sections visitées** :
- Une section est visitée quand l'utilisateur clique dessus pour lire son contenu
- Formule : `(sections visitées / sections totales) × 100`

## Architecture

### Base de données

#### CourseProgress
```prisma
model CourseProgress {
  id                String
  userId            String
  courseId          String
  lastSectionId     String?      // Dernière section consultée
  completionPercent Float        // % de complétion (0-100)
  startedAt         DateTime
  lastAccessedAt    DateTime
  updatedAt         DateTime
}
```

#### SectionProgress
```prisma
model SectionProgress {
  id         String
  userId     String
  sectionId  String
  visited    Boolean       // Section visitée ou non
  visitedAt  DateTime?
  createdAt  DateTime
  updatedAt  DateTime
}
```

### API Endpoints

#### Récupérer la progression d'un cours
```
GET /api/progress/courses/:courseId
```
Retourne :
```json
{
  "progress": {
    "id": "...",
    "completionPercent": 45,
    "lastSectionId": "...",
    "lastAccessedAt": "2025-10-24T12:00:00Z"
  }
}
```

#### Récupérer toutes les progressions
```
GET /api/progress
```
Retourne toutes les progressions de l'utilisateur avec les informations des cours.

#### Récupérer la progression des sections
```
GET /api/progress/courses/:courseId/sections
```
Retourne :
```json
{
  "sections": [
    {
      "id": "section-1",
      "title": "Introduction",
      "progress": {
        "visited": true,
        "visitedAt": "2025-10-24T12:00:00Z"
      }
    }
  ]
}
```

#### Marquer une section comme visitée
```
POST /api/progress/sections/:sectionId/visit
```
- Marque la section comme visitée
- Met à jour `lastSectionId` et `lastAccessedAt` du cours
- **Recalcule automatiquement** le `completionPercent`
- Retourne les données de progression de la section

#### Réinitialiser la progression
```
DELETE /api/progress/courses/:courseId
```
Réinitialise toutes les données de progression pour un cours :
- Remet `completionPercent` à 0
- Supprime toutes les sections visitées

## Utilisation Mobile

### Styles globaux des sections

Les styles des sections sont centralisés dans `mobile/src/styles/sectionStyles.ts` pour garantir une cohérence visuelle entre l'affichage client et l'édition admin.

```tsx
import { sectionStyles, getSectionColors } from '../styles/sectionStyles';

// Obtenir les couleurs cohérentes
const colors = getSectionColors(theme, isVisited);

// Utiliser les styles globaux
<Card style={[sectionStyles.sectionCard, { backgroundColor: colors.cardBackground }]} />
```

**Couleurs utilisées :**
- `surface` : Fond par défaut des sections (cohérent avec les autres cards)
- `surfaceVariant` : Fond des sections visitées (légère différenciation)
- `onSurface` : Texte principal
- `onSurfaceVariant` : Texte secondaire et icônes par défaut
- `primary` : Icônes des sections visitées et validation

### Affichage dans la liste des cours

```tsx
import { progressApi } from '../../../services/progress.api';

// Récupérer toutes les progressions
const { data: allProgressData } = useQuery({
  queryKey: ['all-progress'],
  queryFn: progressApi.getAllProgress,
});

// Créer une map courseId -> pourcentage
const progressMap = new Map();
allProgressData?.progress?.forEach(p => {
  progressMap.set(p.courseId, p.completionPercent);
});

// Afficher sur la carte
<CourseCard 
  course={course}
  progress={progressMap.get(course.id)}
/>
```

### Affichage dans le détail du cours

```tsx
// Récupérer la progression globale
const { data: progressData } = useQuery({
  queryKey: ['course-progress', courseId],
  queryFn: () => progressApi.getCourseProgress(courseId),
});

// Récupérer la progression des sections
const { data: sectionProgressData } = useQuery({
  queryKey: ['section-progress', courseId],
  queryFn: () => progressApi.getCourseSectionProgress(courseId),
});

// Afficher la carte de progression
<ProgressCard
  completionPercent={progressData.progress.completionPercent}
  visitedSectionsCount={visitedSections.size}
  totalSectionsCount={totalSections}
  lastAccessedAt={progressData.progress.lastAccessedAt}
/>
```

### Marquer une section comme visitée

```tsx
const markSectionMutation = useMutation({
  mutationFn: (sectionId: string) => 
    progressApi.markSectionVisited(sectionId),
  onSuccess: () => {
    // Invalider les caches pour rafraîchir l'UI
    queryClient.invalidateQueries({ 
      queryKey: ['course-progress', courseId] 
    });
    queryClient.invalidateQueries({ 
      queryKey: ['section-progress', courseId] 
    });
    queryClient.invalidateQueries({ 
      queryKey: ['all-progress'] 
    });
  },
});

// Appeler lors du clic sur une section
const handleSectionPress = (sectionId: string) => {
  markSectionMutation.mutate(sectionId);
};
```

## Composants UI

### ProgressCard
Affiche la progression globale avec :
- Pourcentage de complétion (grand nombre coloré)
- Barre de progression visuelle
- Message d'encouragement adapté au niveau
- Nombre de sections visitées
- Date du dernier accès

### SectionsList
Affiche l'arborescence des sections avec :
- Fond `surface` par défaut, `surfaceVariant` pour les sections visitées
- Icône ✓ verte sur les sections visitées
- Navigation hiérarchique (expand/collapse)
- Rendu Markdown du contenu
- **Bouton explicite** "Marquer comme terminée" en bas du contenu
- **Bouton de dévalidation** "Marquer comme non terminée" pour décocher
- Utilise les styles globaux de `sectionStyles.ts`

### CourseCard (avec progression)
Affiche sur chaque carte de cours :
- Barre de progression horizontale
- Pourcentage en petit texte
- Couleur adaptée au niveau de progression

## Flux de Mise à Jour

```
1. Utilisateur clique sur une section → Ouvre/ferme le contenu (PAS de changement de progression)
   ↓
2. Utilisateur lit le contenu de la section
   ↓
3. Utilisateur clique "Marquer comme terminée" → Validation explicite
   ↓
4. Mobile appelle POST /api/progress/sections/:sectionId/visit avec { visited: true }
   ↓
5. Backend marque la section comme visitée
   ↓
6. Backend recalcule automatiquement le completionPercent
   ↓
7. Backend retourne les données mises à jour
   ↓
8. Mobile invalide les queries React Query
   ↓
9. UI se met à jour automatiquement partout (liste + détail)
   ↓
10. (Optionnel) Utilisateur clique "Marquer comme non terminée" → Dévalidation
    ↓
11. Mobile appelle POST /api/progress/sections/:sectionId/visit avec { visited: false }
    ↓
12. Backend recalcule à nouveau la progression
```

## Stratégies de Cache

### React Query
- **course-progress** : 30 secondes de stale time
- **section-progress** : 30 secondes de stale time
- **all-progress** : 1 minute de stale time

Les mutations invalident les caches pour forcer un refetch immédiat.

## Tests à Implémenter

### Cours sans tests
1. Créer un cours avec 5 sections
2. Visiter 2 sections
3. Vérifier que la progression = 40%

### Cours avec tests
1. Créer un cours avec 4 tests
2. Réussir 2 tests (score ≥ passingScore)
3. Vérifier que la progression = 50%
4. Visiter des sections ne devrait PAS changer la progression

### Réinitialisation
1. Avoir une progression à 70%
2. Réinitialiser
3. Vérifier que la progression = 0%
4. Vérifier que toutes les sections sont marquées comme non visitées
