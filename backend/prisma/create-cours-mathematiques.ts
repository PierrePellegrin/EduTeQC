#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Contenu détaillé des cours de mathématiques par niveau
const coursMathematiques = {
  "CP": {
    title: "Mathématiques CP - Nombres et calculs",
    description: "Découverte des nombres de 0 à 100, premières additions et soustractions pour les 6-7 ans",
    sections: [
      {
        title: "Les nombres de 0 à 20",
        content: `
# Les nombres de 0 à 20

## Compter jusqu'à 20
### Comptine numérique
0 - 1 - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10
11 - 12 - 13 - 14 - 15 - 16 - 17 - 18 - 19 - 20

### Écriture des nombres
**En chiffres** : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10...
**En lettres** : zéro, un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix...

## Représenter les nombres
### Avec des objets
- 3 pommes : 🍎🍎🍎
- 5 doigts : ✋
- 7 crayons : ✏️✏️✏️✏️✏️✏️✏️

### Avec des dessins
- Points : • • • (3)
- Bâtons : | | | | (4)
- Carrés : □ □ □ □ □ (5)

### Sur la file numérique
La file numérique de 0 à 10 :
0 - 1 - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10

## Comparer les nombres
### Symboles de comparaison
- **=** égal à : 5 = 5
- **<** plus petit que : 3 < 7
- **>** plus grand que : 9 > 4

### Ranger dans l'ordre
**Croissant** (du plus petit au plus grand) : 2 < 5 < 8 < 12
**Décroissant** (du plus grand au plus petit) : 15 > 10 > 7 > 3

## Activités pratiques
1. Compter des objets dans la classe
2. Écrire les nombres manquants
3. Entourer le plus grand nombre
4. Ranger des nombres dans l'ordre`
      },
      {
        title: "L'addition",
        content: `
# L'addition

## Comprendre l'addition
L'addition, c'est **ajouter**, **réunir**, **mettre ensemble**.

### Vocabulaire
- **Addition** : l'opération
- **Additionner** : faire une addition
- **Somme** : le résultat de l'addition
- **+** : le signe "plus"
- **=** : le signe "égal"

### Exemple
3 + 2 = 5
- 3 et 2 sont les nombres à additionner
- 5 est la somme

## Techniques d'addition
### Avec les doigts
Pour calculer 3 + 2 :
1. Lever 3 doigts d'une main
2. Lever 2 doigts de l'autre main  
3. Compter tous les doigts levés : 5

### Avec du matériel
- Cubes à empiler
- Jetons à compter
- Dessins à colorier

### Sur la file numérique
Pour 4 + 3 :
1. Se placer sur 4
2. Avancer de 3 cases
3. Arriver sur 7

## Additions simples
### Additions dans les nombres de 0 à 10
- 1 + 1 = 2
- 2 + 2 = 4
- 3 + 2 = 5
- 4 + 1 = 5
- 5 + 3 = 8

### Additions avec 0
- 5 + 0 = 5
- 0 + 7 = 7
- 0 + 0 = 0

**Règle** : Quand on ajoute 0, le nombre ne change pas.

## Problèmes d'addition
### Dans la classe
"Il y a 5 filles et 3 garçons dans la classe. Combien y a-t-il d'élèves en tout ?"
**Solution** : 5 + 3 = 8 élèves

### À la récréation  
"Paul a 4 billes. Son copain lui en donne 2. Combien Paul a-t-il de billes maintenant ?"
**Solution** : 4 + 2 = 6 billes`
      },
      {
        title: "La soustraction",
        content: `
# La soustraction

## Comprendre la soustraction
La soustraction, c'est **enlever**, **retirer**, **perdre**.

### Vocabulaire
- **Soustraction** : l'opération
- **Soustraire** : faire une soustraction
- **Différence** : le résultat de la soustraction
- **-** : le signe "moins"

### Exemple
7 - 3 = 4
- De 7, on enlève 3
- Il reste 4

## Techniques de soustraction
### Avec les doigts
Pour calculer 5 - 2 :
1. Lever 5 doigts
2. Baisser 2 doigts
3. Compter les doigts qui restent levés : 3

### Avec du matériel
- Barrer des dessins
- Enlever des objets
- Cacher une partie

### Sur la file numérique
Pour 8 - 3 :
1. Se placer sur 8
2. Reculer de 3 cases
3. Arriver sur 5

## Soustractions simples
### Dans les nombres de 0 à 10
- 5 - 2 = 3
- 7 - 4 = 3
- 9 - 1 = 8
- 6 - 6 = 0

### Soustractions avec 0
- 8 - 0 = 8
- 4 - 0 = 4

**Règle** : Quand on enlève 0, le nombre ne change pas.

## Problèmes de soustraction
### Les jouets
"Marie avait 8 images. Elle en donne 3 à sa sœur. Combien lui en reste-t-il ?"
**Solution** : 8 - 3 = 5 images

### Les animaux
"Dans le pré, il y avait 6 moutons. 2 sont rentrés à l'étable. Combien en reste-t-il dans le pré ?"
**Solution** : 6 - 2 = 4 moutons`
      },
      {
        title: "Les formes géométriques",
        content: `
# Les formes géométriques

## Les formes de base
### Le rond (cercle)
- Forme de la roue, du ballon
- Pas de coins (angles)
- Tout rond

### Le carré
- 4 côtés égaux
- 4 coins droits (angles droits)
- Forme du dé, de la fenêtre

### Le rectangle
- 4 côtés (2 longs, 2 courts)
- 4 coins droits
- Forme du livre, de la porte

### Le triangle
- 3 côtés
- 3 coins (angles)
- Forme du toit de maison

## Reconnaître les formes
### Dans la classe
- **Carré** : tableau, livre fermé
- **Rectangle** : table, fenêtre, porte
- **Rond** : horloge, assiette
- **Triangle** : équerre, panneau

### Dans la maison
- **Rond** : assiette, roue de vélo, miroir
- **Carré** : carreau de carrelage, coussin
- **Rectangle** : télévision, lit, tapis
- **Triangle** : part de pizza, cintre

## Tracer les formes
### Le rond
1. Poser le crayon sur le papier
2. Tourner en rond sans lever le crayon
3. Revenir au point de départ

### Le carré
1. Tracer un trait horizontal
2. Tracer un trait vertical vers le haut
3. Tracer un trait horizontal vers la gauche
4. Tracer un trait vertical vers le bas pour fermer

### Utiliser la règle
- Pour tracer des traits droits
- Pour mesurer les côtés
- Pour faire des angles droits

## Activités créatives
1. Dessiner avec des formes géométriques
2. Construire une maison avec des formes
3. Classer les objets par forme
4. Fabriquer des formes en pâte à modeler`
      }
    ]
  },
  "CE1": {
    title: "Mathématiques CE1 - Calculs et mesures",
    description: "Nombres jusqu'à 100, opérations posées, mesures de longueur et de temps pour les 7-8 ans",
    sections: [
      {
        title: "Les nombres jusqu'à 100",
        content: `
# Les nombres jusqu'à 100

## Les dizaines et les unités
### Comprendre les dizaines
- 1 dizaine = 10 unités
- 2 dizaines = 20 unités  
- 5 dizaines = 50 unités
- 10 dizaines = 100 unités

### Décomposer un nombre
**Exemple avec 47** :
- 47 = 4 dizaines + 7 unités
- 47 = 40 + 7

**Exemple avec 83** :
- 83 = 8 dizaines + 3 unités
- 83 = 80 + 3

## Lire et écrire les nombres
### Les nombres de 20 à 69
- 21 : vingt-et-un
- 32 : trente-deux
- 45 : quarante-cinq
- 58 : cinquante-huit
- 67 : soixante-sept

### Les nombres de 70 à 100
- 71 : soixante-et-onze (60 + 11)
- 82 : quatre-vingt-deux (4 × 20 + 2)
- 95 : quatre-vingt-quinze (4 × 20 + 15)
- 100 : cent

## Comparer et ranger
### Sur la droite graduée
```
0----10----20----30----40----50----60----70----80----90----100
```

### Techniques de comparaison
1. **Comparer les dizaines d'abord** : 56 > 43 (5 > 4)
2. **Si même dizaine, comparer les unités** : 47 > 42 (7 > 2)

### Encadrer un nombre
**Entre deux dizaines** : 40 < 47 < 50
**Entre deux unités** : 47 < 48 < 49

## Le tableau des nombres
```
 1  2  3  4  5  6  7  8  9 10
11 12 13 14 15 16 17 18 19 20
21 22 23 24 25 26 27 28 29 30
31 32 33 34 35 36 37 38 39 40
41 42 43 44 45 46 47 48 49 50
51 52 53 54 55 56 57 58 59 60
61 62 63 64 65 66 67 68 69 70
71 72 73 74 75 76 77 78 79 80
81 82 83 84 85 86 87 88 89 90
91 92 93 94 95 96 97 98 99 100
```

### Utiliser le tableau
- Pour compter de 10 en 10 (verticalement)
- Pour compter de 1 en 1 (horizontalement)
- Pour trouver les voisins d'un nombre`
      },
      {
        title: "L'addition posée",
        content: `
# L'addition posée

## Poser une addition
### Addition sans retenue
```
  2 3
+ 1 5
-----
  3 8
```

**Méthode** :
1. Aligner les unités sous les unités
2. Aligner les dizaines sous les dizaines
3. Additionner d'abord les unités : 3 + 5 = 8
4. Additionner ensuite les dizaines : 2 + 1 = 3

### Addition avec retenue
```
  2 7
+ 1 6
-----
  4 3
```

**Méthode** :
1. Unités : 7 + 6 = 13 → j'écris 3 et je retiens 1
2. Dizaines : 2 + 1 + 1 (retenue) = 4

## Vérifier son calcul
### Avec la calculatrice
Utiliser la calculatrice pour vérifier le résultat.

### Avec l'addition à trous
Si 23 + 15 = 38, alors 38 - 15 = 23

### Par estimation
- 23 + 15 ≈ 20 + 15 = 35
- Le résultat 38 est proche de 35, c'est cohérent.

## Problèmes d'addition
### À la boulangerie
"Le matin, le boulanger a vendu 27 croissants. L'après-midi, il en a vendu 35. Combien a-t-il vendu de croissants dans la journée ?"

**Résolution** :
- Opération : 27 + 35
- Calcul posé :
```
  2 7
+ 3 5
-----
  6 2
```
- Réponse : Il a vendu 62 croissants.

### Collections
"Lisa a 46 autocollants. Pour son anniversaire, elle en reçoit 28 de plus. Combien a-t-elle d'autocollants maintenant ?"

**Résolution** : 46 + 28 = 74 autocollants`
      },
      {
        title: "La soustraction posée",
        content: `
# La soustraction posée

## Poser une soustraction
### Soustraction sans retenue
```
  4 8
- 2 3
-----
  2 5
```

**Méthode** :
1. Aligner les unités sous les unités
2. Aligner les dizaines sous les dizaines
3. Soustraire d'abord les unités : 8 - 3 = 5
4. Soustraire ensuite les dizaines : 4 - 2 = 2

### Soustraction avec retenue
```
  5 2
- 1 7
-----
  3 5
```

**Méthode** :
1. Unités : 2 < 7, je ne peux pas
2. J'emprunte 1 dizaine : 52 devient 4 dizaines et 12 unités
3. Unités : 12 - 7 = 5
4. Dizaines : 4 - 1 = 3

## Vérifier son calcul
### Avec l'addition
Si 52 - 17 = 35, alors 35 + 17 = 52

### Avec la calculatrice
Utiliser la calculatrice pour vérifier.

### Par estimation
- 52 - 17 ≈ 50 - 20 = 30
- Le résultat 35 est proche de 30, c'est cohérent.

## Problèmes de soustraction
### Les livres
"Dans la bibliothèque, il y avait 73 livres. On en a emprunté 28. Combien en reste-t-il ?"

**Résolution** :
- Opération : 73 - 28
- Calcul posé :
```
  7 3
- 2 8
-----
  4 5
```
- Réponse : Il reste 45 livres.

### L'argent de poche
"Tom avait 65€ d'argent de poche. Il achète un jeu à 29€. Combien lui reste-t-il ?"

**Résolution** : 65 - 29 = 36€`
      },
      {
        title: "Mesures de longueur et de temps",
        content: `
# Mesures de longueur et de temps

## Les mesures de longueur
### Les unités
- **Le centimètre (cm)** : petites longueurs
- **Le mètre (m)** : grandes longueurs
- **1 mètre = 100 centimètres**

### Mesurer avec la règle
1. Placer le 0 de la règle au début de l'objet
2. Lire le nombre au bout de l'objet
3. Ajouter l'unité (cm)

### Exemples de longueurs
- Crayon : environ 15 cm
- Table : environ 1 m (100 cm)
- Cour de récréation : environ 50 m

## Le temps
### Les unités de temps
- **La seconde** : très court (un battement de cœur)
- **La minute** : 60 secondes
- **L'heure** : 60 minutes
- **Le jour** : 24 heures

### Lire l'heure
#### L'horloge à aiguilles
- **Petite aiguille** : les heures
- **Grande aiguille** : les minutes

#### Heures justes
- 8h00 : grande aiguille sur 12, petite sur 8
- 3h00 : grande aiguille sur 12, petite sur 3

#### Demi-heures
- 8h30 : grande aiguille sur 6, petite entre 8 et 9
- 3h30 : grande aiguille sur 6, petite entre 3 et 4

### L'horloge digitale
- **8:00** = 8 heures
- **8:30** = 8 heures et 30 minutes
- **14:15** = 14 heures et 15 minutes (2 heures 15 de l'après-midi)

## Problèmes avec les mesures
### Longueur
"Le jardin de Paul mesure 12 mètres de long. Celui de Marie mesure 8 mètres. Quelle est la différence de longueur ?"
**Solution** : 12 - 8 = 4 mètres

### Temps
"Le film commence à 14h30 et dure 1h30. À quelle heure se termine-t-il ?"
**Solution** : 14h30 + 1h30 = 16h00`
      }
    ]
  },
  "CE2": {
    title: "Mathématiques CE2 - Multiplication et géométrie",
    description: "Tables de multiplication, géométrie, fractions simples et problèmes pour les 8-9 ans",
    sections: [
      {
        title: "Les tables de multiplication",
        content: `
# Les tables de multiplication

## Comprendre la multiplication
### Qu'est-ce que multiplier ?
Multiplier, c'est **additionner plusieurs fois le même nombre**.

**Exemple** : 3 × 4 = 3 + 3 + 3 + 3 = 12
- 3 groupes de 4
- 4 fois le nombre 3

### Vocabulaire
- **Multiplication** : l'opération
- **Multiplier** : faire une multiplication
- **Produit** : le résultat
- **×** : le signe "fois"

## Les tables de 2 à 5
### Table de 2
```
2 × 1 = 2     2 × 6 = 12
2 × 2 = 4     2 × 7 = 14
2 × 3 = 6     2 × 8 = 16
2 × 4 = 8     2 × 9 = 18
2 × 5 = 10    2 × 10 = 20
```
**Astuce** : compter de 2 en 2

### Table de 5
```
5 × 1 = 5     5 × 6 = 30
5 × 2 = 10    5 × 7 = 35
5 × 3 = 15    5 × 8 = 40
5 × 4 = 20    5 × 9 = 45
5 × 5 = 25    5 × 10 = 50
```
**Astuce** : finit toujours par 0 ou 5

### Table de 10
```
10 × 1 = 10   10 × 6 = 60
10 × 2 = 20   10 × 7 = 70
10 × 3 = 30   10 × 8 = 80
10 × 4 = 40   10 × 9 = 90
10 × 5 = 50   10 × 10 = 100
```
**Astuce** : ajouter un 0 au nombre

## Techniques pour retenir
### Avec les doigts (table de 9)
1. Tendre les 10 doigts
2. Pour 9 × 4, baisser le 4ème doigt
3. Compter : 3 doigts levés (dizaines) + 6 doigts levés (unités) = 36

### Avec des dessins
Dessiner des groupes d'objets :
- 3 × 4 = 3 groupes de 4 points

### Avec des situations
- 4 × 5 = 4 paquets de 5 bonbons = 20 bonbons
- 6 × 2 = 6 bicyclettes × 2 roues = 12 roues

## Propriétés importantes
### La commutativité
**3 × 4 = 4 × 3**
L'ordre ne change pas le résultat.

### Multiplier par 1
**Tout nombre × 1 = ce nombre**
7 × 1 = 7

### Multiplier par 0
**Tout nombre × 0 = 0**
8 × 0 = 0`
      },
      {
        title: "La multiplication posée",
        content: `
# La multiplication posée

## Multiplication par un nombre à 1 chiffre
### Multiplication sans retenue
```
  2 3
×   2
-----
  4 6
```

**Méthode** :
1. 3 × 2 = 6 (unités)
2. 2 × 2 = 4 (dizaines)
3. Résultat : 46

### Multiplication avec retenue
```
  2 7
×   3
-----
  8 1
```

**Méthode** :
1. Unités : 7 × 3 = 21 → j'écris 1 et je retiens 2
2. Dizaines : 2 × 3 = 6, + 2 (retenue) = 8
3. Résultat : 81

## Multiplication par 10, 20, 30...
### Règle simple
Pour multiplier par 10 : **ajouter un 0**
- 23 × 10 = 230
- 57 × 10 = 570

Pour multiplier par 20 : **multiplier par 2 puis ajouter un 0**
- 23 × 20 = 23 × 2 × 10 = 46 × 10 = 460

## Vérifier son calcul
### Par l'estimation
- 27 × 3 ≈ 30 × 3 = 90
- Le résultat 81 est proche de 90, c'est cohérent.

### Par la division
Si 27 × 3 = 81, alors 81 ÷ 3 = 27

## Problèmes de multiplication
### Les packs
"Au supermarché, maman achète 4 packs de yaourts. Il y a 6 yaourts par pack. Combien y a-t-il de yaourts en tout ?"

**Résolution** :
- Opération : 4 × 6 ou 6 × 4
- Calcul : 6 × 4 = 24
- Réponse : Il y a 24 yaourts en tout.

### Les rangs
"Dans la salle de spectacle, il y a 12 rangs de 25 places chacun. Combien y a-t-il de places en tout ?"

**Résolution** :
```
  2 5
× 1 2
-----
  5 0  (25 × 2)
2 5 0  (25 × 10)
-----
3 0 0
```
**Réponse** : Il y a 300 places.`
      },
      {
        title: "Géométrie et figures",
        content: `
# Géométrie et figures

## Les polygones
### Qu'est-ce qu'un polygone ?
Un polygone est une figure fermée avec plusieurs côtés droits.

### Classification par nombre de côtés
- **Triangle** : 3 côtés
- **Quadrilatère** : 4 côtés
- **Pentagone** : 5 côtés
- **Hexagone** : 6 côtés

## Les quadrilatères particuliers
### Le carré
- **4 côtés égaux**
- **4 angles droits**
- Toutes les propriétés du rectangle

### Le rectangle
- **4 angles droits**
- **Côtés opposés égaux** (2 longueurs, 2 largeurs)

### Le losange
- **4 côtés égaux**
- **Angles opposés égaux** (mais pas forcément droits)

### Le parallélogramme
- **Côtés opposés parallèles et égaux**
- **Angles opposés égaux**

## Les triangles
### Triangle équilatéral
- **3 côtés égaux**
- **3 angles égaux**

### Triangle isocèle
- **2 côtés égaux**
- **2 angles égaux**

### Triangle rectangle
- **1 angle droit** (90°)
- **2 côtés perpendiculaires**

## Construire des figures
### Avec la règle et l'équerre
1. **Tracer un angle droit** avec l'équerre
2. **Mesurer des longueurs** avec la règle
3. **Tracer des parallèles** avec l'équerre

### Avec le compas
1. **Tracer des cercles**
2. **Reporter des longueurs**
3. **Construire des triangles équilatéraux**

## Périmètre et aire
### Le périmètre
Le périmètre est la **longueur du contour** d'une figure.

**Rectangle** : P = 2 × (longueur + largeur)
**Carré** : P = 4 × côté

### L'aire
L'aire est la **surface** d'une figure.

**Rectangle** : Aire = longueur × largeur
**Carré** : Aire = côté × côté

### Unités
- **Périmètre** : cm, m, km
- **Aire** : cm², m², km²`
      },
      {
        title: "Les fractions simples",
        content: `
# Les fractions simples

## Comprendre les fractions
### Qu'est-ce qu'une fraction ?
Une fraction représente **une partie d'un tout**.

### Écriture d'une fraction
**1/2** se lit "un demi"
- **1** : numérateur (nombre de parts prises)
- **2** : dénominateur (nombre de parts au total)

## Les fractions usuelles
### Les demis (1/2)
- **1/2** = la moitié
- Partager en 2 parts égales et prendre 1 part
- Exemples : 1/2 pizza, 1/2 heure

### Les tiers (1/3)
- **1/3** = un tiers
- Partager en 3 parts égales et prendre 1 part
- **2/3** = deux tiers (prendre 2 parts sur 3)

### Les quarts (1/4)
- **1/4** = un quart
- Partager en 4 parts égales et prendre 1 part
- **3/4** = trois quarts (prendre 3 parts sur 4)

## Représenter les fractions
### Avec des dessins
- **Disques partagés** : comme une pizza
- **Rectangles partagés** : comme une tablette de chocolat
- **Bandes partagées** : comme une règle

### Sur la droite graduée
```
0----1/4----1/2----3/4----1
```

### Avec des collections
- 1/2 de 8 = 4
- 1/3 de 12 = 4
- 1/4 de 20 = 5

## Comparer les fractions
### Fractions de même dénominateur
**2/5 < 3/5** (même dénominateur, on compare les numérateurs)

### Fractions usuelles
- **1/2 = 2/4** (moitié)
- **1/4 < 1/2** (un quart est plus petit qu'un demi)
- **3/4 > 1/2** (trois quarts est plus grand qu'un demi)

## Problèmes avec les fractions
### Le gâteau
"Maman a fait un gâteau. Elle le partage en 8 parts égales. Papa en mange 3 parts. Quelle fraction du gâteau Papa a-t-il mangée ?"

**Réponse** : Papa a mangé 3/8 du gâteau.

### Les billes
"Dans un sac de 20 billes, 1/4 sont rouges. Combien y a-t-il de billes rouges ?"

**Résolution** :
- 1/4 de 20 = 20 ÷ 4 = 5
- **Réponse** : Il y a 5 billes rouges.`
      }
    ]
  }
};

