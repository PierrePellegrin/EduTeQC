# Guide de Démarrage Rapide - EduTeQC

## 🎯 Démarrage en 5 minutes

### Étape 1: Installation PostgreSQL

1. Téléchargez PostgreSQL: https://www.postgresql.org/download/
2. Installez-le avec les paramètres par défaut
3. Notez le mot de passe que vous définissez pour l'utilisateur `postgres`

### Étape 2: Configuration Backend

```powershell
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
copy .env.example .env
```

Modifiez `.env` avec vos informations:
```
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/eduteqc?schema=public"
JWT_SECRET="changez-cette-clef-secrete"
PORT=3000
NODE_ENV=development
```

```powershell
# Générer Prisma et créer la base de données
npm run prisma:generate
npm run prisma:migrate

# Démarrer le serveur
npm run dev
```

✅ Le backend est prêt sur http://localhost:3000

### Étape 3: Configuration Mobile

```powershell
# Dans un nouveau terminal, aller dans le dossier mobile
cd mobile

# Installer les dépendances
npm install

# Démarrer Expo
npm start
```

✅ L'application mobile est prête !

### Étape 4: Tester l'Application

1. Scannez le QR code avec Expo Go (Android/iOS)
2. OU appuyez sur `a` pour Android, `i` pour iOS (si émulateur installé)
3. Créez un compte dans l'app

### Étape 5: Créer un Compte Admin

Dans un nouveau terminal:

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"admin@test.com\",\"password\":\"admin123\",\"firstName\":\"Admin\",\"lastName\":\"Test\",\"role\":\"ADMIN\"}"
```

Connectez-vous avec:
- Email: `admin@test.com`
- Password: `admin123`

## 🎓 Exemple: Créer un Premier Cours

### Via l'API (avec le token admin)

```powershell
# 1. Se connecter et récupérer le token
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@test.com","password":"admin123"}'

$token = $response.token

# 2. Créer un cours
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/courses" `
  -Method POST `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{
    "title":"Introduction au JavaScript",
    "description":"Apprenez les bases de JavaScript",
    "category":"Programmation",
    "content":"JavaScript est un langage de programmation...",
    "order":1,
    "isPublished":true
  }'
```

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifiez que PostgreSQL est lancé
- Vérifiez DATABASE_URL dans `.env`
- Essayez `npm run prisma:generate` à nouveau

### L'app mobile ne se connecte pas à l'API
- Sur Android/iOS réel: Changez `http://localhost:3000` par votre IP locale
- Dans `mobile/src/services/api.ts`, ligne 4:
  ```typescript
  const API_URL = 'http://VOTRE_IP:3000/api'; // ex: 'http://192.168.1.10:3000/api'
  ```

### Erreur de modules manquants
```powershell
# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install

# Mobile
cd mobile
rm -rf node_modules
rm package-lock.json
npm install
```

## 📚 Prochaines Étapes

1. ✅ Créer des cours dans le dashboard admin
2. ✅ Ajouter des tests avec des questions QCM
3. ✅ Tester l'expérience utilisateur côté client
4. ✅ Personnaliser les thèmes et couleurs
5. ✅ Déployer en production

## 🎨 Personnalisation

### Changer les couleurs du thème
Éditez `mobile/src/contexts/ThemeContext.tsx`:
```typescript
const customLightColors = {
  primary: 'rgb(103, 80, 164)', // Votre couleur principale
  // ...
};
```

### Changer le logo
Remplacez les fichiers dans `mobile/assets/`:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024)

## 🚀 Build Production

### Backend
```powershell
npm run build
npm start
```

### Mobile
```powershell
expo build:android
expo build:ios
```

Bon développement ! 🎉
