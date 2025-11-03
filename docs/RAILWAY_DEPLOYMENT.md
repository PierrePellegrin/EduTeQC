# 🚂 Déploiement Railway - Guide Étape par Étape

## ✅ Votre backend est prêt !

Votre DATABASE_URL Neon est configurée et le backend est prêt. Suivez ces étapes exactes :

---

## 📋 Étape 1 : Créer un Compte Railway

1. **Allez sur** [railway.app](https://railway.app)
2. **Cliquez sur** "Login"
3. **Connectez-vous avec GitHub** (recommandé)
4. **Autorisez Railway** à accéder à vos dépôts

---

## 📋 Étape 2 : Créer un Nouveau Projet

1. **Cliquez sur** "New Project"
2. **Sélectionnez** "Deploy from GitHub repo"
3. **Choisissez votre dépôt** `EduTeQCV2`
4. **Important :** Sélectionnez le dossier `backend` comme "Root Directory"

---

## 📋 Étape 3 : Configurer les Variables d'Environnement

Dans Railway, allez dans l'onglet **Variables** et ajoutez :

### Variables Obligatoires :

```env
DATABASE_URL=postgresql://neondb_owner:npg_YlN6o4XuHeLn@ep-royal-violet-aggvvmqt-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=votre-cle-jwt-super-secrete-de-32-caracteres-minimum-changez-ceci

NODE_ENV=production

PORT=3000
```

### Variables Optionnelles :

```env
CORS_ORIGINS=*
```

**⚠️ IMPORTANT :** Changez le `JWT_SECRET` par une vraie clé secrète !

Exemple de clé forte :
```
JWT_SECRET=8f2d7e3a9b1c4f6e8d2a5c7b9e1f3a6d8c2e5f7a9b3d6e8f1c4a7e9b2f5d8c1e4
```

---

## 📋 Étape 4 : Déployer

1. Railway va automatiquement détecter votre `package.json`
2. **Il va builder automatiquement** avec les commandes définies
3. **Attendez** que le déploiement se termine (2-5 minutes)
4. **Vous obtiendrez une URL** comme : `https://backend-production-xxxx.railway.app`

---

## 📋 Étape 5 : Vérifier le Déploiement

### A. Tester le Health Check

Ouvrez votre URL Railway + `/health` dans un navigateur :
```
https://votre-app.railway.app/health
```

**Résultat attendu :**
```json
{"status":"OK","timestamp":"2025-11-03T..."}
```

### B. Tester l'API de Login

```powershell
# Remplacez par votre vraie URL Railway
$API_URL = "https://votre-app.railway.app"

curl -X POST "$API_URL/api/auth/login" `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@eduteqc.com","password":"admin123"}'
```

**Résultat attendu :**
```json
{"token":"eyJ...", "user":{"id":"...", "role":"ADMIN"}}
```

---

## 🐛 Résolution de Problèmes

### ❌ Erreur "Build Failed"
- **Vérifiez** que vous avez sélectionné le dossier `backend` comme Root Directory
- **Consultez** les logs de build dans Railway
- **Vérifiez** que `package.json` contient bien les scripts de build

### ❌ Erreur "Database Connection"
- **Double-vérifiez** votre `DATABASE_URL` dans les variables
- **Assurez-vous** que `sslmode=require` est présent
- **Testez** la connexion depuis votre machine locale

### ❌ Erreur "Prisma Migration"
- Les migrations vont s'exécuter automatiquement au démarrage
- **Si ça échoue**, consultez les logs Railway
- **Vous pouvez** forcer les migrations en redéployant

### ❌ Service en "Crash Loop"
- **Consultez** les logs dans Railway
- **Vérifiez** que toutes les variables d'environnement sont définies
- **Le premier démarrage** peut prendre jusqu'à 2 minutes

---

## ✅ Une Fois Déployé

Votre backend sera accessible à :
```
https://votre-app-unique.railway.app
```

**Endpoints disponibles :**
- `GET /health` - Vérification de santé
- `POST /api/auth/login` - Connexion
- `GET /api/courses` - Liste des cours
- `GET /api/admin/stats` - Statistiques admin
- Et tous les autres endpoints de votre API

---

## 🎯 Prochaine Étape

Une fois votre backend déployé et fonctionnel :

1. **Copiez votre URL Railway**
2. **Mettez à jour** `mobile/src/config/api.config.ts`
3. **Générez un APK de production** avec `.\build-production.ps1`

**Votre application sera alors 100% fonctionnelle ! 🚀**