async function createCoursMathematiques() {
  console.log('🔢 Création des cours de mathématiques...');
  
  try {
    // Récupérer tous les niveaux
    const niveaux = await prisma.niveau.findMany({
      orderBy: { order: 'asc' }
    });

    // Pour l'instant, créer les cours pour CP, CE1, CE2
    const niveauxACreer = ['CP', 'CE1', 'CE2'];
    
    for (const nomNiveau of niveauxACreer) {
      const niveau = niveaux.find(n => n.name === nomNiveau);
      if (!niveau) {
        console.log(`⚠️ Niveau ${nomNiveau} non trouvé`);
        continue;
      }

      const coursData = coursMathematiques[nomNiveau as keyof typeof coursMathematiques];
      if (!coursData) {
        console.log(`⚠️ Données cours non trouvées pour ${nomNiveau}`);
        continue;
      }

      console.log(`🔢 Création du cours de mathématiques ${nomNiveau}...`);

      // Créer le cours
      const cours = await prisma.course.create({
        data: {
          title: coursData.title,
          description: coursData.description,
          category: 'Mathématiques',
          niveauId: niveau.id,
          order: 2,
          isPublished: true,
          imageUrl: '/images/mathematiques.jpg'
        }
      });

      // Créer les sections
      for (let i = 0; i < coursData.sections.length; i++) {
        const section = coursData.sections[i];
        
        await prisma.courseSection.create({
          data: {
            courseId: cours.id,
            title: section.title,
            content: section.content,
            order: i + 1,
            isValidatable: true
          }
        });
      }

      console.log(`✅ Cours mathématiques ${nomNiveau} créé avec ${coursData.sections.length} sections`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la création des cours de mathématiques:', error);
    throw error;
  }
}

if (require.main === module) {
  createCoursMathematiques()
    .then(() => {
      console.log('🎉 Cours de mathématiques créés avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { createCoursMathematiques };