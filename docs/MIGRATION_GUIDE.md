# 🚀 Guide de Migration vers la Structure à Sections

## ⚠️ IMPORTANT - Backup obligatoire

**Avant toute migration, faites une sauvegarde complète de votre base de données !**

```bash
# PostgreSQL backup
pg_dump -U votre_user -d educ_db > backup_avant_migration_$(date +%Y%m%d_%H%M%S).sql
```

---

## 📋 Étapes de migration

### Étape 1 : Préparation

1. **Arrêter l'application**
   ```bash
   # Arrêter le backend
   cd backend
   npm run stop  # ou Ctrl+C si en mode dev
   
   # Arrêter le frontend mobile
   # Ctrl+C dans le terminal Metro
   ```

2. **Créer une branche de migration**
   ```bash
   git checkout -b feature/course-sections-migration
   git add .
   git commit -m "Backup avant migration sections"
   ```

---

### Étape 2 : Mise à jour du schéma Prisma

1. **Remplacer le fichier schema.prisma**
   ```bash
   cd backend/prisma
   # Backup de l'ancien schéma
   cp schema.prisma schema.prisma.backup
   
   # Copier le nouveau schéma
   cp schema-new-sections.prisma schema.prisma
   ```

2. **Vérifier le schéma**
   ```bash
   npx prisma validate
   ```

---

### Étape 3 : Créer la migration Prisma

```bash
cd backend

# Créer la migration
npx prisma migrate dev --name add_course_sections

# Si la migration automatique échoue, utilisez le SQL manuel
npx prisma db execute --file prisma/migrations/add_course_sections.sql
```

---

### Étape 4 : Générer le client Prisma

```bash
npx prisma generate
```

---

### Étape 5 : Migrer les données existantes

```bash
# Exécuter le script de migration
npx ts-node prisma/migrate-to-sections.ts
```

**Résultat attendu :**
```
🚀 Démarrage de la migration des cours vers les sections...

📚 15 cours trouvés

🔄 Traitement du cours: "Introduction à React" (abc-123)
   ✅ Section créée: "Contenu principal" (xyz-789)
   📝 3 test(s) associé(s) au cours (restent globaux)
   ✅ Migration réussie

...

============================================================
📊 RAPPORT DE MIGRATION
============================================================
Total de cours:               15
Cours migrés avec succès:     15
Cours sans contenu:           0
Sections créées:              15
Tests traités:                45
Erreurs:                      0
============================================================

✅ Migration terminée avec succès! 🎉
```

---

### Étape 6 : Vérification

