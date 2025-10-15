# Configuration Android pour EduTeQC

## Prérequis

### 1. Installation d'Android Studio
- Téléchargez et installez [Android Studio](https://developer.android.com/studio)
- Lors de l'installation, assurez-vous d'inclure :
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (AVD)

### 2. Configuration des variables d'environnement
Ajoutez les chemins suivants à votre variable d'environnement PATH (Windows) :

```powershell
# Généralement situés dans :
C:\Users\VotreNom\AppData\Local\Android\Sdk\platform-tools
C:\Users\VotreNom\AppData\Local\Android\Sdk\tools
C:\Users\VotreNom\AppData\Local\Android\Sdk\emulator
```

Créez également la variable d'environnement :
```
ANDROID_HOME=C:\Users\VotreNom\AppData\Local\Android\Sdk
```

### 3. Création d'un émulateur Android (AVD)

1. Ouvrez Android Studio
2. Allez dans **Tools → Device Manager** (ou AVD Manager)
3. Cliquez sur **Create Device**
4. Choisissez un appareil (ex: Pixel 5)
5. Sélectionnez une image système (recommandé: **API 33** - Android 13)
6. Téléchargez l'image si nécessaire
7. Configurez les paramètres (RAM: 2048 MB minimum)
8. Cliquez sur **Finish**

## Démarrage de l'émulateur

### Option 1: Via Android Studio
1. Ouvrez Android Studio
2. Ouvrez Device Manager
3. Cliquez sur le bouton ▶️ à côté de votre AVD

### Option 2: Via ligne de commande
```powershell
# Lister les émulateurs disponibles
emulator -list-avds

# Démarrer un émulateur spécifique
emulator -avd Pixel_5_API_33
```

## Lancement de l'application

### 1. Démarrer le backend
```powershell
cd C:\Projet\EduTeQC
npm run dev
```

Le backend démarrera sur `http://localhost:3000`

### 2. Démarrer l'application mobile sur Android
```powershell
cd C:\Projet\EduTeQC\mobile
npm run android
```

Cette commande va :
1. Démarrer le serveur Expo
2. Détecter l'émulateur Android en cours d'exécution
3. Installer et lancer l'application sur l'émulateur

### 3. Alternative : Démarrer Expo puis choisir Android
```powershell
cd C:\Projet\EduTeQC\mobile
npm start
```
Puis appuyez sur `a` pour lancer sur Android.

## Configuration réseau

### Pour l'émulateur Android
L'application est configurée pour utiliser `http://10.0.2.2:3000` automatiquement sur Android.
- `10.0.2.2` est l'adresse spéciale de l'émulateur Android qui pointe vers `localhost` de votre machine.

### Pour un appareil physique Android
1. Connectez votre appareil et votre PC au même réseau WiFi
2. Trouvez l'adresse IP de votre PC :
```powershell
ipconfig
# Cherchez "Adresse IPv4" de votre connexion WiFi
```

3. Créez un fichier `.env` dans le dossier `mobile/` :
```
EXPO_PUBLIC_API_URL=http://192.168.X.X:3000
```
(Remplacez X.X par votre adresse IP locale)

4. Relancez l'application :
```powershell
npm start
```

## Débogage

### Ouvrir les DevTools
- Appuyez sur `Ctrl+M` dans l'émulateur (ou secouez l'appareil physique)
- Sélectionnez "Debug" pour ouvrir Chrome DevTools

### Recharger l'application
- Appuyez sur `R` dans le terminal Expo
- Ou double-tap `R` dans l'émulateur

### Logs en temps réel
```powershell
# Logs Android
adb logcat

# Filtrer les logs React Native
adb logcat *:S ReactNative:V ReactNativeJS:V
```

### Problèmes courants

#### L'émulateur ne démarre pas
```powershell
# Vérifiez que la virtualisation est activée dans le BIOS
# Ou essayez de démarrer avec plus de RAM
emulator -avd Pixel_5_API_33 -memory 4096
```

#### L'application ne se connecte pas au backend
1. Vérifiez que le backend est bien démarré sur le port 3000
2. Testez avec : `curl http://localhost:3000/api/health` (PowerShell)
3. Pour l'émulateur, le backend doit être accessible via `http://10.0.2.2:3000`

#### Expo ne détecte pas l'émulateur
```powershell
# Vérifiez que ADB détecte l'émulateur
adb devices

# Si aucun appareil, redémarrez ADB
adb kill-server
adb start-server
```

#### Crash Android 14: DETECT_SCREEN_CAPTURE / NativeUnimoduleProxy

Symptôme:

```
Error: Exception in HostObject::get for prop 'NativeUnimoduleProxy': java.lang.SecurityException: Permission Denial: registerScreenCaptureObserver ... requires android.permission.DETECT_SCREEN_CAPTURE
```

Cause: Android 14 (API 34) requiert la permission `DETECT_SCREEN_CAPTURE` pour l'observation des captures d'écran par certaines libs.

Correctifs appliqués dans ce projet:
- app.json → android.permissions inclut `DETECT_SCREEN_CAPTURE`
- Expo mis à jour (SDK 50.x)

Étapes recommandées si le crash persiste sur un AVD API 34:
1. Nettoyer le cache Metro et relancer Expo
  ```powershell
  cd C:\Projet\EduTeQC\mobile
  npx expo start -c
  ```
2. Fermer toutes les instances Metro (si besoin)
  ```powershell
  Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
  ```
3. Tester sur un émulateur Android 13 (API 33) le temps de la mise à jour d'Expo Go
4. Option avancée: créer une "development build" locale qui inclut le manifeste avec la permission
  ```powershell
  cd C:\Projet\EduTeQC\mobile
  npx expo prebuild
  npx expo run:android
  ```
  (Cela génère un dossier `android/` et construit une app dev autonome.)

#### Erreur: "Invariant Violation: 'main' has not been registered"

Cela arrive quand:
- Metro est lancé depuis le mauvais dossier (il faut `mobile/`)
- Une erreur JavaScript a empêché le chargement de `AppRegistry`

Résolution:
1. Assurez-vous d'être dans `C:\Projet\EduTeQC\mobile`
2. Redémarrez Metro avec cache nettoyé
  ```powershell
  npx expo start -c --android
  ```
3. Si l'erreur persiste, inspectez les logs Metro pour l'exception initiale (souvent liée à la permission Android ci-dessus).

## Build APK (optionnel)

Pour créer un fichier APK pour distribution :

```powershell
cd C:\Projet\EduTeQC\mobile

# Build de développement
npx expo build:android -t apk

# Ou avec EAS Build (recommandé)
npm install -g eas-cli
eas build -p android --profile preview
```

## Ressources

- [Documentation Expo - Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Documentation React Native - Android](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio)
