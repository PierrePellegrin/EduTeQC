# Structure du Projet EduTeQC

Ce document décrit l'organisation complète du projet après réorganisation.

## 📁 Hiérarchie des Dossiers

```
EduTeQCV2/
├── 📱 mobile/                    # Application React Native
│   ├── src/
│   │   ├── components/           # Composants réutilisables
│   │   ├── screens/             # Écrans de l'application
│   │   ├── navigation/          # Configuration navigation
│   │   ├── services/            # Services API
│   │   ├── hooks/               # Hooks personnalisés
│   │   ├── types/               # Types TypeScript
│   │   └── utils/               # Utilitaires
│   ├── assets/
│   │   └── images/              # Images de l'app
│   ├── tests/                   # Tests mobile
│   ├── App.tsx                  # Point d'entrée
│   ├── package.json
│   └── validation-dashboard-client.ts
│
├── 🖥️ backend/                   # API Node.js + Prisma
│   ├── src/
│   │   ├── controllers/         # Contrôleurs de routes
│   │   ├── routes/              # Définitions des routes
│   │   ├── middleware/          # Middlewares Express
│   │   ├── services/            # Logique métier
│   │   ├── validators/          # Validation des données
│   │   └── lib/                 # Utilitaires backend
│   ├── prisma/
│   │   ├── schema.prisma        # Schéma de base de données
│   │   └── migrations/          # Migrations DB
│   ├── tests/                   # Tests backend
│   ├── types/                   # Types TypeScript
│   └── server.ts                # Serveur principal
│
├── 📚 docs/                      # Documentation organisée
│   ├── deployment/              # 🚀 Guides de déploiement
│   │   ├── DEPLOYMENT_GUIDE.md
│   │   ├── RAILWAY_DEPLOYMENT.md
│   │   ├── APK_GENERATION_GUIDE.md
│   │   └── TEST_DEPLOYMENT.md
│   ├── development/             # 🔧 Guides de développement
│   │   ├── ANDROID_SETUP.md
│   │   ├── MIGRATION_GUIDE.md
│   │   ├── REACT_HOOKS_RULES.md
│   │   ├── REFACTORING_BACKEND.md
│   │   └── REFACTORING_FRONTEND.md
│   ├── features/                # 🎯 Documentation des fonctionnalités
│   │   ├── ADMIN_TABS_FEATURE.md
│   │   ├── COURSE_SECTIONS_ARCHITECTURE.md
│   │   ├── SECTION_EDITOR_GUIDE.md
│   │   └── PROGRESSION_SYSTEM.md
│   ├── guides/                  # 📖 Guides généraux
│   │   ├── QUICKSTART.md
│   │   ├── OVERVIEW.md
│   │   ├── API_EXAMPLES.md
│   │   ├── DESIGN_GUIDE.md
│   │   └── COMPLETE_PERFORMANCE_GUIDE.md
│   ├── testing/                 # 🧪 Documentation des tests
│   │   ├── REGRESSION_TESTS.md
│   │   ├── ADMIN_GLOBAL_TESTS_CONSTRAINT.md
│   │   └── SECTIONS_TEST_GUIDE.md
│   ├── archive/                 # 📦 Anciens documents
│   │   └── README.md
│   ├── README.md                # Index navigation
│   ├── PROJECT_STRUCTURE.md     # Ce document
│   └── MIGRATION_STRUCTURE.md   # Guide migration
│
├── 🔧 scripts/                   # Scripts utilitaires
│   ├── database/                # Scripts Prisma/DB
│   │   ├── setup/               # Configuration système
│   │   │   ├── create-complete-education-system.ts
│   │   │   └── link-courses-to-packages.ts
│   │   ├── content/             # Gestion contenu pédagogique
│   │   │   ├── add-course-content.ts
│   │   │   ├── add-missing-content.ts
│   │   │   └── complete-content.ts
│   │   └── images/              # Gestion images
│   │       ├── update-courses-images.ts
│   │       ├── update-packages-images.ts
│   │       └── update-only-validated-images.ts
│   ├── powershell/              # Scripts PowerShell
│   │   ├── build-production.ps1
│   │   ├── test-local.ps1
│   │   └── [autres scripts].ps1
│   ├── README.md                # Documentation des scripts
│   └── SCRIPTS_README.md        # Ancien README (à fusionner)
│
├── ⚙️ config/                    # Fichiers de configuration
│   ├── eas.json                 # Configuration EAS Build
│   └── app.json                 # Configuration Expo
│
├── 🛠️ tools/                     # Outils et utilitaires
│   └── e2e-tests.js             # Tests end-to-end
│
├── 💾 backups/                   # Sauvegardes base de données
│   ├── backup_avant_migration_20251022.sql
│   └── README.md                # Guide des backups
│
├── 📦 releases/                  # Builds de production
│   ├── EduTeQC-Production.apk
│   └── README.md                # Guide des releases
│
├── 📄 Fichiers racine
│   ├── README.md                # Documentation principale
│   ├── package.json             # Configuration npm racine
│   ├── .gitignore               # Exclusions Git
│   └── LICENSE
│
└── 📁 Dossiers système
    ├── .git/                    # Dépôt Git
    ├── .github/                 # Actions GitHub
    └── node_modules/            # Dépendances npm
```

