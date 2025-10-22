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

  // Créer les cycles et niveaux
  console.log('\n📚 Création des cycles et niveaux...');

  // Cycle Primaire
  const cyclePrimaire = await prisma.cycle.upsert({
    where: { name: 'Primaire' },
    update: {},
    create: {
      name: 'Primaire',
      order: 1,
    },
  });

  const niveauxPrimaire = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];
  for (let i = 0; i < niveauxPrimaire.length; i++) {
    await prisma.niveau.upsert({
      where: { name: niveauxPrimaire[i] },
      update: {},
      create: {
        name: niveauxPrimaire[i],
        cycleId: cyclePrimaire.id,
        order: i + 1,
      },
    });
  }
  console.log('✅ Cycle Primaire créé avec niveaux:', niveauxPrimaire.join(', '));

  // Cycle Collège
  const cycleCollege = await prisma.cycle.upsert({
    where: { name: 'Collège' },
    update: {},
    create: {
      name: 'Collège',
      order: 2,
    },
  });

  const niveauxCollege = ['6ème', '5ème', '4ème', '3ème'];
  for (let i = 0; i < niveauxCollege.length; i++) {
    await prisma.niveau.upsert({
      where: { name: niveauxCollege[i] },
      update: {},
      create: {
        name: niveauxCollege[i],
        cycleId: cycleCollege.id,
        order: i + 1,
      },
    });
  }
  console.log('✅ Cycle Collège créé avec niveaux:', niveauxCollege.join(', '));

  // Cycle Lycée
  const cycleLycee = await prisma.cycle.upsert({
    where: { name: 'Lycée' },
    update: {},
    create: {
      name: 'Lycée',
      order: 3,
    },
  });

  const niveauxLycee = ['2nd', '1ère', 'Terminale'];
  for (let i = 0; i < niveauxLycee.length; i++) {
    await prisma.niveau.upsert({
      where: { name: niveauxLycee[i] },
      update: {},
      create: {
        name: niveauxLycee[i],
        cycleId: cycleLycee.id,
        order: i + 1,
      },
    });
  }
  console.log('✅ Cycle Lycée créé avec niveaux:', niveauxLycee.join(', '));

  // Récupérer un niveau par défaut pour les cours (CE2 pour l'exemple)
  const niveauCE2 = await prisma.niveau.findUnique({
    where: { name: 'CE2' },
  });

  if (!niveauCE2) {
    throw new Error('Niveau CE2 non trouvé');
  }

  // Créer des cours
  console.log('\n📖 Création des cours...');
  const mathCourse = await prisma.course.create({
    data: {
      title: 'Mathématiques - Niveau Débutant',
      description: 'Découvrez les bases des mathématiques avec ce cours complet',
      category: 'Mathématiques',
      niveauId: niveauCE2.id,
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
      niveauId: niveauCE2.id,
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
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
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
      imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
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

