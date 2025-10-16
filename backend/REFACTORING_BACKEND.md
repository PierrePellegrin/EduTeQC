# REFACTORING_BACKEND.md

## Refactorisation Étape 3 : Service Layer

### Objectif

Séparer la logique métier des controllers Express en introduisant une couche de services dédiée pour chaque entité principale (Test, Course, Package, Question, Admin).

### Pourquoi ?
- **Lisibilité** : Les controllers sont plus simples, ne gèrent que la logique HTTP.
- **Réutilisabilité** : La logique métier peut être réutilisée ailleurs (autres controllers, scripts, tests).
- **Testabilité** : Les services sont plus faciles à tester unitairement.
- **Séparation des responsabilités** : Respect du principe Single Responsibility.

### Structure

- `src/services/`
  - `test.service.ts` : Logique métier des tests (calcul score, résultats, etc.)
  - `course.service.ts` : Logique métier des cours
  - `package.service.ts` : Logique métier des packages
  - `question.service.ts` : Logique métier des questions
  - `admin.service.ts` : Statistiques et opérations d'administration

### Exemple (avant/après)

**Avant (dans le controller)**
```ts
const course = await prisma.course.findUnique({ ... });
```

**Après (dans le controller)**
```ts
const course = await CourseService.getById(id);
```

**Service**
```ts
export class CourseService {
  static async getById(id: string) {
    return prisma.course.findUnique({ where: { id } });
  }
}
```

### Fichiers modifiés
- `src/controllers/*.controller.ts` : Utilisent maintenant les services
- `src/services/*.service.ts` : Nouvelle logique métier

### Validation
- Tous les tests manuels et automatisés doivent passer
- Les controllers ne contiennent plus de logique métier directe

---

*Refactorisation réalisée le 16/10/2025*
