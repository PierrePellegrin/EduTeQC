import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateCourseContent() {
  console.log('🌱 Génération du contenu des cours...');

  try {
    // Récupérer les cours existants
    const courses = await prisma.course.findMany({
      include: {
        sections: true,
        tests: true
      }
    });

    console.log(`📚 ${courses.length} cours trouvés`);

    for (const course of courses) {
      console.log(`\n📖 Traitement du cours: ${course.title}`);
      
      if (course.title.includes('Mathématiques')) {
        await generateMathContent(course.id);
      } else if (course.title.includes('Français')) {
        await generateFrenchContent(course.id);
      }
    }

    console.log('\n🎉 Génération terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function generateMathContent(courseId: string) {
  console.log('🔢 Génération du contenu mathématiques...');

  // Supprimer le contenu existant pour regénérer
  await prisma.courseSection.deleteMany({ where: { courseId } });
  await prisma.test.deleteMany({ where: { courseId } });

  // 1. Créer les sections principales
  const introSection = await prisma.courseSection.create({
    data: {
      courseId,
      title: 'Introduction aux mathématiques',
      content: `# Bienvenue dans le cours de mathématiques !

Dans ce cours, vous allez découvrir les bases des mathématiques. Nous allons explorer ensemble :

- Les nombres et leur utilisation
- Les opérations fondamentales
- La résolution de problèmes simples
- Les formes géométriques de base

**Objectifs du cours :**
- Maîtriser l'addition et la soustraction
- Comprendre la multiplication et la division
- Reconnaître les formes géométriques
- Développer le raisonnement logique

Prêt à commencer cette aventure mathématique ? C'est parti !`,
      isValidatable: true,
      order: 1
    }
  });

  const numbersSection = await prisma.courseSection.create({
    data: {
      courseId,
      title: 'Les nombres',
      content: null, // Section conteneur
      isValidatable: false,
      order: 2
    }
  });

  // Sous-sections pour les nombres
  await prisma.courseSection.create({
    data: {
      courseId,
      parentId: numbersSection.id,
      title: 'Compter de 1 à 10',
      content: `# Apprendre à compter de 1 à 10

Les nombres sont partout autour de nous ! Apprenons ensemble à compter de 1 à 10.

## Les nombres en chiffres et en lettres :

1. Un
2. Deux  
3. Trois
4. Quatre
5. Cinq
6. Six
7. Sept
8. Huit
9. Neuf
10. Dix

**Exercice pratique :**
Comptez les objets autour de vous ! Combien y a-t-il de chaises dans la pièce ? Combien de fenêtres ?

**À retenir :** Chaque nombre représente une quantité précise d'objets.`,
      isValidatable: true,
      order: 1
    }
  });

  await prisma.courseSection.create({
    data: {
      courseId,
      parentId: numbersSection.id,
      title: 'Compter de 10 à 20',
      content: `# Continuons avec les nombres de 10 à 20

Maintenant que vous maîtrisez les nombres de 1 à 10, passons aux suivants !

## Les nombres de 10 à 20 :

10. Dix
11. Onze
12. Douze
13. Treize
14. Quatorze
15. Quinze
16. Seize
17. Dix-sept
18. Dix-huit
19. Dix-neuf
20. Vingt

**Astuce :** À partir de 17, on dit "dix-" suivi du nombre (dix-sept, dix-huit, dix-neuf).

**Exercice :** Comptez jusqu'à 20 en sautant de 2 en 2 : 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 !`,
      isValidatable: true,
      order: 2
    }
  });

  const operationsSection = await prisma.courseSection.create({
    data: {
      courseId,
      title: 'Les opérations',
      content: null,
      isValidatable: false,
      order: 3
    }
  });

  // Test associé à la section "compter de 1 à 10"
  const countingSection = await prisma.courseSection.findFirst({
    where: { courseId, title: 'Compter de 1 à 10' }
  });

  if (countingSection) {
    const countingTest = await prisma.test.create({
      data: {
        title: 'Test : Compter de 1 à 10',
        description: 'Vérifiez vos connaissances sur les nombres de 1 à 10',
        sectionId: countingSection.id,
        duration: 5,
        passingScore: 70,
        isPublished: true,
        order: 1
      }
    });

    // Questions pour le test de comptage
    const q1 = await prisma.question.create({
      data: {
        testId: countingTest.id,
        question: 'Comment écrit-on le nombre 5 en lettres ?',
        type: 'SINGLE_CHOICE',
        points: 2,
        order: 1
      }
    });

    await prisma.option.createMany({
      data: [
        { questionId: q1.id, text: 'Cinq', isCorrect: true, order: 1 },
        { questionId: q1.id, text: 'Sin', isCorrect: false, order: 2 },
        { questionId: q1.id, text: 'Sink', isCorrect: false, order: 3 },
        { questionId: q1.id, text: 'Six', isCorrect: false, order: 4 }
      ]
    });

    const q2 = await prisma.question.create({
      data: {
        testId: countingTest.id,
        question: 'Quel nombre vient après 7 ?',
        type: 'SINGLE_CHOICE',
        points: 2,
        order: 2
      }
    });

    await prisma.option.createMany({
      data: [
        { questionId: q2.id, text: '6', isCorrect: false, order: 1 },
        { questionId: q2.id, text: '8', isCorrect: true, order: 2 },
        { questionId: q2.id, text: '9', isCorrect: false, order: 3 },
        { questionId: q2.id, text: '10', isCorrect: false, order: 4 }
      ]
    });
  }

  // Sous-sections pour les opérations
  await prisma.courseSection.create({
    data: {
      courseId,
      parentId: operationsSection.id,
      title: 'L\'addition',
      content: `# L'addition : Apprendre à additionner

L'addition permet de regrouper des quantités. Le symbole de l'addition est **+**.

## Principe de base :
Quand on additionne, on **ajoute** une quantité à une autre.

**Exemple :** 
- J'ai 3 pommes 🍎🍎🍎
- Mon ami me donne 2 pommes 🍎🍎
- Au total, j'ai : 3 + 2 = 5 pommes 🍎🍎🍎🍎🍎

## Exercices pratiques :

1. 1 + 1 = ?
2. 2 + 3 = ?
3. 4 + 1 = ?
4. 5 + 2 = ?

**Astuce :** Vous pouvez utiliser vos doigts pour compter !

**Réponses :** 1) 2, 2) 5, 3) 5, 4) 7`,
      isValidatable: true,
      order: 1
    }
  });

  await prisma.courseSection.create({
    data: {
      courseId,
      parentId: operationsSection.id,
      title: 'La soustraction',
      content: `# La soustraction : Apprendre à soustraire

La soustraction permet de retirer une quantité d'une autre. Le symbole de la soustraction est **-**.

## Principe de base :
Quand on soustrait, on **enlève** une quantité d'une autre.

**Exemple :** 
- J'ai 7 bonbons 🍭🍭🍭🍭🍭🍭🍭
- J'en mange 3 🍭🍭🍭
- Il me reste : 7 - 3 = 4 bonbons 🍭🍭🍭🍭

## Exercices pratiques :

1. 5 - 2 = ?
2. 8 - 3 = ?
3. 10 - 4 = ?
4. 6 - 1 = ?

**Astuce :** Commencez par le plus grand nombre et comptez en reculant !

**Réponses :** 1) 3, 2) 5, 3) 6, 4) 5`,
      isValidatable: true,
      order: 2
    }
  });

  // Test global pour le cours de mathématiques
  const globalMathTest = await prisma.test.create({
    data: {
      title: 'Évaluation finale - Mathématiques',
      description: 'Test global pour évaluer vos connaissances en mathématiques de base',
      courseId,
      duration: 15,
      passingScore: 75,
      isPublished: true,
      order: 1
    }
  });

  // Questions pour le test global
  const gq1 = await prisma.question.create({
    data: {
      testId: globalMathTest.id,
      question: 'Combien font 4 + 3 ?',
      type: 'SINGLE_CHOICE',
      points: 3,
      order: 1
    }
  });

  await prisma.option.createMany({
    data: [
      { questionId: gq1.id, text: '6', isCorrect: false, order: 1 },
      { questionId: gq1.id, text: '7', isCorrect: true, order: 2 },
      { questionId: gq1.id, text: '8', isCorrect: false, order: 3 },
      { questionId: gq1.id, text: '9', isCorrect: false, order: 4 }
    ]
  });

  const gq2 = await prisma.question.create({
    data: {
      testId: globalMathTest.id,
      question: 'Combien font 10 - 6 ?',
      type: 'SINGLE_CHOICE',
      points: 3,
      order: 2
    }
  });

  await prisma.option.createMany({
    data: [
      { questionId: gq2.id, text: '3', isCorrect: false, order: 1 },
      { questionId: gq2.id, text: '4', isCorrect: true, order: 2 },
      { questionId: gq2.id, text: '5', isCorrect: false, order: 3 },
      { questionId: gq2.id, text: '6', isCorrect: false, order: 4 }
    ]
  });

  const gq3 = await prisma.question.create({
    data: {
      testId: globalMathTest.id,
      question: 'Quels nombres peut-on additionner pour obtenir 8 ?',
      type: 'MULTIPLE_CHOICE',
      points: 4,
      order: 3
    }
  });

  await prisma.option.createMany({
    data: [
      { questionId: gq3.id, text: '3 + 5', isCorrect: true, order: 1 },
      { questionId: gq3.id, text: '4 + 4', isCorrect: true, order: 2 },
      { questionId: gq3.id, text: '2 + 6', isCorrect: true, order: 3 },
      { questionId: gq3.id, text: '1 + 6', isCorrect: false, order: 4 }
    ]
  });

  console.log('✅ Contenu mathématiques généré');
}

async function generateFrenchContent(courseId: string) {
  console.log('📝 Génération du contenu français...');

  // Supprimer le contenu existant pour regénérer
  await prisma.courseSection.deleteMany({ where: { courseId } });
  await prisma.test.deleteMany({ where: { courseId } });

  // 1. Introduction
  const introSection = await prisma.courseSection.create({
    data: {
      courseId,
      title: 'Introduction au français',
      content: `# Bienvenue dans le cours de français !

Le français est une belle langue qui nous permet de communiquer, de lire et d'écrire. Dans ce cours, nous allons apprendre ensemble :

- Les différents types de mots
- Comment bien structurer nos phrases
- Les règles de base de la grammaire
- L'orthographe des mots courants

**Objectifs du cours :**
- Reconnaître les classes de mots (nom, verbe, adjectif...)
- Construire des phrases simples
- Améliorer son orthographe
- Développer son vocabulaire

**Pourquoi apprendre le français ?**
Le français nous aide à mieux nous exprimer, à comprendre ce que nous lisons et à écrire sans fautes. C'est un outil formidable pour réussir à l'école et dans la vie !

Prêt à découvrir les secrets de la langue française ? Allons-y !`,
      isValidatable: true,
      order: 1
    }
  });

  // 2. Les mots
  const wordsSection = await prisma.courseSection.create({
    data: {
      courseId,
      title: 'Les classes de mots',
      content: null,
      isValidatable: false,
      order: 2
    }
  });

  // Sous-sections pour les classes de mots
  await prisma.courseSection.create({
    data: {
      courseId,
      parentId: wordsSection.id,
      title: 'Les noms',
      content: `# Les noms : Donner un nom aux choses

Un **nom** désigne une personne, un animal, une chose ou une idée.

## Les différents types de noms :

### Noms de personnes :
- Papa, maman, Pierre, Marie, docteur, maîtresse

### Noms d'animaux :
- Chat, chien, oiseau, poisson, éléphant, souris

### Noms de choses :
- Table, chaise, livre, crayon, voiture, maison

### Noms d'idées :
- Joie, tristesse, courage, peur, amour, liberté

## Comment reconnaître un nom ?
On peut mettre **"le"**, **"la"** ou **"les"** devant :
- **Le** chat
- **La** maison  
- **Les** enfants

**Exercice :** Dans cette phrase, trouvez les noms : "Le chien joue dans le jardin avec sa balle."

*Réponse : chien, jardin, balle*`,
      isValidatable: true,
      order: 1
    }
  });

  await prisma.courseSection.create({
    data: {
      courseId,
      parentId: wordsSection.id,
      title: 'Les verbes',
      content: `# Les verbes : Exprimer les actions

Un **verbe** exprime une action (ce qu'on fait) ou un état (comment on est).

## Les verbes d'action :
Ces verbes montrent ce qu'on fait :
- **Marcher** : Je marche dans la rue
- **Manger** : Tu manges une pomme
- **Jouer** : Il joue au football
- **Lire** : Elle lit un livre
- **Courir** : Nous courons dans le parc

## Les verbes d'état :
Ces verbes montrent comment on est :
- **Être** : Je suis content
- **Paraître** : Tu parais fatigué
- **Sembler** : Il semble triste
- **Devenir** : Elle devient grande
- **Rester** : Nous restons à la maison

## Comment reconnaître un verbe ?
On peut dire **"en train de"** devant :
- En train de **marcher**
- En train de **manger**
- En train de **jouer**

**Exercice :** Dans cette phrase, trouvez le verbe : "Mon frère dessine un beau paysage."

*Réponse : dessine*`,
      isValidatable: true,
      order: 2
    }
  });

  const nounsSection = await prisma.courseSection.findFirst({
    where: { courseId, title: 'Les noms' }
  });

  // Test associé à la section "Les noms"
  if (nounsSection) {
    const nounsTest = await prisma.test.create({
      data: {
        title: 'Test : Reconnaître les noms',
        description: 'Vérifiez vos connaissances sur les noms',
        sectionId: nounsSection.id,
        duration: 7,
        passingScore: 70,
        isPublished: true,
        order: 1
      }
    });

    const nq1 = await prisma.question.create({
      data: {
        testId: nounsTest.id,
        question: 'Dans la phrase "Le chat dort sur le tapis", quels sont les noms ?',
        type: 'MULTIPLE_CHOICE',
        points: 3,
        order: 1
      }
    });

    await prisma.option.createMany({
      data: [
        { questionId: nq1.id, text: 'chat', isCorrect: true, order: 1 },
        { questionId: nq1.id, text: 'dort', isCorrect: false, order: 2 },
        { questionId: nq1.id, text: 'tapis', isCorrect: true, order: 3 },
        { questionId: nq1.id, text: 'sur', isCorrect: false, order: 4 }
      ]
    });

    const nq2 = await prisma.question.create({
      data: {
        testId: nounsTest.id,
        question: 'Quel mot est un nom ?',
        type: 'SINGLE_CHOICE',
        points: 2,
        order: 2
      }
    });

    await prisma.option.createMany({
      data: [
        { questionId: nq2.id, text: 'rapidement', isCorrect: false, order: 1 },
        { questionId: nq2.id, text: 'école', isCorrect: true, order: 2 },
        { questionId: nq2.id, text: 'courir', isCorrect: false, order: 3 },
        { questionId: nq2.id, text: 'grand', isCorrect: false, order: 4 }
      ]
    });
  }

  // 3. Les phrases
  await prisma.courseSection.create({
    data: {
      courseId,
      title: 'Construire des phrases',
      content: `# Construire des phrases simples

Une **phrase** exprime une idée complète. Elle commence par une majuscule et se termine par un point.

## La structure de base :
**Sujet + Verbe + Complément**

### Exemples :
- **Marie** mange **une pomme.**
  - Sujet : Marie (qui ?)
  - Verbe : mange (que fait-elle ?)
  - Complément : une pomme (quoi ?)

- **Le chien** court **dans le jardin.**
  - Sujet : Le chien (qui ?)
  - Verbe : court (que fait-il ?)
  - Complément : dans le jardin (où ?)

## Les signes de ponctuation :
- **.** (point) : fin de phrase
- **?** (point d'interrogation) : question
- **!** (point d'exclamation) : surprise, joie, colère
- **,** (virgule) : pause dans la phrase

## Types de phrases :
1. **Phrase déclarative :** Le soleil brille.
2. **Phrase interrogative :** Est-ce que tu viens ?
3. **Phrase exclamative :** Comme c'est beau !

**Exercice :** Remettez ces mots dans l'ordre pour faire une phrase : "mange - cheval - Le - herbe - de - l'"

*Réponse : Le cheval mange de l'herbe.*`,
      isValidatable: true,
      order: 3
    }
  });

  // Test global pour le cours de français
  const globalFrenchTest = await prisma.test.create({
    data: {
      title: 'Évaluation finale - Français',
      description: 'Test global pour évaluer vos connaissances en grammaire de base',
      courseId,
      duration: 20,
      passingScore: 75,
      isPublished: true,
      order: 1
    }
  });

  // Questions pour le test global
  const fq1 = await prisma.question.create({
    data: {
      testId: globalFrenchTest.id,
      question: 'Dans la phrase "Pierre lit un livre passionnant", quel est le verbe ?',
      type: 'SINGLE_CHOICE',
      points: 3,
      order: 1
    }
  });

  await prisma.option.createMany({
    data: [
      { questionId: fq1.id, text: 'Pierre', isCorrect: false, order: 1 },
      { questionId: fq1.id, text: 'lit', isCorrect: true, order: 2 },
      { questionId: fq1.id, text: 'livre', isCorrect: false, order: 3 },
      { questionId: fq1.id, text: 'passionnant', isCorrect: false, order: 4 }
    ]
  });

  const fq2 = await prisma.question.create({
    data: {
      testId: globalFrenchTest.id,
      question: 'Quels mots sont des noms ?',
      type: 'MULTIPLE_CHOICE',
      points: 4,
      order: 2
    }
  });

  await prisma.option.createMany({
    data: [
      { questionId: fq2.id, text: 'voiture', isCorrect: true, order: 1 },
      { questionId: fq2.id, text: 'courir', isCorrect: false, order: 2 },
      { questionId: fq2.id, text: 'bonheur', isCorrect: true, order: 3 },
      { questionId: fq2.id, text: 'rapidement', isCorrect: false, order: 4 }
    ]
  });

  const fq3 = await prisma.question.create({
    data: {
      testId: globalFrenchTest.id,
      question: 'Quelle phrase est correctement construite ?',
      type: 'SINGLE_CHOICE',
      points: 3,
      order: 3
    }
  });

  await prisma.option.createMany({
    data: [
      { questionId: fq3.id, text: 'mange Le chien.', isCorrect: false, order: 1 },
      { questionId: fq3.id, text: 'Le chien mange.', isCorrect: true, order: 2 },
      { questionId: fq3.id, text: 'chien Le mange.', isCorrect: false, order: 3 },
      { questionId: fq3.id, text: 'mange chien Le.', isCorrect: false, order: 4 }
    ]
  });

  console.log('✅ Contenu français généré');
}

// Exécuter le script
generateCourseContent();