# 🚀 Guide de Déploiement - EduTeQC

## Backend (API)

### Option 1: Railway.app (Recommandé)

1. **Créer un compte sur [Railway](https://railway.app/)**

2. **Connecter votre repo GitHub**

3. **Créer un nouveau projet:**
   - New Project → Deploy from GitHub
   - Sélectionnez votre repo
   - Sélectionnez le dossier `backend`

4. **Ajouter PostgreSQL:**
   - Add Service → Database → PostgreSQL

5. **Configurer les variables d'environnement:**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=VOTRE_SECRET_SUPER_SECURISE
   NODE_ENV=production
   PORT=3000
   ```

6. **Build Settings:**
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Root Directory: `/backend`

7. **Déployer:**
   - Railway déploie automatiquement
   - Récupérez l'URL publique (ex: `https://votre-app.up.railway.app`)

### Option 2: Heroku

```bash
# Installer Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Créer l'app
heroku create eduteqc-api

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurer les variables
heroku config:set JWT_SECRET=VOTRE_SECRET
heroku config:set NODE_ENV=production

# Déployer
git subtree push --prefix backend heroku main

# Migrer la base de données
heroku run npm run prisma:migrate
heroku run npm run prisma:seed
```

### Option 3: VPS (DigitalOcean, AWS, etc.)

```bash
# 1. Installer Node.js et PostgreSQL sur le serveur

# 2. Cloner le repo
git clone https://github.com/votre-username/eduteqc.git
cd eduteqc/backend

# 3. Installer les dépendances
npm install

# 4. Configurer .env
nano .env
# DATABASE_URL=postgresql://user:password@localhost:5432/eduteqc
# JWT_SECRET=votre_secret
# NODE_ENV=production

# 5. Build et migration
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 6. Installer PM2 (Process Manager)
npm install -g pm2

# 7. Démarrer l'application
pm2 start npm --name "eduteqc-api" -- start

# 8. Configurer le redémarrage automatique
pm2 startup
pm2 save

# 9. Configurer Nginx comme reverse proxy
sudo nano /etc/nginx/sites-available/eduteqc

# Contenu:
server {
    listen 80;
    server_name api.votredomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activer le site
sudo ln -s /etc/nginx/sites-available/eduteqc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 10. SSL avec Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.votredomaine.com
```

## Mobile (React Native)

### Option 1: Expo EAS (Expo Application Services)

```bash
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configurer le projet
cd mobile
eas build:configure

# 4. Mettre à jour l'URL de l'API
# Dans src/services/api.ts:
const API_URL = 'https://votre-api.railway.app/api';

# 5. Build Android
eas build --platform android

# 6. Build iOS (nécessite un compte Apple Developer)
eas build --platform ios

# 7. Soumettre au Play Store
eas submit --platform android

# 8. Soumettre à l'App Store
eas submit --platform ios
```

### Option 2: Build Local avec Expo

```bash
# Android APK
expo build:android -t apk

# Android App Bundle (pour le Play Store)
expo build:android -t app-bundle

# iOS (nécessite macOS)
expo build:ios
```

### Configuration pour Production

**1. Mettre à jour app.json:**
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "package": "com.votrecompany.eduteqc",
      "versionCode": 1,
      "permissions": [
        "INTERNET"
      ]
    },
    "ios": {
      "bundleIdentifier": "com.votrecompany.eduteqc",
      "buildNumber": "1.0.0",
      "supportsTablet": true
    }
  }
}
```

**2. Créer les assets:**
- Icône: 1024×1024px (PNG)
- Splash screen: 1284×2778px (PNG)
- Adaptive icon (Android): 1024×1024px (PNG)

**3. Configurer l'API URL:**
```typescript
// src/services/api.ts
const API_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://votre-api-production.com/api';
```

## Variables d'Environnement

### Backend (.env)
```bash
# Base de données
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=un-secret-super-long-et-complexe-minimum-32-caracteres

# Serveur
PORT=3000
NODE_ENV=production

# CORS (optionnel)
CORS_ORIGIN=https://votre-app-mobile.com
```

### Mobile (si nécessaire)
```bash
# Créer .env dans mobile/
API_URL=https://votre-api.com/api
```

## Checklist de Déploiement

### Backend
- [ ] PostgreSQL configuré et accessible
- [ ] Variables d'environnement définies
- [ ] Migrations appliquées
- [ ] Données de seed créées (optionnel)
- [ ] CORS configuré correctement
- [ ] HTTPS activé (certificat SSL)
- [ ] Logs configurés
- [ ] Backup de base de données programmé

### Mobile
- [ ] URL API de production configurée
- [ ] Icônes et splash screens créés
- [ ] Versions et build numbers mis à jour
- [ ] Permissions Android vérifiées
- [ ] Certificats de signing configurés
- [ ] Tests sur devices réels effectués
- [ ] App testée en mode release
- [ ] Screenshots préparés pour stores

## Monitoring et Maintenance

### Backend

**Logs avec PM2:**
```bash
pm2 logs eduteqc-api
pm2 monit
```

**Health Check:**
```bash
curl https://votre-api.com/health
```

**Backup PostgreSQL:**
```bash
# Backup automatique quotidien
0 2 * * * pg_dump -U postgres eduteqc > /backups/eduteqc_$(date +\%Y\%m\%d).sql
```

### Mobile

**Expo Analytics:**
- Installer `expo-analytics`
- Suivre les crashs avec Sentry

**Updates OTA (Over-The-Air):**
```bash
# Publier une mise à jour sans rebuild
expo publish
```

## Coûts Estimés

### Gratuit (Développement)
- Railway: Plan gratuit (500h/mois)
- Expo: Build et publish gratuits
- PostgreSQL: Railway inclus

### Production (Estimé/mois)
- **Railway Starter**: $5/mois
- **PostgreSQL**: $10/mois (Railway)
- **Domaine**: $12/an
- **Google Play Store**: $25 (une fois)
- **Apple App Store**: $99/an

**Total**: ~$20-30/mois

## Support et Documentation

- [Railway Docs](https://docs.railway.app/)
- [Expo EAS Docs](https://docs.expo.dev/eas/)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [React Native Deployment](https://reactnative.dev/docs/signed-apk-android)

## Troubleshooting

### Erreur de migration Prisma
```bash
# Reset la base de données
npx prisma migrate reset

# Regénérer et migrer
npx prisma generate
npx prisma migrate deploy
```

### Build mobile échoue
```bash
# Nettoyer le cache
expo start -c

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### API ne répond pas
```bash
# Vérifier les logs
pm2 logs

# Redémarrer
pm2 restart eduteqc-api

# Vérifier PostgreSQL
sudo systemctl status postgresql
```

---

**Besoin d'aide?** Consultez la documentation ou créez une issue sur GitHub.
