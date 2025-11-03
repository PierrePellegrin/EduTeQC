# ✅ Guide de Test du Déploiement

## 🎯 Tests à Effectuer

### 1. Test de l'API Backend

Une fois votre backend déployé sur Railway/Render, testez ces endpoints :

```powershell
# Remplacez YOUR_API_URL par votre URL de production
$API_URL = "https://your-app-name.railway.app"

# Test de santé
curl "$API_URL/health"
# Résultat attendu: {"status":"OK","timestamp":"..."}

# Test de login admin
curl -X POST "$API_URL/api/auth/login" `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@eduteqc.com","password":"admin123"}'
# Résultat attendu: {"token":"...", "user":{"id":"...", "role":"ADMIN"}}

# Test de récupération des cours
curl "$API_URL/api/courses"
# Résultat attendu: Liste des cours
```

### 2. Test de l'Application Mobile

#### A. Configuration pour Tests
1. **Éditez** `mobile/src/config/api.config.ts`
2. **Remplacez** `https://your-app-name.railway.app/api` par votre vraie URL
3. **Générez un APK** avec `.\build-production.ps1`

#### B. Tests Fonctionnels
1. **Connexion Admin**
   - Email: `admin@eduteqc.com`
   - Password: `admin123`
   - ✅ Devrait afficher le dashboard admin

2. **Connexion Client**
   - Email: `client@eduteqc.com`
   - Password: `client123`
   - ✅ Devrait afficher la liste des cours

3. **Navigation**
   - ✅ Parcourir les cours
   - ✅ Ouvrir un cours
   - ✅ Faire un test
   - ✅ Voir les résultats

### 3. Vérifications Techniques

#### A. Logs Backend (Railway/Render)
Vérifiez dans les logs que :
- ✅ Server running on port XXX
- ✅ Pas d'erreurs de connexion BDD
- ✅ Les requêtes API sont bien reçues

#### B. Métriques de Performance
- ✅ Temps de réponse API < 1 seconde
- ✅ Taille APK < 100MB
- ✅ App se lance < 3 secondes

## 🐛 Résolution de Problèmes Courants

### Erreur "Network Error" dans l'app
- ❌ **Problème:** L'app ne peut pas contacter l'API
- ✅ **Solution:** Vérifiez l'URL dans `api.config.ts`
- ✅ **Solution:** Testez l'URL directement dans un navigateur

### Erreur "Invalid credentials"
- ❌ **Problème:** Les comptes de test n'existent pas
- ✅ **Solution:** Exécutez le seed sur votre BDD de production :
  ```powershell
  # Dans votre backend local, avec la DATABASE_URL de production
  npm run prisma:seed
  ```

### API lente (> 5 secondes)
- ❌ **Problème:** BDD ou backend en veille (services gratuits)
- ✅ **Solution:** Première requête toujours lente, les suivantes seront rapides
- ✅ **Solution:** Considérez un plan payant pour de meilleures performances

### Build APK échoue
- ❌ **Problème:** Erreurs de compilation Android
- ✅ **Solution:** Nettoyez avec `npx expo prebuild --clear`
- ✅ **Solution:** Vérifiez que Java 17+ est installé

## 📊 Checklist Finale

### Backend Déployé ✅
- [ ] Compte Neon créé et BDD configurée
- [ ] Compte Railway/Render créé
- [ ] Variables d'environnement configurées
- [ ] API accessible via HTTPS
- [ ] Health check fonctionne
- [ ] Données de test chargées (seed)

### App Mobile Configurée ✅
- [ ] URL de production dans `api.config.ts`
- [ ] APK de production généré
- [ ] APK installé sur appareil de test
- [ ] Login admin fonctionne
- [ ] Login client fonctionne
- [ ] Navigation fluide

### Tests Utilisateur ✅
- [ ] Inscription nouveau compte
- [ ] Parcours complet cours → test → résultat
- [ ] Interface admin complète
- [ ] Performance acceptable

## 🎉 Bravo !

Si tous ces tests passent, votre application EduTeQC est **prête pour la production** ! 

Vous avez maintenant :
- 🗄️ **Base de données PostgreSQL** hébergée et sécurisée
- 🌐 **API Node.js** déployée avec HTTPS
- 📱 **Application mobile** fonctionnelle avec APK distributable
- 🔐 **Authentification** et autorisation complètes
- 📊 **Interface admin** pour gérer le contenu

**Prochaines étapes suggérées :**
1. 📱 **Distribuer l'APK** à vos testeurs
2. 📈 **Monitorer** les performances et logs
3. 🔄 **Mettre en place CI/CD** pour les futures mises à jour
4. 🎨 **Personnaliser** le design selon vos besoins
5. 📊 **Analyser** l'usage et ajouter des fonctionnalités