# Contrainte Admin : Tests Globaux Obligatoires

## Vue d'ensemble

Cette fonctionnalité impose qu'un cours ait au minimum un test global (non associé à une section) pour pouvoir être publié. Cette contrainte s'applique uniquement dans l'interface d'administration lors de la publication d'un cours.

## Fonctionnalités Implémentées

### Backend

#### 1. Service CourseService

**Nouvelles méthodes ajoutées** :

```typescript
// Vérifier qu'un cours a au moins un test global
static async hasGlobalTests(courseId: string): Promise<boolean>

// Valider qu'un cours peut être publié
static async validateCourseForPublication(courseId: string): Promise<boolean>
```

#### 2. Contrôleur CourseController

**Méthode modifiée** :
- `update()` : Validation automatique avant publication si `isPublished: true`

**Nouvelle méthode** :
- `checkGlobalTests()` : API pour vérifier les tests globaux d'un cours

#### 3. Route API

**Nouvelle route ajoutée** :
```
GET /api/admin/courses/:id/global-tests
```

Retourne : `{ hasGlobalTests: boolean }`

### Frontend

#### 1. Service API

**Nouvelle fonction ajoutée** :
```typescript
checkCourseGlobalTests: async (id: string) => Promise<{ hasGlobalTests: boolean }>
```

#### 2. Interface Admin

**Modifications dans AdminCoursesScreen** :

- **Validation lors de la publication** : Vérification automatique des tests globaux avant d'autoriser la publication
- **Message d'erreur informatif** : Affichage d'une alerte claire expliquant pourquoi la publication est impossible
- **UX améliorée** : Blocage en amont avec message explicatif plutôt qu'erreur serveur

## Comportement

### Scénarios

#### 1. Tentative de publication d'un cours sans test global

**Action** : Admin clique sur "Publier" pour un cours n'ayant aucun test global

**Résultat** :
```
❌ Alerte affichée :
"Impossible de publier"
"Le cours [nom] doit avoir au minimum un test global 
(non associé à une section) pour être publié.

Veuillez d'abord créer un test pour ce cours."
```

#### 2. Tentative de publication d'un cours avec tests de sections uniquement

**Action** : Admin clique sur "Publier" pour un cours ayant des tests associés aux sections mais aucun test global

**Résultat** : Même comportement que le scénario 1

#### 3. Publication d'un cours avec au moins un test global

**Action** : Admin clique sur "Publier" pour un cours ayant au moins un test global

**Résultat** :
```
✅ Confirmation normale :
"Voulez-vous publier le cours [nom] ?"
→ Publication autorisée
```

### Validation côté serveur

Si la validation frontend est contournée, le serveur renvoie une erreur :

```
HTTP 400 Bad Request
{
  "error": "Le cours doit avoir au moins un test global (non associé à une section) pour être publié."
}
```

## Critères de validation

**Un test est considéré comme "global" si** :
- `courseId` est défini (associé au cours)
- `sectionId` est `null` (non associé à une section)
- `isPublished` est `true` (test publié)

**Un cours peut être publié si** :
- Il a au moins un test global selon les critères ci-dessus

## Cas d'usage

### Administrateur de contenu

1. **Création d'un nouveau cours**
   - Crée le cours (statut : non publié)
   - Ajoute les sections et le contenu
   - **DOIT créer au moins un test global**
   - Peut alors publier le cours

2. **Modification d'un cours existant**
   - Peut modifier le contenu librement
   - Si suppression du dernier test global → cours automatiquement dépublié lors du prochain update
   - Doit recréer un test global pour republier

### Workflow recommandé

1. Créer le cours avec les informations de base
2. Structurer le contenu en sections
3. **Créer un test global d'évaluation du cours**
4. Créer des tests spécifiques aux sections (optionnel)
5. Publier le cours

## Intégration avec le système existant

### Compatibilité

- **Tests existants** : Aucun impact sur les tests déjà créés
- **Cours publiés** : Les cours déjà publiés restent publiés même sans test global
- **Migration** : Aucune migration requise

### Tests de sections

- **Indépendants** : Les tests associés aux sections ne comptent pas pour la contrainte
- **Complémentaires** : Peuvent coexister avec les tests globaux
- **Validation** : Gardent leur logique de validation indépendante

## Notes techniques

### Performance

- **Vérification asynchrone** : Validation côté client pour éviter les erreurs serveur
- **Cache API** : Utilisation du cache TanStack Query pour optimiser les requêtes
- **Interaction non bloquante** : Utilisation d'InteractionManager pour ne pas bloquer l'UI

### Sécurité

- **Double validation** : Frontend + Backend pour éviter les contournements
- **Autorisation** : Seuls les admins peuvent publier des cours
- **Cohérence** : Validation systématique lors des updates de publication

## Évolutions futures possibles

1. **Notification proactive** : Badge sur les cours sans test global
2. **Assistant de création** : Guide step-by-step incluant la création du test global
3. **Métriques** : Tableau de bord des cours non conformes
4. **Configuration** : Paramètre admin pour activer/désactiver la contrainte