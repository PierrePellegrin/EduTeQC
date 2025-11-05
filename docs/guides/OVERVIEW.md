# 📱 EduTeQC - Application Mobile d'Apprentissage

## ✨ Votre application est prête !

J'ai créé pour vous une **application mobile complète** React Native avec un backend robuste. Voici ce qui a été développé :

---

## 🎯 Fonctionnalités Implémentées

### 📱 Application Mobile (iOS & Android)
✅ **Authentification complète**
- Inscription / Connexion
- Gestion JWT sécurisée
- Rôles Client et Admin

✅ **Interface Client**
- Liste des cours avec recherche
- Affichage détaillé des cours
- Tests QCM (choix simple/multiple)
- Suivi de progression
- Affichage des résultats

✅ **Interface Admin**
- Dashboard avec statistiques
- Gestion complète des cours (CRUD)
- Gestion des tests et questions
- Publication/Dépublication de contenu

✅ **Design Modern 2025**
- Material Design 3
- Thème clair/sombre automatique
- Animations fluides
- Interface intuitive et accessible

### 🔧 Backend API (Node.js)
✅ **Architecture Robuste**
- API REST avec Express
- TypeScript pour la sécurité du code
- Validation avec Zod
- Gestion d'erreurs centralisée

✅ **Base de Données**
- PostgreSQL avec Prisma ORM
- Schéma complet (Users, Courses, Tests, Questions, Results)
- Migrations automatiques
- Seed pour données de test

✅ **Sécurité**
- Authentification JWT
- Hashage bcrypt des mots de passe
- Middleware d'autorisation
- CORS configuré

---

## 📂 Structure du Projet

```
EduTeQC/
├── backend/                    # API Node.js/Express
│   ├── prisma/
│   │   ├── schema.prisma      # Modèle de base de données
│   │   └── seed.ts            # Données de test
│   ├── src/
│   │   ├── server.ts          # Point d'entrée
│   │   ├── lib/
│   │   │   └── prisma.ts      # Client Prisma
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   └── routes/
│   │       ├── auth.routes.ts
│   │       ├── course.routes.ts
│   │       ├── test.routes.ts
│   │       └── admin.routes.ts
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                     # Application React Native
│   ├── src/
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── CoursesListScreen.tsx
│   │   │   ├── CourseDetailScreen.tsx
│   │   │   ├── TestScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── AdminDashboardScreen.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── index.ts
│   ├── App.tsx
│   ├── app.json
│   └── package.json
│
└── Documentation/
    ├── README.md              # Documentation principale
    ├── QUICKSTART.md          # Guide de démarrage rapide
    ├── API_EXAMPLES.md        # Exemples d'API
    ├── DESIGN_GUIDE.md        # Guide de design
    └── DEPLOYMENT.md          # Guide de déploiement
```

---

## 🚀 Démarrage Rapide

### 1️⃣ Installation des Dépendances

```powershell
# À la racine du projet
npm run install:all
```

### 2️⃣ Configuration Backend

```powershell
cd backend

# Copier le fichier .env
copy .env.example .env

# Modifier .env avec vos paramètres PostgreSQL
# DATABASE_URL="postgresql://postgres:password@localhost:5432/eduteqc?schema=public"

# Générer Prisma et créer la base
npm run prisma:generate
npm run prisma:migrate

# Charger les données de test
npm run prisma:seed
```

### 3️⃣ Lancer l'Application

