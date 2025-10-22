# Guide de test - Filtres PackagesShopScreen

## Prérequis

1. Base de données avec des données de test incluant :
   - Plusieurs cycles (Primaire, Collège, Lycée)
   - Plusieurs niveaux par cycle
   - Des cours avec différentes catégories
   - Des packages contenant ces cours

2. Au moins un utilisateur CLIENT créé

## Démarrage

### Backend
```bash
cd backend
npm run dev
```

### Mobile
```bash
cd mobile
npm start
# Puis choisir 'a' pour Android ou 'i' pour iOS
```

## Scénarios de test

### Test 1 : État initial ✓
**Objectif** : Vérifier que le menu est fermé par défaut

1. Se connecter en tant que CLIENT
2. Naviguer vers "Acheter des forfaits" (icône panier dans les tabs)
3. **Résultat attendu** :
   - La barre de recherche est visible
   - Le bouton filtre (🔽) est visible à droite
   - Les filtres ne sont PAS visibles
   - La liste des packages disponibles s'affiche

### Test 2 : Ouverture/Fermeture du menu ✓
**Objectif** : Vérifier que le menu s'ouvre et se ferme correctement

1. Cliquer sur le bouton filtre
2. **Résultat attendu** :
   - Le menu se déploie
   - Les 3 sections apparaissent : Cycle, Matière, Année (si applicable)
   - L'icône change (filter-off)
3. Cliquer à nouveau sur le bouton filtre
4. **Résultat attendu** :
   - Le menu se referme
   - L'icône revient à l'état initial

### Test 3 : Filtre par Cycle ✓
**Objectif** : Vérifier le filtrage par cycle

1. Ouvrir le menu filtres
2. Cliquer sur "Primaire"
3. **Résultat attendu** :
   - Le chip "Primaire" est sélectionné (fond coloré)
   - La section "Année" apparaît avec CP, CE1, CE2, CM1, CM2
   - Seuls les packages contenant des cours de Primaire s'affichent
   - L'icône filtre devient bleue (active)
4. Cliquer à nouveau sur "Primaire"
5. **Résultat attendu** :
   - Le filtre se désélectionne
   - La section "Année" disparaît
   - Tous les packages réapparaissent

### Test 4 : Filtre par Matière ✓
**Objectif** : Vérifier le filtrage par catégorie

1. Ouvrir le menu filtres
2. Cliquer sur "Mathématiques" (ou une autre matière disponible)
3. **Résultat attendu** :
   - Le chip "Mathématiques" est sélectionné
   - Seuls les packages contenant des cours de maths s'affichent
   - L'icône filtre devient bleue

### Test 5 : Filtre par Année ✓
**Objectif** : Vérifier le filtrage par niveau

1. Ouvrir le menu filtres
2. Sélectionner "Primaire" (pour faire apparaître les années)
3. Cliquer sur "CE2"
4. **Résultat attendu** :
   - Les chips "Primaire" et "CE2" sont sélectionnés
   - Seuls les packages contenant des cours de CE2 s'affichent

### Test 6 : Filtres combinés ✓
**Objectif** : Vérifier que plusieurs filtres fonctionnent ensemble

1. Ouvrir le menu filtres
2. Sélectionner "Collège"
3. Sélectionner "Mathématiques"
4. Sélectionner "6ème"
5. **Résultat attendu** :
   - Seuls les packages contenant des cours de maths de 6ème s'affichent
   - Les 3 filtres sont visuellement actifs

### Test 7 : Recherche + Filtres ✓
**Objectif** : Vérifier que la recherche fonctionne avec les filtres

1. Taper "forfait" dans la barre de recherche
2. Ouvrir les filtres
3. Sélectionner "Primaire"
4. **Résultat attendu** :
   - Les packages affichés contiennent "forfait" dans leur nom/description
   - ET contiennent des cours de Primaire
   - La recherche et les filtres se combinent

### Test 8 : Changement de Cycle ✓
**Objectif** : Vérifier le comportement lors du changement de cycle