## 🎯 Principes d'Organisation

### 1. **Séparation par Fonction**
- Chaque dossier a un rôle clairement défini
- Pas de mélange entre code, documentation et scripts

### 2. **Documentation Structurée**
- **guides/** : Documentation générale et API
- **development/** : Guides pour les développeurs
- **deployment/** : Guides de mise en production
- **features/** : Documentation des fonctionnalités spécifiques
- **testing/** : Documentation des tests

### 3. **Scripts Organisés**
- **database/** : Scripts de gestion BDD par catégorie
- **powershell/** : Scripts d'automatisation Windows
- Documentation dédiée avec exemples d'usage

### 4. **Configuration Centralisée**
- **config/** : Tous les fichiers de configuration
- Évite la dispersion dans le projet

### 5. **Outils Séparés**
- **tools/** : Utilitaires et scripts de test
- Séparation claire du code applicatif

## 🔄 Migration depuis l'Ancienne Structure

### Déplacements Effectués

1. **Scripts PowerShell** : `*.ps1` → `scripts/powershell/`
2. **Scripts Prisma** : `backend/prisma/*.ts` → `scripts/database/`
3. **Configuration** : `eas.json`, `app.json` → `config/`
4. **Documentation** : Réorganisée dans `docs/` par thème
5. **Outils** : `tests/e2e-tests.js` → `tools/`

### Avantages de la Nouvelle Structure

- ✅ **Clarté** : Chaque élément a sa place logique
- ✅ **Maintenance** : Plus facile de trouver et modifier
- ✅ **Collaboration** : Structure standard compréhensible
- ✅ **Évolutivité** : Facile d'ajouter de nouveaux éléments
- ✅ **Documentation** : Organisation thématique claire

## 📋 Utilisation

### Accès aux Scripts
```bash
# Scripts de base de données (depuis backend/)
npx ts-node ../scripts/database/setup/create-complete-education-system.ts

# Scripts PowerShell (depuis racine)
.\scripts\powershell\nom-script.ps1
```

### Navigation Documentation
```
docs/
├── Démarrage rapide     → guides/QUICKSTART.md
├── Configuration dev    → development/ANDROID_SETUP.md
├── Déploiement         → deployment/DEPLOYMENT_GUIDE.md
├── Fonctionnalités     → features/ADMIN_TABS_FEATURE.md
└── Tests              → testing/REGRESSION_TESTS.md
```

Cette organisation respecte les bonnes pratiques des projets modernes et facilite grandement la maintenance et l'évolution du projet.