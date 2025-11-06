# 🚨 Railway Health Check - Guide de Résolution Ultime

## ⚠️ Problème Persistant
Malgré les corrections apportées, Railway signale toujours une erreur de health check.

## 🔧 Solutions Progressives

### Solution 1: Configuration Minimale
```json
// backend/railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "deploy": {
    "healthcheckPath": "/ping"
  }
}
```

### Solution 2: Désactiver Temporairement le Health Check
```json
// backend/railway.json  
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Solution 3: Health Check sur Root
```typescript
// backend/src/server.ts - Ajouter
app.get('/', (req, res) => {
  res.status(200).send('EduTeQC Backend is running');
});
```

## 🧪 Tests de Diagnostic

### Test 1: Endpoint Ultra-Simple
Nous avons créé `/ping` qui retourne juste `"OK"` (string, pas JSON).

### Test 2: Vérification Logs Railway
1. **Railway Dashboard** → **Deployments**
2. **Cliquer sur le dernier déploiement**
3. **Onglet "Deploy Logs"**
4. **Chercher les erreurs de démarrage**

### Test 3: Variables d'Environnement
Vérifier dans Railway > Variables :
```bash
NODE_ENV=production
PORT=3000  # Railway configure automatiquement
DATABASE_URL=postgresql://...  # Auto-configuré si PostgreSQL ajouté
```

## 🛠️ Actions Immédiates

### Étape 1: Simplifier Railway Config
```bash
# Renommer railway.json en railway.json.backup
mv backend/railway.json backend/railway.json.backup

# Copier la config simple
cp backend/railway-simple.json backend/railway.json
```

### Étape 2: Endpoint Root comme Fallback
Ajouter dans `server.ts` :
```typescript
app.get('/', (req, res) => {
  console.log('[ROOT] Root endpoint called');
  res.status(200).send('OK');
});
```

### Étape 3: Déployer et Tester
```bash
git add .
git commit -m "Simplify Railway health check config"
git push origin main
```

## 🔍 Diagnostic Avancé

Utiliser le script de diagnostic :
```bash
.\scripts\powershell\diagnose-railway.ps1 -RailwayUrl "https://ton-app.railway.app"
```

## 📋 Checklist de Dépannage

- [ ] **Logs de déploiement** : Pas d'erreurs de build ?
- [ ] **Variables d'environnement** : PORT, NODE_ENV configurés ?
- [ ] **Base de données** : PostgreSQL service ajouté ?
- [ ] **Health check path** : Bien configuré sur `/ping` ?
- [ ] **Timeout** : 60-120 secondes suffisant ?
- [ ] **Démarrage serveur** : Logs montrent "SERVER READY" ?

## 🚨 Solutions de Dernier Recours

### Option A: Pas de Health Check
```json
{
  "$schema": "https://railway.app/railway.schema.json"
}
```

### Option B: Health Check sur Root
Railway Dashboard > Settings > Deploy :
- **Health Check Path**: `/`
- **Timeout**: 120 seconds

### Option C: Port Différent
```typescript
const PORT = process.env.PORT || 8080;  // Essayer 8080
```

## 📊 Symptômes et Causes

| Symptôme | Cause Probable | Solution |
|----------|----------------|----------|
| Timeout 503 | Serveur ne démarre pas | Vérifier logs de build |
| Connection refused | Port incorrect | Vérifier variable PORT |
| 500 Error | Erreur dans endpoint | Simplifier `/ping` |
| Build failed | Dépendances manquantes | Vérifier package.json |

## 🎯 Plan d'Action Immédiat

1. **Simplifier** la configuration Railway
2. **Ajouter** endpoint root `/`
3. **Déployer** les changements
4. **Diagnostiquer** avec script dédié
5. **Vérifier** logs Railway en temps réel

---

**L'objectif** : Faire fonctionner Railway même avec une config minimale, puis optimiser progressivement.