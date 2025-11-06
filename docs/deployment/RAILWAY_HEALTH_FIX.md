# 🚂 Guide de Correction du Health Check Railway

**Problème**: Railway ne peut pas accéder au health check endpoint  
**Solution**: Configuration optimisée avec endpoints multiples et logs améliorés

## ✅ Corrections Apportées

### 1. Nouveaux Endpoints de Santé

```typescript
// /ping - Simple, rapide, sans dépendance DB
app.get('/ping', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'eduteqc-backend'
  });
});

// /health - Complet avec vérification DB
app.get('/health', async (req, res) => {
  // Teste la connexion DB + infos détaillées
});
```

### 2. Configuration Railway Optimisée

```json
{
  "deploy": {
    "healthcheckPath": "/ping",
    "healthcheckTimeout": 120,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

**Pourquoi `/ping` ?**
- ✅ Pas de dépendance base de données
- ✅ Réponse instantanée
- ✅ Idéal pour Railway health check
- ✅ Évite les timeouts pendant la migration DB

### 3. Logs de Démarrage Améliorés

```typescript
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health endpoints: /ping (simple), /health (detailed)`);
  console.log(`💾 Database URL: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
  // ...
});
```

## 🔧 Variables d'Environnement Railway

Vérifiez que ces variables sont configurées :

```bash
PORT=3000                    # Railway le configure automatiquement
NODE_ENV=production
DATABASE_URL=postgresql://   # URL PostgreSQL Railway
CORS_ORIGIN=https://your-frontend-url.com
JWT_SECRET=your-secret-key
```

## 🚀 Déploiement Step-by-Step

### 1. Préparer le Code
```bash
git add .
git commit -m "Fix Railway health check with /ping endpoint"
git push origin main
```

### 2. Configurer Railway
1. **Service Settings** → **Health Check**
   - **Path**: `/ping`
   - **Timeout**: 120 seconds
   - **Interval**: 60 seconds

2. **Variables** → Ajouter
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = URL de votre frontend
   - `JWT_SECRET` = clé secrète sécurisée

3. **Database** → PostgreSQL
   - Railway configurera automatiquement `DATABASE_URL`

### 3. Vérifier le Déploiement
```bash
# Test local
.\scripts\powershell\test-health-simple.ps1

# Test production (remplacer URL)
.\scripts\powershell\test-health-simple.ps1 -BaseUrl "https://your-app.railway.app"
```

## 🐛 Diagnostics Courants

### Problème: Timeout sur Health Check
**Solution**: Utilisez `/ping` au lieu de `/health`

### Problème: Database Connection Error
**Cause**: Migration Prisma échoue  
**Solution**: Vérifiez `DATABASE_URL` et schéma Prisma

### Problème: CORS Errors
**Solution**: Configurez `CORS_ORIGIN` avec l'URL exacte du frontend

### Problème: Build Failures
**Cause**: Dépendances manquantes  
**Solution**: Vérifiez `package.json` et `nixpacks.toml`

## 📊 Monitoring Post-Déploiement

```bash
# Vérification des endpoints
curl https://your-app.railway.app/ping
curl https://your-app.railway.app/health

# Logs Railway
railway logs --follow

# Test API complète
curl https://your-app.railway.app/api/courses
```

## ✨ Points Clés du Succès

1. **Health Check Simple**: `/ping` sans dépendance DB
2. **Timeout Généreux**: 120s pour éviter les faux positifs
3. **Logs Détaillés**: Facilite le debugging
4. **Endpoints Multiples**: `/ping` (simple) + `/health` (complet)
5. **Configuration Progressive**: DB optionnelle pour health check

---

**Résultat Attendu**: Railway pourra accéder à `/ping` immédiatement au démarrage, même si la DB n'est pas encore prête.

🎯 **Status**: Prêt pour redéploiement Railway !