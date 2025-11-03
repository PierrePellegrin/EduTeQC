# 🎯 Informations de Déploiement Rapide

## 📋 Variables d'Environnement pour Railway

Copiez-collez exactement ces variables dans Railway :

### DATABASE_URL
```
postgresql://neondb_owner:npg_YlN6o4XuHeLn@ep-royal-violet-aggvvmqt-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### JWT_SECRET (Généré automatiquement)
```
29bb2be1f132d6d28ca8afa485033a7b7847140139329b4659e85c570637b50e
```

### NODE_ENV
```
production
```

### PORT
```
3000
```

### CORS_ORIGINS (Optionnel)
```
*
```

---

## 🚀 Actions à Faire Maintenant

1. **Allez sur** [railway.app](https://railway.app)
2. **Créez un compte** avec GitHub
3. **New Project** > **Deploy from GitHub repo**
4. **Sélectionnez** votre repo `EduTeQCV2`
5. **Root Directory :** `backend`
6. **Ajoutez** les variables ci-dessus
7. **Attendez** le déploiement (2-5 min)

---

## ✅ Tests Post-Déploiement

Une fois déployé, testez avec votre URL Railway :

```powershell
# Remplacez par votre vraie URL
$URL = "https://votre-app.railway.app"

# Test santé
curl "$URL/health"

# Test login
curl -X POST "$URL/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@eduteqc.com","password":"admin123"}'
```

---

## 📱 Ensuite : Configurer l'App Mobile

Dans `mobile/src/config/api.config.ts`, remplacez :
```typescript
production: 'https://votre-vraie-url-railway.app/api'
```

Puis générez l'APK :
```powershell
.\build-production.ps1
```

**Votre app sera alors 100% fonctionnelle ! 🎉**