# Guide de Test - Sections de Cours Hiérarchiques

## État du Système

✅ **Backend**: Serveur démarré sur `http://localhost:3000`  
✅ **Mobile**: Expo prêt à être lancé  
✅ **Base de données**: Sections de test créées pour le cours "Mathématiques - Niveau Débutant"

## Structure des Sections de Test

```
📚 Mathématiques - Niveau Débutant
├── 📄 Introduction
├── 📂 Chapitre 1 - Les bases
│   ├── 📄 1.1 - Premier concept
│   └── 📂 1.2 - Deuxième concept
│       └── 📄 1.2.1 - Détail important
├── 📄 Chapitre 2 - Approfondissement
└── 📄 Conclusion
```

## Scénarios de Test

### 1. Navigation dans les Sections ✅

**Objectif**: Vérifier que la navigation hiérarchique fonctionne

**Étapes**:
1. Ouvrir l'application mobile
2. Naviguer vers l'onglet "Cours"
3. Cliquer sur le cours "Mathématiques - Niveau Débutant"
4. Cliquer sur "Voir les sections"
5. Vérifier que les 4 sections racines s'affichent :
   - Introduction
   - Chapitre 1 - Les bases
   - Chapitre 2 - Approfondissement
   - Conclusion

**Résultat attendu**: Liste des sections affichée avec arborescence

---

### 2. Expansion des Sections ✅

**Objectif**: Vérifier que les sous-sections s'affichent

**Étapes**:
1. Depuis la liste des sections
2. Appuyer sur "Chapitre 1 - Les bases"
3. Vérifier que 2 sous-sections apparaissent :
   - 1.1 - Premier concept
   - 1.2 - Deuxième concept
4. Appuyer sur "1.2 - Deuxième concept"
5. Vérifier qu'une sous-sous-section apparaît :
   - 1.2.1 - Détail important

**Résultat attendu**: Arborescence extensible avec 3 niveaux de profondeur

---

### 3. Affichage du Contenu Markdown ✅

**Objectif**: Vérifier que le contenu Markdown est correctement rendu

**Étapes**:
1. Depuis la liste des sections
2. Cliquer sur "Introduction"
3. Vérifier l'affichage :
   - Titre H1 "Bienvenue dans ce cours !"
   - Titre H2 "Objectifs du cours"
   - Liste à puces
   - Citation en gras

**Résultat attendu**: Contenu formaté avec styles Markdown

---

### 4. Navigation Entre Sections ✅

**Objectif**: Vérifier les boutons Précédent/Suivant

**Étapes**:
1. Ouvrir la section "Introduction"
2. Vérifier que le bouton "Précédent" est désactivé (première section)
3. Cliquer sur "Suivant"
4. Vérifier l'arrivée sur "Chapitre 1 - Les bases"
5. Cliquer encore sur "Suivant"
6. Vérifier l'arrivée sur "1.1 - Premier concept" (première sous-section)
7. Continuer à naviguer avec "Suivant" jusqu'à "Conclusion"
8. Vérifier que le bouton "Suivant" est désactivé (dernière section)

**Résultat attendu**: Navigation fluide dans l'ordre hiérarchique

---

### 5. Fil d'Ariane (Breadcrumb) ✅

**Objectif**: Vérifier l'affichage du chemin de navigation

**Étapes**:
1. Naviguer vers "1.2.1 - Détail important"
2. Vérifier le fil d'ariane en haut de l'écran :
   - "Chapitre 1 - Les bases > 1.2 - Deuxième concept > 1.2.1 - Détail important"

**Résultat attendu**: Chemin complet affiché avec séparateurs

---

### 6. Barre de Progression ✅

**Objectif**: Vérifier le calcul automatique de la progression

**Étapes**:
1. Depuis la liste des sections
2. Vérifier qu'une barre de progression s'affiche en haut
3. Noter le pourcentage (devrait être 0% au départ)
4. Ouvrir plusieurs sections en navigation
5. Retourner à la liste des sections
6. Vérifier que la progression a augmenté

