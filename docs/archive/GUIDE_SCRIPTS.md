# 🛠️ Guide des Scripts de Nettoyage - EduTeQCV2

## 🚀 Commandes NPM Simplifiées

Vous disposez maintenant de commandes NPM faciles pour gérer votre environnement :

### 🧹 **Nettoyage**
```bash
npm run kill:all          # Nettoyage complet avec rapports détaillés
npm run kill:quick         # Nettoyage rapide et silencieux  
npm run clean              # Nettoyage uniquement (pas de redémarrage)
```

### 🔄 **Redémarrage**
```bash
npm run restart            # Nettoie + redémarre backend et mobile
npm run restart:backend    # Nettoie + redémarre uniquement le backend
npm run restart:mobile     # Nettoie + redémarre uniquement l'app mobile
```

### 📱 **Développement Standard**
```bash
npm run dev                # Lance backend + mobile ensemble
npm run dev:backend        # Lance uniquement le backend
npm run dev:mobile         # Lance uniquement l'app mobile
npm run android            # Lance l'app sur Android
```

## 📜 Scripts PowerShell Directs

Si vous préférez utiliser directement PowerShell :

### 🧹 **Scripts de Nettoyage**
```powershell
.\kill-all-clean.ps1       # Nettoyage complet avec rapports (RECOMMANDÉ)
.\kill-all-quick.ps1       # Nettoyage rapide
.\kill-all-dev.ps1         # Version détaillée (peut avoir des problèmes d'encodage)
```

### 🔄 **Script de Redémarrage**
```powershell
.\restart-dev.ps1                    # Redémarre tout
.\restart-dev.ps1 -BackendOnly       # Backend uniquement
.\restart-dev.ps1 -MobileOnly        # Mobile uniquement
.\restart-dev.ps1 -NoStart           # Nettoyage seulement
```

## 🎯 Cas d'Usage Typiques

### **Problème de port occupé**
```bash
npm run kill:quick
```

### **Redémarrage après modifications**
```bash
npm run restart
```

### **Debugging avec rapports détaillés**
```bash
npm run kill:all
```

### **Fin de session de développement**
```bash
npm run clean
```

### **Démarrage propre le matin**
```bash
npm run restart
```

## ⚙️ Ce que font les scripts

### **Processus tués :**
- ✅ Node.js (backend, Expo, Metro bundler)
- ✅ Java (Gradle, émulateur Android)
- ✅ QEMU (émulateur Android)
- ✅ ADB (Android Debug Bridge)
- ✅ Expo/Metro (processus restants)

### **Ports libérés :**
- ✅ 3000 (backend API)
- ✅ 8081-8083 (Expo)
- ✅ 5432 (PostgreSQL)

### **Vérifications :**
- ✅ Processus complètement fermés
- ✅ Ports libérés
- ✅ Rapport d'état final

## 🚨 En cas de problème

**Si un script ne fonctionne pas :**
1. Ouvrez PowerShell en tant qu'administrateur
2. Exécutez : `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Relancez le script

**Si des processus persistent :**
1. Utilisez `npm run kill:all` pour un rapport détaillé
2. En dernier recours, redémarrez votre ordinateur

## 📋 Commandes de Vérification

**Vérifier les ports occupés :**
```powershell
netstat -ano | findstr ":3000"    # Backend
netstat -ano | findstr ":8081"    # Expo
```

**Vérifier les processus actifs :**
```powershell
Get-Process -Name "node"          # Node.js
Get-Process -Name "java"          # Java/Android
```

## 🎉 Scripts Prêts !

Vous avez maintenant un ensemble complet d'outils pour gérer facilement votre environnement de développement EduTeQCV2. Utilisez `npm run kill:all` en cas de doute !

---
*Scripts créés pour EduTeQCV2 - Novembre 2025*