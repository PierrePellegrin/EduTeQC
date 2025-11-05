#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCoursMathematiques() {
  console.log('🔢 Création des cours de mathématiques...');
  
  try {
    // Récupérer tous les niveaux
    const niveaux = await prisma.niveau.findMany({
      orderBy: { order: 'asc' }
    });

    // Cours CP
    const niveauCP = niveaux.find(n => n.name === 'CP');
    if (niveauCP) {
      const coursCP = await prisma.course.create({
        data: {
          title: "Mathématiques CP - Nombres et calculs",
          description: "Découverte des nombres de 0 à 100, premières additions et soustractions pour les 6-7 ans",
          category: 'Mathématiques',
          niveauId: niveauCP.id,
          order: 2,
          isPublished: true,
          imageUrl: '/images/mathematiques.jpg'
        }
      });

      const sectionsCP = [
        {
          title: "Les nombres de 0 à 20",
          content: `# Les nombres de 0 à 20

## Compter jusqu'à 20
L'alphabet des nombres : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20

## Écriture des nombres
- En chiffres : 0, 1, 2, 3, 4, 5...
- En lettres : zéro, un, deux, trois, quatre, cinq...

## Représenter les nombres
- Avec des objets : 3 pommes, 5 doigts, 7 crayons
- Avec des dessins : points, bâtons, carrés
- Sur la file numérique

## Comparer les nombres
- = égal à : 5 = 5
- < plus petit que : 3 < 7  
- > plus grand que : 9 > 4

## Activités pratiques
1. Compter des objets dans la classe
2. Écrire les nombres manquants
3. Entourer le plus grand nombre
4. Ranger des nombres dans l'ordre`
        },
        {
          title: "L'addition",
          content: `# L'addition

## Comprendre l'addition
L'addition, c'est ajouter, réunir, mettre ensemble.

## Vocabulaire
- Addition : l'opération
- Additionner : faire une addition
- Somme : le résultat de l'addition
- + : le signe "plus"
- = : le signe "égal"

## Techniques d'addition
- Avec les doigts
- Avec du matériel (cubes, jetons)
- Sur la file numérique

## Additions simples
- 1 + 1 = 2
- 2 + 2 = 4
- 3 + 2 = 5
- 4 + 1 = 5
- 5 + 3 = 8

## Règle importante
Quand on ajoute 0, le nombre ne change pas : 5 + 0 = 5

## Problèmes d'addition
"Il y a 5 filles et 3 garçons dans la classe. Combien y a-t-il d'élèves en tout ?"
Solution : 5 + 3 = 8 élèves`
        },
        {
          title: "La soustraction", 
          content: `# La soustraction

## Comprendre la soustraction
La soustraction, c'est enlever, retirer, perdre.

## Vocabulaire
- Soustraction : l'opération
- Soustraire : faire une soustraction
- Différence : le résultat
- - : le signe "moins"

## Techniques de soustraction
- Avec les doigts
- Avec du matériel (barrer des dessins)
- Sur la file numérique

## Soustractions simples
- 5 - 2 = 3
- 7 - 4 = 3
- 9 - 1 = 8
- 6 - 6 = 0

## Règle importante
Quand on enlève 0, le nombre ne change pas : 8 - 0 = 8

## Problèmes de soustraction
"Marie avait 8 images. Elle en donne 3 à sa sœur. Combien lui en reste-t-il ?"
Solution : 8 - 3 = 5 images`
        },
        {
          title: "Les formes géométriques",
          content: `# Les formes géométriques

## Les formes de base
- Le rond (cercle) : forme de la roue, du ballon
- Le carré : 4 côtés égaux, 4 coins droits
- Le rectangle : 4 côtés (2 longs, 2 courts), 4 coins droits  
- Le triangle : 3 côtés, 3 coins

## Reconnaître les formes
Dans la classe :
- Carré : tableau, livre fermé
- Rectangle : table, fenêtre, porte
- Rond : horloge, assiette
- Triangle : équerre, panneau

## Tracer les formes
- Le rond : tourner en rond sans lever le crayon
- Le carré : 4 traits égaux avec des coins droits
- Utiliser la règle pour les traits droits

## Activités créatives
1. Dessiner avec des formes géométriques
2. Construire une maison avec des formes
3. Classer les objets par forme
4. Fabriquer des formes en pâte à modeler`
        }
      ];

      for (let i = 0; i < sectionsCP.length; i++) {
        await prisma.courseSection.create({
          data: {
            courseId: coursCP.id,
            title: sectionsCP[i].title,
            content: sectionsCP[i].content,
            order: i + 1,
            isValidatable: true
          }
        });
      }

      console.log(`✅ Cours mathématiques CP créé avec ${sectionsCP.length} sections`);
    }

    // Cours CE1 
    const niveauCE1 = niveaux.find(n => n.name === 'CE1');
    if (niveauCE1) {
      const coursCE1 = await prisma.course.create({
        data: {
          title: "Mathématiques CE1 - Calculs et mesures",
          description: "Nombres jusqu'à 100, opérations posées, mesures de longueur et de temps pour les 7-8 ans",
          category: 'Mathématiques',
          niveauId: niveauCE1.id,
          order: 2,
          isPublished: true,
          imageUrl: '/images/mathematiques.jpg'
        }
      });

      const sectionsCE1 = [
        {
          title: "Les nombres jusqu'à 100",
          content: `# Les nombres jusqu'à 100

## Les dizaines et les unités
- 1 dizaine = 10 unités
- 2 dizaines = 20 unités
- 47 = 4 dizaines + 7 unités = 40 + 7

## Lire et écrire les nombres
- 21 : vingt-et-un
- 32 : trente-deux  
- 71 : soixante-et-onze
- 82 : quatre-vingt-deux
- 100 : cent

## Comparer et ranger
Pour comparer :
1. Comparer les dizaines d'abord : 56 > 43
2. Si même dizaine, comparer les unités : 47 > 42

## Encadrer un nombre
40 < 47 < 50 (entre deux dizaines)
47 < 48 < 49 (entre deux unités)`
        },
        {
          title: "L'addition posée",
          content: `# L'addition posée

## Poser une addition sans retenue
  23
+ 15
----
  38

Méthode :
1. Aligner unités sous unités
2. Aligner dizaines sous dizaines  
3. Additionner unités : 3 + 5 = 8
4. Additionner dizaines : 2 + 1 = 3

## Addition avec retenue
  27
+ 16
----
  43

Méthode :
1. Unités : 7 + 6 = 13 → j'écris 3 et je retiens 1
2. Dizaines : 2 + 1 + 1 (retenue) = 4

## Vérifier son calcul
- Avec la calculatrice
- Par estimation : 27 + 16 ≈ 30 + 15 = 45`
        },
        {
          title: "La soustraction posée",
          content: `# La soustraction posée

## Soustraction sans retenue
  48
- 23
----
  25

Méthode :
1. Aligner les chiffres
2. Soustraire unités : 8 - 3 = 5
3. Soustraire dizaines : 4 - 2 = 2

## Soustraction avec retenue
  52
- 17
----
  35

Méthode :
1. Unités : 2 < 7, j'emprunte 1 dizaine
2. 52 devient 4 dizaines et 12 unités
3. Unités : 12 - 7 = 5
4. Dizaines : 4 - 1 = 3

## Vérifier son calcul
Si 52 - 17 = 35, alors 35 + 17 = 52`
        },
        {
          title: "Mesures de longueur et de temps",
          content: `# Mesures de longueur et de temps

## Les mesures de longueur
- Le centimètre (cm) : petites longueurs
- Le mètre (m) : grandes longueurs
- 1 mètre = 100 centimètres

## Mesurer avec la règle
1. Placer le 0 au début de l'objet
2. Lire le nombre au bout
3. Ajouter l'unité (cm)

## Le temps
- La seconde : très court
- La minute : 60 secondes
- L'heure : 60 minutes
- Le jour : 24 heures

## Lire l'heure
- Horloge à aiguilles : petite = heures, grande = minutes
- 8h00 : grande sur 12, petite sur 8
- 8h30 : grande sur 6, petite entre 8 et 9

## Horloge digitale
- 8:00 = 8 heures
- 8:30 = 8 heures et 30 minutes
- 14:15 = 2 heures 15 de l'après-midi`
        }
      ];

      for (let i = 0; i < sectionsCE1.length; i++) {
        await prisma.courseSection.create({
          data: {
            courseId: coursCE1.id,
            title: sectionsCE1[i].title,
            content: sectionsCE1[i].content,
            order: i + 1,
            isValidatable: true
          }
        });
      }

      console.log(`✅ Cours mathématiques CE1 créé avec ${sectionsCE1.length} sections`);
    }

    // Cours CE2
    const niveauCE2 = niveaux.find(n => n.name === 'CE2');
    if (niveauCE2) {
      const coursCE2 = await prisma.course.create({
        data: {
          title: "Mathématiques CE2 - Multiplication et géométrie",
          description: "Tables de multiplication, géométrie, fractions simples et problèmes pour les 8-9 ans",
          category: 'Mathématiques',
          niveauId: niveauCE2.id,
          order: 2,
          isPublished: true,
          imageUrl: '/images/mathematiques.jpg'
        }
      });

      const sectionsCE2 = [
        {
          title: "Les tables de multiplication",
          content: `# Les tables de multiplication

## Comprendre la multiplication
Multiplier, c'est additionner plusieurs fois le même nombre.
3 × 4 = 3 + 3 + 3 + 3 = 12

## Vocabulaire
- Multiplication : l'opération
- Multiplier : faire une multiplication
- Produit : le résultat
- × : le signe "fois"

## Table de 2
2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10
2×6=12, 2×7=14, 2×8=16, 2×9=18, 2×10=20

## Table de 5
5×1=5, 5×2=10, 5×3=15, 5×4=20, 5×5=25
5×6=30, 5×7=35, 5×8=40, 5×9=45, 5×10=50

## Table de 10
10×1=10, 10×2=20, 10×3=30, 10×4=40, 10×5=50
Astuce : ajouter un 0 au nombre

## Propriété importante
3 × 4 = 4 × 3 (l'ordre ne change pas le résultat)`
        },
        {
          title: "La multiplication posée",
          content: `# La multiplication posée

## Multiplication sans retenue
  23
×  2
----
  46

Méthode :
1. 3 × 2 = 6 (unités)
2. 2 × 2 = 4 (dizaines)

## Multiplication avec retenue
  27
×  3
----
  81

Méthode :
1. Unités : 7 × 3 = 21 → j'écris 1 et retiens 2
2. Dizaines : 2 × 3 = 6, + 2 (retenue) = 8

## Multiplication par 10
Pour multiplier par 10 : ajouter un 0
23 × 10 = 230

## Vérifier son calcul
Par estimation : 27 × 3 ≈ 30 × 3 = 90
Le résultat 81 est proche de 90, c'est cohérent.`
        },
        {
          title: "Géométrie et figures",
          content: `# Géométrie et figures

## Les polygones
Un polygone est une figure fermée avec plusieurs côtés droits.
- Triangle : 3 côtés
- Quadrilatère : 4 côtés
- Pentagone : 5 côtés
- Hexagone : 6 côtés

## Les quadrilatères particuliers
- Carré : 4 côtés égaux, 4 angles droits
- Rectangle : 4 angles droits, côtés opposés égaux
- Losange : 4 côtés égaux
- Parallélogramme : côtés opposés parallèles

## Les triangles
- Triangle équilatéral : 3 côtés égaux
- Triangle isocèle : 2 côtés égaux
- Triangle rectangle : 1 angle droit

## Périmètre et aire
- Périmètre : longueur du contour
- Aire : surface d'une figure
- Rectangle : Aire = longueur × largeur
- Carré : Aire = côté × côté`
        },
        {
          title: "Les fractions simples",
          content: `# Les fractions simples

## Comprendre les fractions
Une fraction représente une partie d'un tout.
1/2 se lit "un demi"
- 1 : numérateur (parts prises)
- 2 : dénominateur (parts au total)

## Les fractions usuelles
- 1/2 = un demi (la moitié)
- 1/3 = un tiers  
- 1/4 = un quart
- 2/3 = deux tiers
- 3/4 = trois quarts

## Représenter les fractions
- Disques partagés (comme une pizza)
- Rectangles partagés (comme du chocolat)
- Collections : 1/2 de 8 = 4

## Comparer les fractions
- 2/5 < 3/5 (même dénominateur)
- 1/4 < 1/2 < 3/4

## Problèmes avec les fractions
"Dans un sac de 20 billes, 1/4 sont rouges. Combien y a-t-il de billes rouges ?"
Solution : 1/4 de 20 = 20 ÷ 4 = 5 billes rouges`
        }
      ];

      for (let i = 0; i < sectionsCE2.length; i++) {
        await prisma.courseSection.create({
          data: {
            courseId: coursCE2.id,
            title: sectionsCE2[i].title,
            content: sectionsCE2[i].content,
            order: i + 1,
            isValidatable: true
          }
        });
      }

      console.log(`✅ Cours mathématiques CE2 créé avec ${sectionsCE2.length} sections`);
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