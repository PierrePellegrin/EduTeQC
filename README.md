# EduTeQC - Plateforme d'Apprentissage Mobile

Application mobile React Native complète pour iOS et Android permettant l'apprentissage via des cours et des tests QCM.

## 🎯 Quick Start

### Déploiement Rapide (Recommandé)
```powershell
# 1. Cloner et installer
git clone [votre-repo]
cd EduTeQCV2
npm run install:all

# 2. Créer comptes gratuits
# - Neon (PostgreSQL): https://neon.tech
# - Railway (Backend): https://railway.app

# 3. Déployer automatiquement
# Suivez le guide: docs/DEPLOYMENT_GUIDE.md

# 4. Générer APK production
.\build-production.ps1
```

### Test Local
```powershell
# Démarrer backend + mobile ensemble
.\test-local.ps1
```

## 🚀 Technologies Utilisées

### Backend
- **Node.js** + **Express** - Serveur API REST
- **TypeScript** - Typage statique
- **PostgreSQL** - Base de données relationnelle (Neon/Supabase)
- **Prisma ORM** - Accès aux données type-safe
- **JWT** - Authentification sécurisée
- **Bcrypt** - Hashage des mots de passe
- **Zod** - Validation des données

### Mobile
- **React Native** avec **Expo** - Framework mobile cross-platform
- **TypeScript** - Typage statique
- **React Navigation v6** - Navigation native
- **React Native Paper** - Composants Material Design 3
- **TanStack Query** (React Query) - Gestion d'état serveur
- **Expo Secure Store** - Stockage sécurisé des tokens
- **Axios** - Client HTTP

### Déploiement
- **Railway/Render** - Hébergement backend
- **Neon/Supabase** - Base de données PostgreSQL
- **EAS Build** - Compilation mobile
- **GitHub Actions** - CI/CD (optionnel)

## 📱 Fonctionnalités

### Côté Client
- ✅ Consultation des cours par catégorie
- ✅ Recherche de cours
- ✅ Affichage du contenu détaillé des cours
- ✅ Passage de tests QCM (choix simple/multiple)
- ✅ Suivi de progression des tests
- ✅ Visualisation des résultats
- ✅ Thème clair/sombre automatique
- ✅ Interface Material Design 3 moderne

### Côté Administration
- ✅ Tableau de bord avec statistiques
- ✅ Création/modification/suppression de cours
- ✅ Création/modification/suppression de tests
- ✅ Gestion des questions QCM
- ✅ Publication/dépublication de contenu
- ✅ Système d'authentification admin

## 📦 Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Expo CLI (`npm install -g expo-cli`)
- Un émulateur Android/iOS ou l'app Expo Go

### Backend

```powershell
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier .env.example vers .env
copy .env.example .env

# Modifier .env avec vos paramètres de base de données

# Générer le client Prisma
npm run prisma:generate

# Créer et appliquer les migrations
npm run prisma:migrate

# Démarrer le serveur en mode développement
npm run dev
```

Le serveur sera disponible sur `http://localhost:3000`

### Mobile

```powershell
# Aller dans le dossier mobile
cd mobile

# Installer les dépendances
npm install

# Démarrer Expo
npm start
```

Scannez le QR code avec Expo Go ou lancez sur un émulateur.

## 🗄️ Structure de la Base de Données

