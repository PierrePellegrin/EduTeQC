import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // Créer un admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eduteqc.com' },
    update: {},
    create: {
      email: 'admin@eduteqc.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'EduTeQC',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin créé:', admin.email);

  // Créer un client test
  const clientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@eduteqc.com' },
    update: {},
    create: {
      email: 'client@eduteqc.com',
      password: clientPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'CLIENT',
    },
  });
  console.log('✅ Client créé:', client.email);

  // Créer des cours
  const mathCourse = await prisma.course.create({
    data: {
      title: 'Mathématiques - Niveau Débutant',
      description: 'Découvrez les bases des mathématiques avec ce cours complet',
      category: 'Mathématiques',
      content: `
# Introduction aux Mathématiques

## Les Nombres

Les nombres sont la base des mathématiques. On distingue plusieurs types :
- **Nombres naturels** : 0, 1, 2, 3...
- **Nombres entiers** : ..., -2, -1, 0, 1, 2...
- **Nombres décimaux** : 3.14, 2.5, 0.75...

## Les Opérations de Base

### Addition (+)
L'addition permet de combiner deux nombres.
Exemple: 5 + 3 = 8

### Soustraction (-)
La soustraction permet de retirer un nombre d'un autre.
Exemple: 10 - 4 = 6

### Multiplication (×)
La multiplication est une addition répétée.
Exemple: 4 × 3 = 12 (c'est-à-dire 4 + 4 + 4)

### Division (÷)
La division permet de partager en parts égales.
Exemple: 12 ÷ 3 = 4

## Exercices Pratiques

Vous pouvez maintenant passer au test pour évaluer vos connaissances !
      `,
      imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800',
      order: 1,
      isPublished: true,
    },
  });
  console.log('✅ Cours créé:', mathCourse.title);

  const frenchCourse = await prisma.course.create({
    data: {
      title: 'Français - Grammaire de Base',
      description: 'Maîtrisez les fondamentaux de la grammaire française',
      category: 'Français',
      content: `
# Grammaire Française

## Les Classes de Mots

### Le Nom
Le nom désigne une personne, un animal, une chose ou une idée.
Exemples: chat, table, liberté, Marie

### Le Verbe
Le verbe exprime une action ou un état.
Exemples: manger, courir, être, avoir

### L'Adjectif
L'adjectif qualifie le nom.
Exemples: beau, grand, intelligent, rouge

### Les Déterminants
Les déterminants accompagnent le nom.
Exemples: le, la, un, une, mon, ta, ce

## Les Temps Verbaux

### Présent
Il exprime ce qui se passe maintenant.
Exemple: Je mange une pomme.

### Passé composé
Il exprime une action terminée dans le passé.
Exemple: J'ai mangé une pomme.

### Futur
Il exprime ce qui va se passer.
Exemple: Je mangerai une pomme.

## La Phrase

Une phrase commence par une majuscule et se termine par un point.
Elle contient au minimum un sujet et un verbe.

Exemple: Le chat dort.
      `,
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
      order: 2,
      isPublished: true,
    },
  });
  console.log('✅ Cours créé:', frenchCourse.title);

  // Créer un test pour le cours de mathématiques
  const mathTest = await prisma.test.create({
    data: {
      title: 'Quiz - Opérations de Base',
      description: 'Testez vos connaissances sur les opérations mathématiques',
      courseId: mathCourse.id,
      duration: 15,
      passingScore: 70,
      isPublished: true,
    },
  });
  console.log('✅ Test créé:', mathTest.title);

  // Créer des questions pour le test de mathématiques
  await prisma.question.create({
    data: {
      testId: mathTest.id,
      question: 'Combien font 15 + 7 ?',
      type: 'SINGLE_CHOICE',
      points: 1,
      order: 1,
      options: {
        create: [
          { text: '20', isCorrect: false, order: 1 },
          { text: '22', isCorrect: true, order: 2 },
          { text: '21', isCorrect: false, order: 3 },
          { text: '23', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      testId: mathTest.id,
      question: 'Quelle est la réponse de 12 × 3 ?',
      type: 'SINGLE_CHOICE',
      points: 1,
      order: 2,
      options: {
        create: [
          { text: '35', isCorrect: false, order: 1 },
          { text: '36', isCorrect: true, order: 2 },
          { text: '34', isCorrect: false, order: 3 },
          { text: '33', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      testId: mathTest.id,
      question: 'Parmi ces opérations, lesquelles donnent 10 ? (Choix multiples)',
      type: 'MULTIPLE_CHOICE',
      points: 2,
      order: 3,
      options: {
        create: [
          { text: '5 + 5', isCorrect: true, order: 1 },
          { text: '20 - 10', isCorrect: true, order: 2 },
          { text: '2 × 5', isCorrect: true, order: 3 },
          { text: '30 ÷ 2', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  console.log('✅ Questions créées pour le test de mathématiques');

  // Créer un test pour le cours de français
  const frenchTest = await prisma.test.create({
    data: {
      title: 'Quiz - Classes de Mots',
      description: 'Évaluez vos connaissances sur les classes de mots',
      courseId: frenchCourse.id,
      duration: 10,
      passingScore: 60,
      isPublished: true,
    },
  });
  console.log('✅ Test créé:', frenchTest.title);

  await prisma.question.create({
    data: {
      testId: frenchTest.id,
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
      testId: frenchTest.id,
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

  console.log('✅ Questions créées pour le test de français');

  console.log('\n🎉 Seed terminé avec succès !');
  console.log('\n📧 Comptes créés:');
  console.log('   Admin: admin@eduteqc.com / admin123');
  console.log('   Client: client@eduteqc.com / client123');

  // Créer un package qui contient les 2 cours
  const starterPackage = await prisma.package.create({
    data: {
      name: 'Pack Découverte',
      description: 'Accédez aux cours de Mathématiques et de Français pour débuter votre apprentissage. Idéal pour les débutants qui souhaitent acquérir les bases essentielles.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800',
      isActive: true,
      courses: {
        create: [
          { courseId: mathCourse.id },
          { courseId: frenchCourse.id },
        ],
      },
    },
    include: {
      courses: {
        include: {
          course: true,
        },
      },
    },
  });
  console.log('✅ Package créé:', starterPackage.name);
  console.log('   Cours inclus:', starterPackage.courses.map(c => c.course.title).join(', '));
}

main()
  .catch((e) => {
    console.error('❌ Erreur durant le seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

