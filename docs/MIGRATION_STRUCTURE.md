# Guide de Migration - Nouvelle Structure du Projet

Ce guide explique les changements de structure et comment s'adapter à la nouvelle organisation.

## 🔄 Résumé des Changements

Le projet EduTeQC a été **complètement réorganisé** pour une structure plus professionnelle et maintenable.

### Avant → Après

```
❌ ANCIENNE STRUCTURE          ✅ NOUVELLE STRUCTURE
├── docs/                     ├── docs/
│   └── [tous fichiers]       │   ├── deployment/
├── backend/                  │   ├── development/
│   ├── prisma/              │   ├── features/
│   │   └── *.ts (scripts)   │   ├── guides/
│   └── src/                 │   └── testing/
├── mobile/                   ├── backend/
├── tests/                    │   ├── prisma/
│   └── e2e-tests.js         │   └── src/
├── *.ps1 (éparpillés)       ├── mobile/
├── eas.json                  ├── scripts/
└── app.json                  │   ├── database/
                             │   └── powershell/
                             ├── config/
                             └── tools/
```

## 📁 Nouveaux Emplacements

### Scripts
| Ancien Emplacement | Nouveau Emplacement | Description |
|-------------------|-------------------|-------------|
| `backend/prisma/*.ts` | `scripts/database/` | Scripts Prisma organisés par catégorie |
| `*.ps1` (racine) | `scripts/powershell/` | Scripts PowerShell centralisés |
| `backend/*.ps1` | `scripts/powershell/` | Scripts PowerShell backend |

### Documentation
| Ancien Emplacement | Nouveau Emplacement | Type |
|-------------------|-------------------|------|
| `docs/DEPLOYMENT_GUIDE.md` | `docs/deployment/DEPLOYMENT_GUIDE.md` | Déploiement |
| `docs/ANDROID_SETUP.md` | `docs/development/ANDROID_SETUP.md` | Développement |
| `docs/ADMIN_TABS_FEATURE.md` | `docs/features/ADMIN_TABS_FEATURE.md` | Fonctionnalités |
| `docs/QUICKSTART.md` | `docs/guides/QUICKSTART.md` | Guides |
| `docs/REGRESSION_TESTS.md` | `docs/testing/REGRESSION_TESTS.md` | Tests |

### Configuration
| Ancien Emplacement | Nouveau Emplacement |
|-------------------|-------------------|
| `eas.json` | `config/eas.json` |
| `app.json` | `config/app.json` |

### Outils
| Ancien Emplacement | Nouveau Emplacement |
|-------------------|-------------------|
| `tests/e2e-tests.js` | `tools/e2e-tests.js` |

## 🚀 Mise à Jour des Commandes

### Scripts de Base de Données

**Avant :**
```bash
cd backend
npx ts-node prisma/create-complete-education-system.ts
npx ts-node prisma/update-courses-images.ts
```

**Après :**
```bash
cd backend
npx ts-node ../scripts/database/setup/create-complete-education-system.ts
npx ts-node ../scripts/database/images/update-courses-images.ts
```

### Scripts PowerShell

**Avant :**
```powershell
.\build-production.ps1
.\test-local.ps1
```

**Après :**
```powershell
.\scripts\powershell\build-production.ps1
.\scripts\powershell\test-local.ps1
```

### Configuration EAS

**Avant :**
```bash
eas build --profile production
```

**Après :**
```bash
eas build --profile production --config config/eas.json
```

## 📚 Navigation Documentation

### Liens Mis à Jour

**Guides de Démarrage :**
- `docs/guides/QUICKSTART.md`
- `docs/guides/OVERVIEW.md`

**Configuration Développement :**
- `docs/development/ANDROID_SETUP.md`
- `docs/development/MIGRATION_GUIDE.md`

**Déploiement :**
- `docs/deployment/DEPLOYMENT_GUIDE.md`
- `docs/deployment/RAILWAY_DEPLOYMENT.md`

**Fonctionnalités :**
- `docs/features/ADMIN_TABS_FEATURE.md`
- `docs/features/COURSE_SECTIONS_ARCHITECTURE.md`

**Tests :**
- `docs/testing/REGRESSION_TESTS.md`
- `docs/testing/ADMIN_GLOBAL_TESTS_CONSTRAINT.md`

## ⚙️ Configuration IDE

### VS Code
Mettre à jour `.vscode/settings.json` si nécessaire :

```json
{
  "files.exclude": {
    "**/node_modules": true,
    "scripts/database/**/*.js": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

### Scripts Favoris
Mettre à jour vos raccourcis personnels :

```json
{
  "scripts": {
    "db:setup": "cd backend && npx ts-node ../scripts/database/setup/create-complete-education-system.ts",
    "db:content": "cd backend && npx ts-node ../scripts/database/content/add-course-content.ts",
    "db:images": "cd backend && npx ts-node ../scripts/database/images/update-courses-images.ts"
  }
}
```

## 🔧 Avantages de la Nouvelle Structure

### 1. **Clarté**
- Chaque type de fichier a sa place logique
- Plus de mélange entre code, docs et scripts

### 2. **Maintenance**
- Documentation organisée par thème
- Scripts catégorisés par fonction
- Configuration centralisée

### 3. **Collaboration**
- Structure standard et professionnelle
- Facile à comprendre pour nouveaux développeurs
- Documentation bien organisée

### 4. **Évolutivité**
- Facile d'ajouter de nouveaux scripts
- Structure modulaire
- Séparation des responsabilités

## 📝 Actions Requises

### Pour les Développeurs

1. **Mettre à jour les bookmarks/favoris** vers les nouveaux emplacements
2. **Modifier les scripts personnels** utilisant les anciens chemins
3. **Mettre à jour les raccourcis IDE** si configurés
4. **Réviser la documentation** pour s'habituer à la nouvelle organisation

### Pour les Déploiements

1. **Mettre à jour les pipelines CI/CD** avec nouveaux chemins
2. **Modifier les scripts de déploiement** si nécessaire
3. **Vérifier les liens de documentation** dans les wikis/sites

## 🆘 Support

En cas de problème avec la migration :

1. Consulter `docs/PROJECT_STRUCTURE.md` pour la documentation complète
2. Vérifier `scripts/README.md` pour l'usage des scripts
3. Créer une issue GitHub si nécessaire

La nouvelle structure améliore significativement l'organisation du projet et facilitera la maintenance et l'évolution future !