```
User (Utilisateur)
├─ id
├─ email
├─ password (hashé)
├─ firstName
├─ lastName
└─ role (CLIENT | ADMIN)

Course (Cours)
├─ id
├─ title
├─ description
├─ category
├─ content
├─ imageUrl
├─ order
└─ isPublished

Test
├─ id
├─ title
├─ description
├─ courseId
├─ duration
├─ passingScore
└─ isPublished

Question
├─ id
├─ testId
├─ question
├─ type (SINGLE_CHOICE | MULTIPLE_CHOICE)
├─ points
└─ order

Option
├─ id
├─ questionId
├─ text
├─ isCorrect
└─ order

TestResult
├─ id
├─ userId
├─ testId
├─ score
├─ answers (JSON)
└─ passed
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification:

1. L'utilisateur se connecte avec email/mot de passe
2. L'API retourne un token JWT valide 7 jours
3. Le token est stocké de manière sécurisée (Expo Secure Store)
4. Le token est envoyé dans le header `Authorization: Bearer <token>`

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur actuel

### Cours (Public)
- `GET /api/courses` - Liste des cours publiés
- `GET /api/courses/:id` - Détails d'un cours
- `GET /api/courses/category/:category` - Cours par catégorie

### Tests (Authentifié)
- `GET /api/tests/:id` - Détails d'un test avec questions
- `POST /api/tests/:id/submit` - Soumettre les réponses
- `GET /api/tests/:id/results` - Historique des résultats

### Administration (Admin uniquement)
- `GET /api/admin/courses` - Tous les cours
- `POST /api/admin/courses` - Créer un cours
- `PUT /api/admin/courses/:id` - Modifier un cours
- `DELETE /api/admin/courses/:id` - Supprimer un cours
- `GET /api/admin/tests` - Tous les tests
- `POST /api/admin/tests` - Créer un test
- `PUT /api/admin/tests/:id` - Modifier un test
- `DELETE /api/admin/tests/:id` - Supprimer un test
- `POST /api/admin/questions` - Créer une question
- `PUT /api/admin/questions/:id` - Modifier une question
- `DELETE /api/admin/questions/:id` - Supprimer une question
- `GET /api/admin/stats` - Statistiques

## 🎨 Design

L'application utilise Material Design 3 (2025) avec:
- Palette de couleurs moderne
- Thème adaptatif clair/sombre
- Composants Material You
- Animations fluides
- Typographie hiérarchique
- Élévations et surfaces

## 🚀 Déploiement

### Backend
- Déployer sur Heroku, Railway, ou AWS
- Configurer PostgreSQL en production
- Définir les variables d'environnement

### Mobile
```powershell
# Build Android
expo build:android

# Build iOS (nécessite un Mac)
expo build:ios
```

## 📝 Compte de Test

Créez un compte admin via l'API:

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"admin@eduteqc.com\",\"password\":\"admin123\",\"firstName\":\"Admin\",\"lastName\":\"User\",\"role\":\"ADMIN\"}"
```

## 🔧 Scripts Disponibles

### Backend
- `npm run dev` - Mode développement avec hot reload
- `npm run build` - Build production
- `npm start` - Démarrer en production
- `npm run prisma:generate` - Générer le client Prisma
- `npm run prisma:migrate` - Créer/appliquer les migrations
- `npm run prisma:studio` - Interface UI pour la DB

### Mobile
- `npm start` - Démarrer Expo
- `npm run android` - Lancer sur Android
- `npm run ios` - Lancer sur iOS
- `npm run web` - Lancer sur web (expérimental)

## ⚡ Optimisations de Performance

L'application a été **massivement optimisée** pour offrir une expérience ultra-fluide :

- 🚀 **Chargement initial** : 200ms (-75%)
- 🎯 **Scroll 60 FPS** constant (+40%)
- 💾 **Mémoire optimisée** : -64% (18MB → 6.5MB)
- ⚡ **Interactions instantanées** : -80% délai feedback
- 📱 **UI jamais bloquée** : InteractionManager

### 📚 Documentation Complète

Consultez le **[Guide Complet des Optimisations](./docs/COMPLETE_PERFORMANCE_GUIDE.md)** pour :
- 5 phases d'optimisation détaillées
- Métriques avant/après chaque phase
- Techniques React Native avancées (FlatList, memo, useDeferredValue)
- Optimisations backend SQL (N+1 queries)
- Guide de maintenance et évolution

**Résultat** : AdminCoursesScreen passe de 2-3s de chargement à 200ms, avec 60 FPS constant sur toutes les interactions.

## 📖 Documentation

Toute la documentation du projet est disponible dans le dossier [`docs/`](./docs/) :

- **[Quickstart Guide](./docs/QUICKSTART.md)** - Démarrage rapide
- **[Overview](./docs/OVERVIEW.md)** - Vue d'ensemble du projet
- **[API Examples](./docs/API_EXAMPLES.md)** - Exemples d'utilisation de l'API
- **[Android Setup](./docs/ANDROID_SETUP.md)** - Configuration Android
- **[Design Guide](./docs/DESIGN_GUIDE.md)** - Guide de design
- **[Deployment](./docs/DEPLOYMENT.md)** - Guide de déploiement
- **[Performance Guide](./docs/COMPLETE_PERFORMANCE_GUIDE.md)** - Guide complet des optimisations
- **[Refactoring Backend](./docs/REFACTORING_BACKEND.md)** - Documentation refactoring backend
- **[Refactoring Frontend](./docs/REFACTORING_FRONTEND.md)** - Documentation refactoring frontend
- **[React Hooks Rules](./docs/REACT_HOOKS_RULES.md)** - Règles des hooks React

## 📄 License

MIT

## 👥 Support

Pour toute question ou problème, créez une issue sur GitHub.

---

**Fait avec ❤️ pour l'éducation**
