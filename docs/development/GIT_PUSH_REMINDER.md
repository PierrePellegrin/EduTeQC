# 📝 RAPPEL IMPORTANT - Git Workflow

## ⚠️ TOUJOURS PUSHER APRÈS COMMIT !

### ❌ Erreur Commune
```bash
git add .
git commit -m "message"
# ❌ OUBLI du push = Railway ne déploie pas !
```

### ✅ Workflow Correct
```bash
git add .
git commit -m "message"  
git push origin main     # ← ESSENTIEL pour Railway !
```

## 🛠️ Scripts Automatisés

### Option 1: Script Tout-en-Un
```bash
# Commit + Push automatique
.\scripts\powershell\git-commit-push.ps1 -Message "Fix backend issues"

# Avec confirmation
.\scripts\powershell\git-commit-push.ps1 -Message "Add new feature" -Force

# Test sans exécuter
.\scripts\powershell\git-commit-push.ps1 -Message "Test" -DryRun
```

### Option 2: Commande Combinée
```bash
git add . && git commit -m "message" && git push origin main
```

## 🚂 Impact sur Railway

### Sans Push
- ❌ Commits restent en local
- ❌ Railway ne voit aucun changement  
- ❌ Pas de build automatique
- ❌ Déploiement manuel requis

### Avec Push  
- ✅ GitHub reçoit les commits
- ✅ Railway détecte automatiquement
- ✅ Build lancé immédiatement
- ✅ Déploiement automatique

## 📋 Checklist Quotidienne

- [ ] Développement terminé
- [ ] Tests locaux passent
- [ ] `git add .`
- [ ] `git commit -m "message"`  
- [ ] **`git push origin main`** ← CRITIQUE !
- [ ] Vérifier Railway auto-deploy
- [ ] Tester les endpoints déployés

## 🎯 Résumé

**Règle d'Or**: Chaque commit = push immédiat pour Railway !

---
*Note: Ce rappel existe pour éviter l'oubli du push qui casse l'auto-deploy.*