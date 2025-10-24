# Créer la Release GitHub v1.0.0

Ce document contient une commande `curl` prête à exécuter pour créer une Release GitHub à partir du tag `v1.0.0`.

Important : vous devez disposer d'un token GitHub personnel avec le scope `repo` (ou `public_repo` si le dépôt est public). Ne partagez pas ce token.

1) Exporter votre token dans une variable d'environnement (PowerShell) :

```powershell
$env:GITHUB_TOKEN = "ghp_...votre_token_ici..."
```

2) Exécuter la commande suivante (placez-vous à la racine du projet si besoin) :

```powershell
$body = Get-Content docs/RELEASE_NOTES_v1.0.0.md -Raw
$payload = @{
  tag_name = "v1.0.0";
  name = "v1.0.0 - Sections hiérarchiques + Progression";
  body = $body;
  draft = $false;
  prerelease = $false
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://api.github.com/repos/PierrePellegrin/EduTeQC/releases" -Method Post -Headers @{ Authorization = "token $env:GITHUB_TOKEN"; "User-Agent" = "EduTeQC-release-script" } -Body $payload -ContentType "application/json"
```

3) Si vous préférez `curl` (PowerShell) :

```powershell
$body = Get-Content docs/RELEASE_NOTES_v1.0.0.md -Raw | Out-String
$payload = @{ tag_name = 'v1.0.0'; name = 'v1.0.0 - Sections hiérarchiques + Progression'; body = $body; draft = $false; prerelease = $false } | ConvertTo-Json -Depth 10
curl -X POST -H "Authorization: token $env:GITHUB_TOKEN" -H "User-Agent: EduTeQC-release-script" -H "Content-Type: application/json" -d $payload "https://api.github.com/repos/PierrePellegrin/EduTeQC/releases"
```

4) Après exécution, vérifiez la page Releases sur GitHub :

https://github.com/PierrePellegrin/EduTeQC/releases

---

Si vous voulez, je peux formater le contenu (titre + notes) différemment, ou ajouter des assets binaires (apk/ipa) à la release — dites-moi lesquels et je génèrerai les commandes pour uploader les fichiers via l'API.
