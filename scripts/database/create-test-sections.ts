import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestSections() {
  console.log('🌱 Création de sections de test...\n');

  try {
    // Récupérer le premier cours
    const course = await prisma.course.findFirst({
      where: { isPublished: true },
    });

    if (!course) {
      console.log('❌ Aucun cours trouvé. Veuillez d\'abord exécuter le seed.');
      return;
    }

    console.log(`📚 Cours trouvé: ${course.title}\n`);

    // Créer des sections racines
    const section1 = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        title: 'Introduction',
        content: `# Bienvenue dans ce cours !

Ce cours vous permettra d'apprendre les bases de manière progressive.

## Objectifs du cours

- Comprendre les concepts fondamentaux
- Pratiquer avec des exemples concrets
- Valider vos acquis avec des tests

## Comment utiliser ce cours ?

Naviguez à travers les différentes sections dans l'ordre. Chaque section contient du contenu théorique et parfois des tests pour valider vos connaissances.`,
        order: 0,
      },
    });
    console.log(`✅ Section créée: ${section1.title}`);

    const section2 = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        title: 'Chapitre 1 - Les bases',
        content: `# Chapitre 1 : Les bases

Dans ce chapitre, nous allons explorer les concepts de base.

## Concepts clés

- Concept A : Description du concept A
- Concept B : Description du concept B  
- Concept C : Description du concept C

## Exemples pratiques

Voici quelques exemples pour mieux comprendre...`,
        order: 1,
      },
    });
    console.log(`✅ Section créée: ${section2.title}`);

    // Créer des sous-sections
    const subsection1 = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        parentId: section2.id,
        title: '1.1 - Premier concept',
        content: `# Premier concept

Détaillons le premier concept important.

## Explication

Le premier concept est fondamental car...

## Exemple

Voici un exemple concret :

\`\`\`
Exemple de code ou de formule
\`\`\``,
        order: 0,
      },
    });
    console.log(`✅ Sous-section créée: ${subsection1.title}`);

    const subsection2 = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        parentId: section2.id,
        title: '1.2 - Deuxième concept',
        content: `# Deuxième concept

Passons maintenant au deuxième concept.

## Points importants

1. Point important numéro 1
2. Point important numéro 2
3. Point important numéro 3

## Application

Pour appliquer ce concept...`,
        order: 1,
      },
    });
    console.log(`✅ Sous-section créée: ${subsection2.title}`);

    // Créer une sous-sous-section
    const subsubsection = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        parentId: subsection2.id,
        title: '1.2.1 - Détail important',
        content: `# Détail important

Ce détail mérite une attention particulière.

## Pourquoi c'est important ?

Parce que cela permet de...

## À retenir

> **Important** : Ce point est essentiel pour la suite !`,
        order: 0,
      },
    });
    console.log(`✅ Sous-sous-section créée: ${subsubsection.title}`);

    const section3 = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        title: 'Chapitre 2 - Approfondissement',
        content: `# Chapitre 2 : Approfondissement

Maintenant que vous maîtrisez les bases, allons plus loin !

## Concepts avancés

Dans ce chapitre, nous verrons :

- Des notions plus complexes
- Des cas d'usage réels
- Des bonnes pratiques`,
        order: 2,
      },
    });
    console.log(`✅ Section créée: ${section3.title}`);

    const section4 = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        title: 'Conclusion',
        content: `# Conclusion

Félicitations ! Vous avez terminé ce cours.

## Ce que vous avez appris

- ✅ Les concepts de base
- ✅ Les applications pratiques
- ✅ Les bonnes pratiques

## Prochaines étapes

Vous pouvez maintenant :

1. Réviser avec les tests
2. Pratiquer avec des exercices
3. Passer au cours suivant

**Bonne continuation ! 🎉**`,
        order: 3,
      },
    });
    console.log(`✅ Section créée: ${section4.title}`);

    console.log(`\n🎉 ${6} sections créées avec succès pour le cours "${course.title}"!`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSections();
