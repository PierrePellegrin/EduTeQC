# Scripts

Ce dossier contient tous les scripts utilitaires du projet EduTeQC.

## Structure

### 📁 `database/`
Scripts de gestion de la base de données Prisma.

#### `setup/`
- `create-complete-education-system.ts` - Création du système éducatif complet (CP-Terminale)
- `link-courses-to-packages.ts` - Association des cours aux packages

#### `content/`
- `add-course-content.ts` - Ajout de contenu pédagogique principal
- `add-missing-content.ts` - Ajout de contenu manquant
- `complete-content.ts` - Finalisation du contenu pour tous les cours

#### `images/`
- `update-courses-images.ts` - Mise à jour des images de cours
- `update-packages-images.ts` - Mise à jour des images de packages
- `update-only-validated-images.ts` - Mise à jour des images validées uniquement

### 📁 `powershell/`
Scripts PowerShell pour l'automatisation Windows.

## Utilisation

### Scripts de base de données
```bash
# Depuis le dossier backend/
npx ts-node ../scripts/database/setup/create-complete-education-system.ts
npx ts-node ../scripts/database/content/add-course-content.ts
npx ts-node ../scripts/database/images/update-courses-images.ts
```

### Scripts PowerShell
```powershell
# Depuis la racine du projet
.\scripts\powershell\nom-du-script.ps1
```

## Notes importantes

- Tous les scripts de base de données utilisent Prisma et doivent être exécutés depuis le dossier `backend/`
- Les scripts PowerShell nécessitent une politique d'exécution appropriée
- Toujours faire une sauvegarde avant d'exécuter des scripts modifiant la base de données

## Développement

Pour ajouter un nouveau script :
1. Placer le fichier dans le bon sous-dossier selon sa fonction
2. Mettre à jour ce README
3. Tester le script sur un environnement de développement avant la production