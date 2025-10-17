# Restructuration des Données - EduTeQC

## Modifications effectuées

### 1. Schéma de base de données

Ajout de deux nouvelles tables dans le schéma Prisma :

#### Table `Cycle`
- `id`: UUID
- `name`: String unique
- `order`: Integer
- Relations: Un cycle a plusieurs niveaux

#### Table `Niveau`
- `id`: UUID
- `name`: String unique
- `cycleId`: Foreign key vers Cycle
- `order`: Integer
- Relations: 
  - Appartient à un cycle
  - A plusieurs cours

#### Modification de la table `Course`
- Ajout du champ obligatoire `niveauId`: Foreign key vers Niveau
- Suppression implicite du champ `category` comme clé de regroupement principal

### 2. Données créées

#### Cycles (3)
1. **Primaire** (order: 1)
2. **Collège** (order: 2)
3. **Lycée** (order: 3)

#### Niveaux (12)

**Primaire:**
- CP (order: 1)
- CE1 (order: 2)
- CE2 (order: 3)
- CM1 (order: 4)
- CM2 (order: 5)

**Collège:**
- 6ème (order: 6)
- 5ème (order: 7)
- 4ème (order: 8)
- 3ème (order: 9)

**Lycée:**
- 2nd (order: 10)
- 1ère (order: 11)
- Terminale (order: 12)

#### Matières (3)
- Français
- Mathématiques
- Histoire de France

#### Cours (36)
- 1 cours par matière et par niveau
- Exemple: "Français - CP", "Mathématiques - 6ème", etc.

#### Tests (36)
- 1 test par cours
- Chaque test contient 10 questions à choix unique
- Questions adaptées à chaque matière

#### Questions (360)
- 10 questions par test
- Questions génériques mais pertinentes pour chaque matière

#### Packages (27)

**Par matière (3):**
- Pack Français (12 cours)
- Pack Mathématiques (12 cours)
- Pack Histoire de France (12 cours)

**Par niveau (12):**
- Pack CP (3 cours)
- Pack CE1 (3 cours)
- ... jusqu'à Terminale

**Par cycle (3):**
- Pack Primaire (15 cours)
- Pack Collège (12 cours)
- Pack Lycée (9 cours)

**Par cycle et matière (9):**
- Pack Français - Primaire (5 cours)
- Pack Français - Collège (4 cours)
- Pack Français - Lycée (3 cours)
- Pack Mathématiques - Primaire (5 cours)
- Pack Mathématiques - Collège (4 cours)
- Pack Mathématiques - Lycée (3 cours)
- Pack Histoire de France - Primaire (5 cours)
- Pack Histoire de France - Collège (4 cours)
- Pack Histoire de France - Lycée (3 cours)

### 3. API Backend

#### Nouveaux services
- `CycleService`: Gestion des cycles
- `NiveauService`: Gestion des niveaux

#### Nouveaux contrôleurs
- `CycleController`: Contrôleur pour cycles et niveaux

#### Nouvelles routes
```
GET /api/cycles - Liste tous les cycles avec leurs niveaux
GET /api/cycles/:id - Détails d'un cycle avec ses niveaux et cours
GET /api/niveaux - Liste tous les niveaux
GET /api/niveaux/:id - Détails d'un niveau avec ses cours
GET /api/cycles/:cycleId/niveaux - Niveaux d'un cycle spécifique
```

#### Modifications des services existants
- `CourseService`: Ajout des informations de niveau et cycle dans toutes les requêtes

### 4. Structure des réponses API

#### Exemple de réponse pour `/api/courses`
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Français - CP",
      "description": "...",
      "category": "Français",
      "imageUrl": null,
      "order": 0,
      "niveau": {
        "id": "uuid",
        "name": "CP",
        "cycle": {
          "id": "uuid",
          "name": "Primaire"
        }
      }
    }
  ]
}
```

#### Exemple de réponse pour `/api/cycles`
```json
{
  "cycles": [
    {
      "id": "uuid",
      "name": "Primaire",
      "order": 1,
      "niveaux": [
        {
          "id": "uuid",
          "name": "CP",
          "order": 1
        },
        // ... autres niveaux
      ]
    }
  ]
}
```

### 5. Scripts de migration et seed

#### Migration
- Fichier: `backend/prisma/migrations/20251017115611_add_cycles_and_niveaux/migration.sql`
- Suppression de toutes les données existantes (packages, cours, tests, etc.)
- Ajout des tables `cycles` et `niveaux`
- Modification de la table `courses` avec le champ `niveauId`

#### Seed
- Fichier: `backend/prisma/seed-new.ts`
- Population complète de la base de données
- Création de 3 cycles, 12 niveaux, 36 cours, 36 tests, 360 questions, 27 packages

## Prochaines étapes

### Backend
1. ✅ Mettre à jour les validators pour inclure `niveauId` dans la création de cours
2. ✅ Ajouter des filtres par cycle/niveau dans les endpoints courses
3. ✅ Mettre à jour la documentation API

### Frontend (Mobile)
1. Afficher les informations de niveau et cycle dans les listes de cours
2. Ajouter des filtres par cycle/niveau
3. Mettre à jour les formulaires de création/édition de cours
4. Adapter l'affichage des packages selon leur type

## Commandes utiles

```bash
# Régénérer le client Prisma
npx prisma generate

# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations
npx prisma migrate deploy

# Exécuter le seed
npx ts-node prisma/seed-new.ts

# Reset complet de la base de données
npx prisma migrate reset
```

## Notes importantes

- Le champ `category` existe toujours dans la table `courses` pour compatibilité
- Toutes les anciennes données ont été supprimées lors de la migration
- Les prix des packages sont définis par défaut (à ajuster selon besoin)
- Les questions sont génériques et identiques pour tous les niveaux (à personnaliser)
