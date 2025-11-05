# 🚀 Guide de Déploiement EduTeQC Backend

## ✅ Prérequis

Votre backend est maintenant prêt pour le déploiement ! Suivez ces étapes :

---

## 🗄️ 1. Base de Données - Neon (PostgreSQL)

### Créer un compte Neon
1. Allez sur [neon.tech](https://neon.tech)
2. Créez un compte gratuit
3. Créez un nouveau projet :
   - **Database name:** `eduteqc`
   - **Region:** Choisissez la plus proche (Europe West par exemple)
   - **PostgreSQL version:** Laissez la dernière

### Récupérer les informations de connexion
1. Dans votre dashboard Neon, allez dans **Settings > Connection details**
2. Copiez l'URL de connexion qui ressemble à :
   ```
   postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/eduteqc?sslmode=require
   ```

---

## 🚂 2. Backend - Railway

### Créer un compte Railway
1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub
3. Autorisez Railway à accéder à vos dépôts

### Déployer le backend
1. **New Project** > **Deploy from GitHub repo**
2. Sélectionnez votre dépôt `EduTeQCV2`
3. Sélectionnez le dossier `backend` comme root directory

### Configuration des variables d'environnement
Dans Railway, allez dans **Variables** et ajoutez :

```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
JWT_SECRET=votre-cle-jwt-super-secrete-de-32-caracteres-minimum
NODE_ENV=production
PORT=3000
```

### Configurer le build
Railway va automatiquement :
1. Installer les dépendances (`npm install`)
2. Construire l'app (`npm run build`)
3. Exécuter les migrations Prisma
4. Démarrer le serveur (`npm start`)

---

## 📱 3. Configuration de l'App Mobile

Une fois votre backend déployé, vous obtiendrez une URL comme :
`https://your-app-name.railway.app`

### Mettre à jour l'URL de l'API
Dans `mobile/src/services/api.ts`, ajoutez votre URL de production :

```typescript
// Remplacez par l'URL de votre backend Railway
const PRODUCTION_API_URL = "https://your-app-name.railway.app/api";

const API_URL = process.env.NODE_ENV === 'production' 
  ? PRODUCTION_API_URL 
  : (envUrl ?? fallbackHost);
```

### Tester avec un APK
Générez un nouveau APK avec la configuration de production :

```powershell
cd mobile
npx expo prebuild --platform android
cd android
.\gradlew assembleRelease
```

---

## 🔧 4. Alternative - Render (Si Railway ne fonctionne pas)

### Créer un compte Render
1. Allez sur [render.com](https://render.com)
2. Connectez-vous avec GitHub

### Déployer sur Render
1. **New Web Service**
2. Connectez votre dépôt GitHub
3. Configuration :
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build && npx prisma generate`
   - **Start Command:** `npm start`

### Variables d'environnement Render
Ajoutez les mêmes variables que pour Railway.

---

## 🔧 5. Alternative - Supabase (Base de données)

Si Neon ne fonctionne pas, utilisez Supabase :

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans **Settings > Database**, récupérez l'URL de connexion
4. Utilisez cette URL dans votre `DATABASE_URL`

---

## ✅ 6. Vérification du Déploiement

### Tester l'API
Une fois déployé, testez votre API :

```bash
# Health check
curl https://your-app-name.railway.app/health

# Test login
curl -X POST https://your-app-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eduteqc.com","password":"admin123"}'
```

### Vérifier les logs
Dans Railway/Render, consultez les logs pour vérifier que :
- Le serveur démarre correctement
- Les migrations Prisma s'exécutent
- Pas d'erreurs de connexion BDD

---

## 🛠️ 7. Résolution de Problèmes

### Erreur de connexion BDD
- Vérifiez que `DATABASE_URL` est correcte
- Vérifiez que `sslmode=require` est présent
- Testez la connexion depuis votre machine locale

### Erreur de build
- Vérifiez que `package.json` contient tous les scripts
- Vérifiez les versions Node.js (utilisez Node 18+)

### Erreur CORS
- Ajoutez votre domaine dans les origines CORS
- Pour le développement, utilisez `CORS_ORIGINS=*`

---

## 📋 Récapitulatif des Étapes

1. ✅ **Créer compte Neon** → Récupérer DATABASE_URL
2. ✅ **Créer compte Railway** → Connecter dépôt GitHub  
3. ✅ **Configurer variables** → DATABASE_URL, JWT_SECRET, etc.
4. ✅ **Déployer backend** → Railway fait le build automatiquement
5. ✅ **Tester l'API** → Vérifier que /health fonctionne
6. ✅ **Mettre à jour app mobile** → Nouvelle URL d'API
7. ✅ **Générer APK** → Tester sur appareil physique

---

## 🎯 URLs Importantes

- **Neon Dashboard:** https://console.neon.tech
- **Railway Dashboard:** https://railway.app/dashboard
- **Votre API:** https://your-app-name.railway.app
- **Health Check:** https://your-app-name.railway.app/health

---

## 💡 Conseils

- **Gratuit:** Neon (500MB) + Railway (512MB RAM) = Parfait pour commencer
- **Évolutif:** Facile d'upgrader quand votre app grandit
- **Monitoring:** Railway fournit des métriques de performance
- **Logs:** Consultez toujours les logs en cas de problème

**Bon déploiement ! 🚀**