1. Ouvrir les filtres
2. Sélectionner "Primaire"
3. Sélectionner "CE1"
4. Cliquer sur "Collège"
5. **Résultat attendu** :
   - "Primaire" se désélectionne
   - "Collège" se sélectionne
   - "CE1" reste actif (mais n'affecte plus le filtrage car il appartient à Primaire)
   - La liste "Année" change pour afficher 6ème, 5ème, 4ème, 3ème

### Test 9 : Bouton "Effacer les filtres" ✓
**Objectif** : Vérifier la réinitialisation des filtres

1. Ouvrir les filtres
2. Sélectionner plusieurs filtres (ex: Collège + Mathématiques + 5ème)
3. Vérifier que le bouton "Effacer les filtres" apparaît (en bas)
4. Cliquer sur ce bouton
5. **Résultat attendu** :
   - Tous les filtres sont désélectionnés
   - La barre de recherche est vidée
   - Tous les packages réapparaissent
   - Le bouton "Effacer les filtres" disparaît

### Test 10 : Mini-croix de réinitialisation ✓
**Objectif** : Vérifier les croix à côté des titres

1. Ouvrir les filtres
2. Sélectionner "Mathématiques"
3. Cliquer sur la petite croix à côté de "Matière"
4. **Résultat attendu** :
   - Le filtre "Mathématiques" se désélectionne
   - Les packages réapparaissent

### Test 11 : Aucun résultat ✓
**Objectif** : Vérifier l'affichage quand aucun package ne correspond

1. Ouvrir les filtres
2. Sélectionner une combinaison de filtres qui ne donne aucun résultat
3. **Résultat attendu** :
   - Le message "Aucun forfait disponible." s'affiche
   - Les filtres restent actifs
   - Possibilité de modifier les filtres pour trouver des résultats

### Test 12 : Indicateur visuel ✓
**Objectif** : Vérifier que l'icône filtre change de couleur

1. Menu fermé, aucun filtre actif
   - **Résultat** : Icône filtre en gris/couleur normale
2. Ouvrir le menu et sélectionner un filtre
3. Refermer le menu
   - **Résultat** : Icône filtre en bleu (couleur primaire)
4. Rouvrir et effacer les filtres
5. Refermer le menu
   - **Résultat** : Icône redevient grise

### Test 13 : SegmentedButtons (groupement) ✓
**Objectif** : Vérifier que les filtres fonctionnent avec le groupement

1. Appliquer un filtre (ex: "Primaire")
2. Basculer entre "Tous" et "Type" dans les SegmentedButtons
3. **Résultat attendu** :
   - Le filtrage reste actif
   - L'affichage change (liste simple vs accordéons)
   - Les packages affichés respectent toujours les filtres

### Test 14 : Performance avec beaucoup de packages ✓
**Objectif** : Vérifier que les performances restent bonnes

1. Créer 50+ packages en base de données
2. Ouvrir l'écran PackagesShop
3. Appliquer et retirer rapidement plusieurs filtres
4. **Résultat attendu** :
   - Pas de lag notable
   - Les transitions sont fluides
   - La liste se met à jour rapidement

### Test 15 : Compatibilité responsive ✓
**Objectif** : Vérifier l'affichage sur différentes tailles d'écran

1. Tester sur petit écran (iPhone SE)
2. Tester sur grand écran (tablette)
3. **Résultat attendu** :
   - Les chips s'adaptent (wrap sur plusieurs lignes si nécessaire)
   - Tout reste accessible et lisible
   - Pas de débordement horizontal

## Checklist rapide

- [ ] Menu fermé par défaut
- [ ] Ouverture/fermeture du menu
- [ ] Filtre Cycle fonctionne
- [ ] Filtre Matière fonctionne
- [ ] Filtre Année fonctionne (et apparaît seulement si cycle sélectionné)
- [ ] Filtres combinés fonctionnent ensemble
- [ ] Recherche + filtres fonctionnent ensemble
- [ ] Changement de cycle met à jour les années
- [ ] Bouton "Effacer les filtres" fonctionne
- [ ] Mini-croix de réinitialisation fonctionnent
- [ ] Message "Aucun forfait disponible" s'affiche correctement
- [ ] Indicateur visuel (couleur icône) fonctionne
- [ ] Compatible avec SegmentedButtons
- [ ] Performances acceptables
- [ ] Responsive sur différents écrans

## Problèmes connus

### Erreur TypeScript dans FilterMenu.tsx
```
Cannot find module './styles' or its corresponding type declarations.
```
**Solution** : 
- Le fichier existe et fonctionne
- C'est un problème de cache TypeScript
- Redémarrer le serveur TypeScript ou Metro Bundler résout le problème
- N'affecte pas le fonctionnement de l'application

## Logs de débogage

Pour déboguer, ajouter des console.log :

```typescript
// Dans PackagesShopScreen/index.tsx
console.log('Filters:', filters);
console.log('Filtered packages:', filteredPackages.length);
console.log('Categories:', categories);
```

## APIs utilisées

Vérifier que ces endpoints répondent correctement :
```bash
# Récupérer les cycles
curl http://localhost:3000/api/cycles

# Récupérer les niveaux
curl http://localhost:3000/api/niveaux

# Récupérer les packages
curl http://localhost:3000/api/admin/packages \
  -H "Authorization: Bearer <token>"
```