1. **Vérifier les données migrées**
   ```bash
   npx prisma studio
   ```
   
   Vérifier :
   - Table `course_sections` : doit contenir les sections migrées
   - Table `courses` : doit toujours avoir la colonne `content` (pour l'instant)
   - Table `tests` : doit avoir la nouvelle colonne `sectionId` (null pour l'instant)

2. **Tester les requêtes**
   ```bash
   # Depuis Prisma Studio ou psql
   SELECT c.title, cs.title as section_title, cs.content 
   FROM courses c 
   LEFT JOIN course_sections cs ON c.id = cs."courseId"
   LIMIT 5;
   ```

---

### Étape 7 : Mise à jour du code backend

1. **Mettre à jour les services**
   
   Créer `backend/src/services/course-section.service.ts` :
   ```typescript
   import { prisma } from '../lib/prisma';
   
   export class CourseSectionService {
     // Récupérer toutes les sections d'un cours (avec hiérarchie)
     static async getAllByCourse(courseId: string) {
       const sections = await prisma.courseSection.findMany({
         where: { courseId },
         orderBy: { order: 'asc' },
         include: {
           children: {
             orderBy: { order: 'asc' },
             include: {
               children: true, // Niveau 2 de profondeur
             },
           },
           tests: {
             where: { isPublished: true },
             select: {
               id: true,
               title: true,
               description: true,
             },
           },
         },
       });
       
       // Filtrer seulement les sections racines
       return sections.filter(s => s.parentId === null);
     }
     
     // Créer une section
     static async create(data: {
       courseId: string;
       parentId?: string;
       title: string;
       content?: string;
       order: number;
     }) {
       return prisma.courseSection.create({ data });
     }
     
     // Mettre à jour une section
     static async update(id: string, data: any) {
       return prisma.courseSection.update({ where: { id }, data });
     }
     
     // Supprimer une section (cascade sur les enfants)
     static async delete(id: string) {
       return prisma.courseSection.delete({ where: { id } });
     }
     
     // Réorganiser les sections
     static async reorder(updates: Array<{ id: string; order: number }>) {
       const promises = updates.map(({ id, order }) =>
         prisma.courseSection.update({
           where: { id },
           data: { order },
         })
       );
       return Promise.all(promises);
     }
   }
   ```

2. **Créer les routes**
   
   `backend/src/routes/course-section.routes.ts` :
   ```typescript
   import { Router } from 'express';
   import { CourseSectionController } from '../controllers/course-section.controller';
   import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
   
   const router = Router();
   
   // Public routes
   router.get('/courses/:courseId/sections', CourseSectionController.getAllByCourse);
   router.get('/sections/:id', CourseSectionController.getById);
   
   // Admin routes
   router.post('/courses/:courseId/sections', authenticateToken, requireAdmin, CourseSectionController.create);
   router.put('/sections/:id', authenticateToken, requireAdmin, CourseSectionController.update);
   router.delete('/sections/:id', authenticateToken, requireAdmin, CourseSectionController.delete);
   router.post('/courses/:courseId/sections/reorder', authenticateToken, requireAdmin, CourseSectionController.reorder);
   
   export default router;
   ```

3. **Mettre à jour le service Course**
   
   Modifier `backend/src/services/course.service.ts` :
   ```typescript
   static async getById(id: string) {
     return prisma.course.findUnique({
       where: { id },
       include: {
         niveau: {
           include: {
             cycle: true,
           },
         },
         sections: {  // ✅ NOUVEAU : Inclure les sections
           where: { parentId: null },
           orderBy: { order: 'asc' },
           include: {
             children: {
               orderBy: { order: 'asc' },
             },
             tests: {
               where: { isPublished: true },
             },
           },
         },
         tests: {  // Tests globaux du cours
           where: { 
             isPublished: true,
             sectionId: null,  // ✅ NOUVEAU : Seulement les tests globaux
           },
         },
       },
     });
   }
   ```

---

### Étape 8 : Mise à jour du frontend mobile

1. **Mettre à jour les types TypeScript**
   
   `mobile/src/types/index.ts` :
   ```typescript
   export interface CourseSection {
     id: string;
     courseId: string;
     parentId: string | null;
     title: string;
     content: string | null;
     order: number;
     children?: CourseSection[];
     tests?: Test[];
   }
   
   export interface Course {
     id: string;
     title: string;
     description: string;
     category: string;
     imageUrl?: string;
     order: number;
     isPublished: boolean;
     sections?: CourseSection[];  // ✅ NOUVEAU
     tests?: Test[];
   }
   
   export interface CourseProgress {
     id: string;
     userId: string;
     courseId: string;
     lastSectionId: string | null;
     completionPercent: number;
     startedAt: Date;
     lastAccessedAt: Date;
   }
   ```

2. **Mettre à jour l'API client**
   
   `mobile/src/services/api.ts` :
   ```typescript
   export const courseSectionApi = {
     getAllByCourse: async (courseId: string) => {
       const response = await api.get(`/courses/${courseId}/sections`);
       return response.data;
     },
     
     create: async (courseId: string, data: any) => {
       const response = await api.post(`/courses/${courseId}/sections`, data);
       return response.data;
     },
     
     update: async (sectionId: string, data: any) => {
       const response = await api.put(`/sections/${sectionId}`, data);
       return response.data;
     },
     
     delete: async (sectionId: string) => {
       const response = await api.delete(`/sections/${sectionId}`);
       return response.data;
     },
   };
   
   export const courseProgressApi = {
     get: async (courseId: string) => {
       const response = await api.get(`/courses/${courseId}/progress`);
       return response.data;
     },
     
     updateCurrentSection: async (courseId: string, sectionId: string) => {
       const response = await api.post(`/courses/${courseId}/progress/current-section`, {
         sectionId,
       });
       return response.data;
     },
   };
   ```

---

### Étape 9 : Tests

1. **Tester l'API backend**
   ```bash
   # Démarrer le backend
   cd backend
   npm run dev
   
   # Tester les endpoints
   curl http://localhost:3000/api/courses/[courseId]/sections
   ```

2. **Tester le frontend**
   ```bash
   cd mobile
   npm start
   ```

---

### Étape 10 : Nettoyage (optionnel)

Une fois que tout fonctionne correctement :

1. **Supprimer la colonne `content` de la table `courses`**
   ```sql
   ALTER TABLE "courses" DROP COLUMN "content";
   ```

2. **Créer une migration Prisma pour enregistrer ce changement**
   ```bash
   npx prisma migrate dev --name remove_course_content_column
   ```

---

## 🔄 Rollback en cas de problème

Si la migration échoue ou cause des problèmes :

1. **Restaurer la base de données**
   ```bash
   psql -U votre_user -d educ_db < backup_avant_migration_YYYYMMDD_HHMMSS.sql
   ```

2. **Revenir à l'ancien schéma**
   ```bash
   cd backend/prisma
   cp schema.prisma.backup schema.prisma
   npx prisma generate
   ```

3. **Redémarrer l'application**
   ```bash
   npm run dev
   ```

---

## ✅ Checklist de validation

- [ ] Backup de la base de données créé
- [ ] Nouveau schéma Prisma validé
- [ ] Migration Prisma exécutée sans erreur
- [ ] Client Prisma régénéré
- [ ] Script de migration des données exécuté avec succès
- [ ] Données vérifiées dans Prisma Studio
- [ ] Services backend créés et testés
- [ ] Routes API créées et testées
- [ ] Types TypeScript mis à jour
- [ ] API client mise à jour
- [ ] Interface admin testée
- [ ] Interface client testée
- [ ] Tests end-to-end passés
- [ ] Documentation mise à jour

---

## 📞 Support

En cas de problème, vérifier :
1. Les logs du backend
2. Les logs de la migration
3. L'état de la base de données avec Prisma Studio
4. Les erreurs dans la console du navigateur/app mobile

---

**Bonne migration ! 🚀**
