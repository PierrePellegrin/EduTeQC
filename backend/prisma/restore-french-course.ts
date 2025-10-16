import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Recreate French course
  const course = await prisma.course.create({
    data: {
      title: 'Français - Grammaire de Base',
      description: 'Maîtrisez les fondamentaux de la grammaire française',
      category: 'Français',
      content: `# Grammaire Française\n\n## Les Classes de Mots\n\n### Le Nom\nLe nom désigne une personne, un animal, une chose ou une idée.\nExemples: chat, table, liberté, Marie\n\n### Le Verbe\nLe verbe exprime une action ou un état.\nExemples: manger, courir, être, avoir\n\n### L'Adjectif\nL'adjectif qualifie le nom.\nExemples: beau, grand, intelligent, rouge\n\n### Les Déterminants\nLes déterminants accompagnent le nom.\nExemples: le, la, un, une, mon, ta, ce\n\n## Les Temps Verbaux\n\n### Présent\nIl exprime ce qui se passe maintenant.\nExemple: Je mange une pomme.\n\n### Passé composé\nIl exprime une action terminée dans le passé.\nExemple: J'ai mangé une pomme.\n\n### Futur\nIl exprime ce qui va se passer.\nExemple: Je mangerai une pomme.\n\n## La Phrase\n\nUne phrase commence par une majuscule et se termine par un point.\nElle contient au minimum un sujet et un verbe.\n\nExemple: Le chat dort.`,
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
      order: 2,
      isPublished: true,
    },
  });
  console.log('✅ Cours recréé:', course.title);

  // Create test for French course
  const test = await (prisma.test as any).create({
    data: {
      title: 'Quiz - Classes de Mots',
      description: 'Évaluez vos connaissances sur les classes de mots',
      courseId: course.id,
      duration: 10,
      passingScore: 60,
      imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
      isPublished: true,
    },
  });
  console.log('✅ Test recréé:', test.title);

  // Add questions
  await prisma.question.create({
    data: {
      testId: test.id,
      question: 'Dans la phrase "Le chat noir dort", quel est le verbe ?',
      type: 'SINGLE_CHOICE',
      points: 1,
      order: 1,
      options: {
        create: [
          { text: 'chat', isCorrect: false, order: 1 },
          { text: 'noir', isCorrect: false, order: 2 },
          { text: 'dort', isCorrect: true, order: 3 },
          { text: 'le', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      testId: test.id,
      question: 'Quel mot est un adjectif dans cette liste ?',
      type: 'SINGLE_CHOICE',
      points: 1,
      order: 2,
      options: {
        create: [
          { text: 'courir', isCorrect: false, order: 1 },
          { text: 'maison', isCorrect: false, order: 2 },
          { text: 'beau', isCorrect: true, order: 3 },
          { text: 'le', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  console.log('🎉 Restauration terminée.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
