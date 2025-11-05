# Releases

Ce dossier contient les builds de production et les releases de l'application.

## Fichiers de Release

- **EduTeQC-Production.apk** - APK de production Android

## Structure Recommandée

```
releases/
├── android/
│   ├── v1.0.0/
│   │   ├── EduTeQC-v1.0.0-production.apk
│   │   └── EduTeQC-v1.0.0-debug.apk
│   └── v1.1.0/
│       └── EduTeQC-v1.1.0-production.apk
├── ios/
│   └── v1.0.0/
│       └── EduTeQC-v1.0.0.ipa
└── CHANGELOG.md
```

## Bonnes Pratiques

1. **Versioning** : Utiliser la version du package.json
2. **Nommage** : `EduTeQC-v{version}-{type}.{ext}`
3. **Documentation** : Maintenir un CHANGELOG.md
4. **Signature** : Signer tous les APK/IPA de production
5. **Tests** : Tester chaque release avant distribution

## Génération d'une Release

```bash
# Android
eas build --platform android --profile production

# iOS  
eas build --platform ios --profile production

# Les deux
eas build --platform all --profile production
```

## Distribution

- Google Play Store (Android)
- Apple App Store (iOS)
- Distribution directe (APK pour tests)

## Notes

- Ne pas commiter les fichiers de release dans Git (trop volumineux)
- Utiliser GitHub Releases pour la distribution
- Garder les releases importantes pour rollback si nécessaire