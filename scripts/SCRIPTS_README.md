# 🛠️ Scripts de Gestion de l'Environnement de Développement

Ce dossier contient des scripts PowerShell pratiques pour gérer facilement votre environnement de développement EduTeQCV2.

## 📜 Scripts Disponibles

### 1. `kill-all-dev.ps1` - Nettoyage Complet Détaillé
**Usage:** `.\kill-all-dev.ps1`

Script complet qui nettoie votre environnement avec des rapports détaillés :
- ✅ Tue tous les processus Node.js (backend, Expo, Metro)
- ✅ Tue tous les processus Java (Gradle, émulateur Android)
- ✅ Ferme l'émulateur Android (QEMU)
- ✅ Arrête ADB (Android Debug Bridge)
- ✅ Libère tous les ports utilisés (3000, 8081, 8082, 8083, 5432)
- ✅ Affiche un rapport détaillé des actions effectuées
- ✅ Vérifie que le nettoyage s'est bien déroulé

### 2. `kill-all-quick.ps1` - Nettoyage Rapide
**Usage:** `.\kill-all-quick.ps1`

Version rapide et silencieuse pour un nettoyage express :
- ⚡ Tue tous les processus de développement d'un coup
- ⚡ Libère les ports rapidement
- ⚡ Pas de rapport détaillé (mode silencieux)
- ⚡ Idéal quand vous êtes pressé

### 3. `restart-dev.ps1` - Redémarrage Complet
**Usage:** `.\restart-dev.ps1 [options]`

Script intelligent qui nettoie ET redémarre vos services :

**Options disponibles :**
```powershell
.\restart-dev.ps1                    # Redémarre backend + mobile
.\restart-dev.ps1 -BackendOnly       # Redémarre uniquement le backend
.\restart-dev.ps1 -MobileOnly        # Redémarre uniquement l'app mobile
.\restart-dev.ps1 -NoStart           # Nettoie seulement (pas de redémarrage)
```

**Fonctionnalités :**
- 🧹 Nettoie complètement l'environnement
- 🚀 Ouvre automatiquement de nouveaux terminaux
- ⏳ Attend que le backend démarre avant le mobile
- 📋 Affiche les URLs et comptes de test

## 🚀 Utilisation Rapide

### Cas d'usage courants :

**Problème de port occupé ?**
```powershell
.\kill-all-quick.ps1
```

**Redémarrage complet après modifications ?**
```powershell
.\restart-dev.ps1
```

**Besoin de diagnostics détaillés ?**
```powershell
.\kill-all-dev.ps1
```

**Redémarrer seulement le backend ?**
```powershell
.\restart-dev.ps1 -BackendOnly
```

## ⚙️ Configuration Automatique

Ces scripts gèrent automatiquement :
- **Ports :** 3000 (backend), 8081-8083 (Expo), 5432 (PostgreSQL)
- **Processus :** Node.js, Java, QEMU, ADB, Expo, Metro
- **Services :** Backend Express, Expo Metro Bundler, Émulateur Android

## 🔧 Prérequis

- **PowerShell 5.1+** (inclus dans Windows 10/11)
- **Droits d'administration** (pour tuer les processus)
- **NPM/Node.js** installé
- **Android SDK** (si vous utilisez Android)

## 🚨 Résolution de Problèmes

**"Impossible d'exécuter des scripts" ?**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Processus persistants ?**
- Essayez le script complet : `.\kill-all-dev.ps1`
- Redémarrez votre terminal en tant qu'administrateur

**Ports toujours occupés ?**
- Le script utilise plusieurs méthodes de libération des ports
- En dernier recours, redémarrez votre ordinateur

## 📝 Logs et Debugging

- Le script `kill-all-dev.ps1` affiche des rapports détaillés
- Les erreurs sont affichées en rouge avec des explications
- Les succès sont affichés en vert
- Les avertissements en jaune

## 🎯 Exemples d'Utilisation

**Développement quotidien :**
```powershell
# Matin : démarrage propre
.\restart-dev.ps1

# Après modifications : redémarrage rapide
.\kill-all-quick.ps1
cd backend; npm run dev

# Fin de journée : nettoyage complet
.\kill-all-dev.ps1
```

**Debugging de problèmes :**
```powershell
# Diagnostic complet
.\kill-all-dev.ps1

# Redémarrage étape par étape
.\restart-dev.ps1 -BackendOnly
# Tester le backend...
.\restart-dev.ps1 -MobileOnly
```

---

## 🤝 Maintenance

Ces scripts sont conçus pour être maintenus facilement :
- **Ajout de nouveaux ports :** Modifiez la variable `$ports` dans les scripts
- **Nouveaux processus :** Ajoutez-les dans la variable `$processes`
- **Personnalisation :** Copiez et modifiez selon vos besoins

**Version :** 1.0  
**Compatibilité :** Windows 10/11, PowerShell 5.1+  
**Dernière mise à jour :** Novembre 2025