**Option A: Lancer séparément**
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Mobile
cd mobile
npm start
```

**Option B: Lancer ensemble (après installation de concurrently)**
```powershell
npm run dev
```

---

## 👤 Comptes de Test

Après le seed, vous aurez accès à :

**Compte Admin:**
- Email: `admin@eduteqc.com`
- Password: `admin123`

**Compte Client:**
- Email: `client@eduteqc.com`
- Password: `client123`

---

## 🎨 Technologies Utilisées

### Frontend Mobile
- **React Native** - Framework mobile
- **Expo** - Toolchain et SDK
- **TypeScript** - Typage statique
- **React Navigation** - Navigation
- **React Native Paper** - Composants Material Design 3
- **TanStack Query** - Gestion d'état serveur
- **Axios** - Client HTTP
- **Expo Secure Store** - Stockage sécurisé

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Typage statique
- **PostgreSQL** - Base de données
- **Prisma** - ORM moderne
- **JWT** - Authentification
- **Bcrypt** - Hashage de mots de passe
- **Zod** - Validation de schémas

---

## 📊 Modèle de Données

### User (Utilisateur)
- Authentification (email, password hashé)
- Rôles: CLIENT ou ADMIN
- Informations personnelles

### Course (Cours)
- Titre, description, catégorie
- Contenu complet du cours
- Image d'illustration
- Statut de publication

### Test
- Lié à un cours
- Durée en minutes
- Score minimum pour réussir
- Questions QCM

### Question
- Type: choix simple ou multiple
- Points attribués
- Options de réponse

### TestResult (Résultats)
- Score obtenu
- Réponses de l'utilisateur
- Statut réussite/échec

---

## 🎯 Prochaines Étapes

### Phase 1: Développement Local ✅
- [x] Backend API
- [x] Base de données
- [x] Application mobile
- [x] Authentification
- [x] Design Material 3

### Phase 2: Améliorations (Optionnel)
- [ ] Notifications push
- [ ] Mode hors-ligne
- [ ] Partage de résultats
- [ ] Système de badges/achievements
- [ ] Statistiques avancées
- [ ] Export PDF des cours
- [ ] Recherche avancée

### Phase 3: Déploiement
- [ ] Backend sur Railway/Heroku
- [ ] Base de données PostgreSQL en production
- [ ] Build mobile avec EAS
- [ ] Publication sur Play Store
- [ ] Publication sur App Store

---

## 📚 Documentation

- **README.md** - Documentation complète
- **QUICKSTART.md** - Démarrage en 5 minutes
- **API_EXAMPLES.md** - Exemples d'utilisation de l'API
- **DESIGN_GUIDE.md** - Guide de design Material 3
- **DEPLOYMENT.md** - Guide de déploiement complet

---

## 🛠️ Scripts Disponibles

### Racine du Projet
```powershell
npm run install:all      # Installer toutes les dépendances
npm run dev             # Lancer backend + mobile ensemble
npm run dev:backend     # Lancer uniquement le backend
npm run dev:mobile      # Lancer uniquement l'app mobile
npm run prisma:seed     # Charger les données de test
npm run prisma:studio   # Interface visuelle pour la DB
```

### Backend
```powershell
npm run dev            # Mode développement
npm run build          # Build production
npm start              # Lancer en production
npm run prisma:migrate # Créer/appliquer migrations
```

### Mobile
```powershell
npm start              # Démarrer Expo
npm run android        # Lancer sur Android
npm run ios            # Lancer sur iOS
```

---

## 🎨 Personnalisation

### Changer les Couleurs
Éditez `mobile/src/contexts/ThemeContext.tsx` pour modifier la palette de couleurs.

### Ajouter des Catégories
Les catégories sont dynamiques - elles proviennent des cours créés.

### Modifier le Logo
Remplacez les fichiers dans `mobile/assets/`:
- `icon.png` (1024×1024)
- `splash.png` (1284×2778)
- `adaptive-icon.png` (1024×1024)

---

## 🐛 Support

En cas de problème :
1. Consultez **QUICKSTART.md** pour le troubleshooting
2. Vérifiez que PostgreSQL est lancé
3. Vérifiez que les dépendances sont installées
4. Consultez les logs du backend et de l'app mobile

---

## 📄 License

MIT - Libre d'utilisation et modification

---

## 🎉 Félicitations !

Vous avez maintenant une **application mobile complète et professionnelle** avec :
- ✅ Backend API robuste
- ✅ Base de données structurée
- ✅ App mobile iOS/Android
- ✅ Design moderne 2025
- ✅ Authentification sécurisée
- ✅ Interface admin complète

**Bon développement ! 🚀**

---

*Créé avec ❤️ pour l'éducation - Octobre 2025*