**Résultat attendu**: Progression calculée automatiquement en fonction des sections visitées

---

### 7. Marquage Automatique comme Visitée ✅

**Objectif**: Vérifier que les sections sont marquées automatiquement

**Étapes**:
1. Ouvrir une nouvelle section
2. Attendre 1 seconde
3. Vérifier dans les logs backend qu'une requête POST `/api/progress/section/visited` a été envoyée
4. Retourner à la liste
5. Vérifier visuellement si la section est marquée différemment (icône, couleur, etc.)

**Résultat attendu**: Section marquée comme visitée automatiquement

---

### 8. Tests Associés aux Sections ✅

**Objectif**: Vérifier l'affichage des tests liés à une section

**Étapes**:
1. Si une section a des tests associés
2. Vérifier que les cartes de tests s'affichent sous le contenu
3. Cliquer sur un test
4. Vérifier la navigation vers l'écran de test

**Résultat attendu**: Tests affichés et accessibles depuis la section

---

## Tests API (Backend)

### Endpoints à Tester avec Postman ou curl

#### 1. Récupérer les sections d'un cours
```bash
GET http://localhost:3000/api/sections/course/1
```

#### 2. Récupérer une section spécifique
```bash
GET http://localhost:3000/api/sections/1
```

#### 3. Navigation suivante
```bash
GET http://localhost:3000/api/sections/1/next
```

#### 4. Navigation précédente
```bash
GET http://localhost:3000/api/sections/2/previous
```

#### 5. Fil d'ariane
```bash
GET http://localhost:3000/api/sections/5/breadcrumb
```

#### 6. Progression du cours (nécessite authentification)
```bash
GET http://localhost:3000/api/progress/course/1
Authorization: Bearer <token>
```

#### 7. Marquer une section comme visitée (nécessite authentification)
```bash
POST http://localhost:3000/api/progress/section/visited
Authorization: Bearer <token>
Content-Type: application/json

{
  "sectionId": 1
}
```

---

## Checklist de Validation

- [ ] Les sections s'affichent correctement dans l'arborescence
- [ ] L'expansion/réduction des sections fonctionne
- [ ] Le contenu Markdown est bien formaté
- [ ] La navigation Précédent/Suivant fonctionne
- [ ] Le fil d'ariane affiche le bon chemin
- [ ] La barre de progression se met à jour
- [ ] Les sections sont marquées comme visitées automatiquement
- [ ] Les tests associés sont accessibles
- [ ] Pas d'erreurs dans la console backend
- [ ] Pas d'erreurs dans la console mobile

---

## Problèmes Connus et Solutions

### Avertissement async-storage
**Problème**: Version 2.2.0 installée au lieu de 1.21.0  
**Impact**: Faible, l'application devrait fonctionner  
**Solution**: Optionnel - downgrade avec `npm install @react-native-async-storage/async-storage@1.21.0`

### Cache Prisma
**Problème**: Types TypeScript non reconnus après migration  
**Solution**: Déjà résolu - client Prisma régénéré

---

## Commandes Utiles

### Redémarrer le backend
```bash
cd c:\Projet\EduTeQC\backend
npm run dev
```

### Redémarrer le mobile
```bash
cd c:\Projet\EduTeQC\mobile
npm start
```

### Créer plus de sections de test
```bash
cd c:\Projet\EduTeQC\backend
npx ts-node prisma/create-test-sections.ts
```

### Vérifier la base de données
```bash
cd c:\Projet\EduTeQC\backend
npx prisma studio
```

---

## Prochaines Étapes Suggérées

1. **Administration**: Créer l'interface d'édition des sections dans l'admin web
2. **Réorganisation**: Ajouter le drag & drop pour réordonner les sections
3. **Recherche**: Implémenter la recherche dans les sections d'un cours
4. **Export**: Permettre l'export du cours complet en PDF
5. **Offline**: Synchroniser les sections pour consultation hors ligne
