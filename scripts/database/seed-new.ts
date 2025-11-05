import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

// Données pour les cycles
const cycles = [
  { name: 'Primaire', order: 1 },
  { name: 'Collège', order: 2 },
  { name: 'Lycée', order: 3 },
];

// Données pour les niveaux avec leurs cycles
const niveaux = [
  // Primaire
  { name: 'CP', cycleName: 'Primaire', order: 1 },
  { name: 'CE1', cycleName: 'Primaire', order: 2 },
  { name: 'CE2', cycleName: 'Primaire', order: 3 },
  { name: 'CM1', cycleName: 'Primaire', order: 4 },
  { name: 'CM2', cycleName: 'Primaire', order: 5 },
  // Collège
  { name: '6ème', cycleName: 'Collège', order: 6 },
  { name: '5ème', cycleName: 'Collège', order: 7 },
  { name: '4ème', cycleName: 'Collège', order: 8 },
  { name: '3ème', cycleName: 'Collège', order: 9 },
  // Lycée
  { name: '2nd', cycleName: 'Lycée', order: 10 },
  { name: '1ère', cycleName: 'Lycée', order: 11 },
  { name: 'Terminale', cycleName: 'Lycée', order: 12 },
];

// Matières
const matieres = ['Français', 'Mathématiques', 'Histoire de France'];

// Questions génériques pour chaque matière
const questionsParMatiere: Record<string, any[]> = {
  'Français': [
    { question: 'Quelle est la nature du mot "rapidement" ?', options: ['Adverbe', 'Adjectif', 'Nom', 'Verbe'], correct: 0 },
    { question: 'Quel est le pluriel de "cheval" ?', options: ['Chevals', 'Chevaux', 'Chevaus', 'Chevails'], correct: 1 },
    { question: 'Quelle est la fonction du complément d\'objet direct ?', options: ['Complète le verbe', 'Complète le nom', 'Modifie l\'action', 'Indique le lieu'], correct: 0 },
    { question: 'Quel temps est "je mangeais" ?', options: ['Présent', 'Futur', 'Imparfait', 'Passé composé'], correct: 2 },
    { question: 'Quelle est la conjugaison correcte de "aller" au futur ?', options: ['J\'allerai', 'J\'irai', 'Je vais', 'J\'irais'], correct: 1 },
    { question: 'Qu\'est-ce qu\'un antonyme ?', options: ['Un mot de sens opposé', 'Un mot de même sens', 'Un mot de la même famille', 'Un mot sans sens'], correct: 0 },
    { question: 'Quelle est la figure de style dans "Il pleut des cordes" ?', options: ['Métaphore', 'Comparaison', 'Hyperbole', 'Personnification'], correct: 0 },
    { question: 'Comment appelle-t-on un groupe de mots organisé autour d\'un verbe ?', options: ['Groupe nominal', 'Groupe verbal', 'Proposition', 'Phrase'], correct: 1 },
    { question: 'Quel est le féminin de "acteur" ?', options: ['Actrice', 'Acteure', 'Acteuresse', 'Acteuse'], correct: 0 },
    { question: 'Quelle est la voix dans "La souris est mangée par le chat" ?', options: ['Voix active', 'Voix passive', 'Voix pronominale', 'Voix réfléchie'], correct: 1 },
  ],
  'Mathématiques': [
    { question: 'Combien font 7 × 8 ?', options: ['54', '56', '58', '64'], correct: 1 },
    { question: 'Quelle est la valeur de π (arrondi) ?', options: ['3.14', '3.41', '2.14', '4.13'], correct: 0 },
    { question: 'Combien de côtés a un hexagone ?', options: ['5', '6', '7', '8'], correct: 1 },
    { question: 'Quelle est la formule de l\'aire d\'un cercle ?', options: ['πr²', '2πr', 'πd', 'r²'], correct: 0 },
    { question: 'Combien font 15% de 200 ?', options: ['20', '25', '30', '35'], correct: 2 },
    { question: 'Quelle est la racine carrée de 64 ?', options: ['6', '7', '8', '9'], correct: 2 },
    { question: 'Combien de degrés dans un triangle ?', options: ['90', '180', '270', '360'], correct: 1 },
    { question: 'Quelle est la valeur de 2³ ?', options: ['6', '8', '9', '12'], correct: 1 },
    { question: 'Combien font 1/2 + 1/4 ?', options: ['1/6', '2/6', '3/4', '2/4'], correct: 2 },
    { question: 'Quelle est la formule du périmètre d\'un rectangle ?', options: ['L × l', '2(L + l)', 'L + l', '2L × 2l'], correct: 1 },
  ],
  'Histoire de France': [
    { question: 'En quelle année a eu lieu la Révolution française ?', options: ['1789', '1799', '1792', '1804'], correct: 0 },
    { question: 'Qui était le roi pendant la Révolution française ?', options: ['Louis XIV', 'Louis XV', 'Louis XVI', 'Louis XVII'], correct: 2 },
    { question: 'Quel roi a dit "L\'État, c\'est moi" ?', options: ['Louis XIII', 'Louis XIV', 'Louis XV', 'Louis XVI'], correct: 1 },
    { question: 'En quelle année Napoléon est-il devenu empereur ?', options: ['1799', '1802', '1804', '1806'], correct: 2 },
    { question: 'Quelle bataille a marqué la défaite de Napoléon ?', options: ['Austerlitz', 'Waterloo', 'Wagram', 'Iéna'], correct: 1 },
    { question: 'Qui était Jeanne d\'Arc ?', options: ['Une reine', 'Une guerrière', 'Une sainte', 'Toutes ces réponses'], correct: 3 },
    { question: 'Quelle guerre a duré de 1914 à 1918 ?', options: ['Guerre de Cent Ans', 'Première Guerre mondiale', 'Seconde Guerre mondiale', 'Guerre de Trente Ans'], correct: 1 },
    { question: 'Qui a été le premier président de la Ve République ?', options: ['Charles de Gaulle', 'Georges Pompidou', 'François Mitterrand', 'René Coty'], correct: 0 },
    { question: 'En quelle année la France a-t-elle été libérée ?', options: ['1943', '1944', '1945', '1946'], correct: 1 },
    { question: 'Quel événement a marqué le 14 juillet 1789 ?', options: ['Couronnement du roi', 'Prise de la Bastille', 'Déclaration des droits', 'Sacre de Napoléon'], correct: 1 },
  ],
};

async function main() {
  console.log('🌱 Début du seed...\n');

  // 1. Créer les cycles
  console.log('📚 Création des cycles...');
  const cyclesMap = new Map<string, string>();
  
  for (const cycle of cycles) {
    const created = await prisma.cycle.create({
      data: cycle,
    });
    cyclesMap.set(cycle.name, created.id);
    console.log(`  ✓ Cycle créé: ${cycle.name}`);
  }

  // 2. Créer les niveaux
  console.log('\n📖 Création des niveaux...');
  const niveauxMap = new Map<string, string>();
  
  for (const niveau of niveaux) {
    const cycleId = cyclesMap.get(niveau.cycleName);
    if (!cycleId) {
      throw new Error(`Cycle ${niveau.cycleName} non trouvé`);
    }
    
    const created = await prisma.niveau.create({
      data: {
        name: niveau.name,
        cycleId: cycleId,
        order: niveau.order,
      },
    });
    niveauxMap.set(niveau.name, created.id);
    console.log(`  ✓ Niveau créé: ${niveau.name} (${niveau.cycleName})`);
  }

  // 3. Créer les cours pour chaque matière et chaque niveau
  console.log('\n📝 Création des cours...');
  const coursesMap = new Map<string, string[]>(); // matiere -> [courseIds]
  const coursesByNiveau = new Map<string, string[]>(); // niveau -> [courseIds]
  const coursesByCycle = new Map<string, string[]>(); // cycle -> [courseIds]
  const coursesByCycleMatiere = new Map<string, string[]>(); // cycle-matiere -> [courseIds]

  let courseOrder = 0;
  
  for (const matiere of matieres) {
    const matiereCoursesIds: string[] = [];
    
    for (const niveau of niveaux) {
      const niveauId = niveauxMap.get(niveau.name);
      if (!niveauId) continue;

      const course = await prisma.course.create({
        data: {
          title: `${matiere} - ${niveau.name}`,
          description: `Cours de ${matiere} pour le niveau ${niveau.name}`,
          category: matiere,
          niveauId: niveauId,
          content: `# Cours de ${matiere} - ${niveau.name}\n\nCe cours couvre les concepts essentiels de ${matiere} adaptés au niveau ${niveau.name}.\n\n## Objectifs du cours\n\n- Maîtriser les notions fondamentales\n- Développer les compétences pratiques\n- Se préparer aux évaluations\n\n## Contenu\n\nLe cours est structuré en plusieurs chapitres progressifs permettant une acquisition optimale des connaissances.`,
          order: courseOrder++,
          isPublished: true,
        },
      });

      matiereCoursesIds.push(course.id);
      
      // Organiser par niveau
      if (!coursesByNiveau.has(niveau.name)) {
        coursesByNiveau.set(niveau.name, []);
      }
      coursesByNiveau.get(niveau.name)!.push(course.id);

      // Organiser par cycle
      if (!coursesByCycle.has(niveau.cycleName)) {
        coursesByCycle.set(niveau.cycleName, []);
      }
      coursesByCycle.get(niveau.cycleName)!.push(course.id);

      // Organiser par cycle-matiere
      const cycleMatiere = `${niveau.cycleName}-${matiere}`;
      if (!coursesByCycleMatiere.has(cycleMatiere)) {
        coursesByCycleMatiere.set(cycleMatiere, []);
      }
      coursesByCycleMatiere.get(cycleMatiere)!.push(course.id);

      console.log(`  ✓ Cours créé: ${course.title}`);

      // 4. Créer un test avec 10 questions pour chaque cours
      const test = await prisma.test.create({
        data: {
          title: `Test - ${matiere} ${niveau.name}`,
          description: `Évaluation des connaissances en ${matiere} pour le niveau ${niveau.name}`,
          courseId: course.id,
          duration: 30,
          passingScore: 70,
          isPublished: true,
        },
      });

      console.log(`    ✓ Test créé: ${test.title}`);

      // Créer 10 questions pour ce test
      const questions = questionsParMatiere[matiere] || [];
      for (let i = 0; i < 10 && i < questions.length; i++) {
        const questionData = questions[i];
        
        const question = await prisma.question.create({
          data: {
            testId: test.id,
            question: questionData.question,
            type: QuestionType.SINGLE_CHOICE,
            points: 1,
            order: i,
          },
        });

        // Créer les options pour chaque question
        for (let j = 0; j < questionData.options.length; j++) {
          await prisma.option.create({
            data: {
              questionId: question.id,
              text: questionData.options[j],
              isCorrect: j === questionData.correct,
              order: j,
            },
          });
        }
      }
      console.log(`      ✓ 10 questions créées pour le test`);
    }
    
    coursesMap.set(matiere, matiereCoursesIds);
  }

  // 5. Créer les packages
  console.log('\n📦 Création des packages...');

  // Packages par matière
  for (const matiere of matieres) {
    const courseIds = coursesMap.get(matiere) || [];
    const packageData = await prisma.package.create({
      data: {
        name: `Pack ${matiere}`,
        description: `Tous les cours de ${matiere} pour tous les niveaux`,
        price: 49.99,
        isActive: true,
      },
    });

    // Ajouter les cours au package
    for (const courseId of courseIds) {
      await prisma.packageCourse.create({
        data: {
          packageId: packageData.id,
          courseId: courseId,
        },
      });
    }
    console.log(`  ✓ Package créé: ${packageData.name} (${courseIds.length} cours)`);
  }

  // Packages par niveau
  for (const [niveauName, courseIds] of coursesByNiveau.entries()) {
    const packageData = await prisma.package.create({
      data: {
        name: `Pack ${niveauName}`,
        description: `Tous les cours pour le niveau ${niveauName}`,
        price: 29.99,
        isActive: true,
      },
    });

    for (const courseId of courseIds) {
      await prisma.packageCourse.create({
        data: {
          packageId: packageData.id,
          courseId: courseId,
        },
      });
    }
    console.log(`  ✓ Package créé: ${packageData.name} (${courseIds.length} cours)`);
  }

  // Packages par cycle
  for (const [cycleName, courseIds] of coursesByCycle.entries()) {
    const packageData = await prisma.package.create({
      data: {
        name: `Pack ${cycleName}`,
        description: `Tous les cours du cycle ${cycleName}`,
        price: 99.99,
        isActive: true,
      },
    });

    for (const courseId of courseIds) {
      await prisma.packageCourse.create({
        data: {
          packageId: packageData.id,
          courseId: courseId,
        },
      });
    }
    console.log(`  ✓ Package créé: ${packageData.name} (${courseIds.length} cours)`);
  }

  // Packages par cycle et matière
  for (const [cycleMatiere, courseIds] of coursesByCycleMatiere.entries()) {
    const [cycleName, matiere] = cycleMatiere.split('-');
    const packageData = await prisma.package.create({
      data: {
        name: `Pack ${matiere} - ${cycleName}`,
        description: `Tous les cours de ${matiere} pour le cycle ${cycleName}`,
        price: 39.99,
        isActive: true,
      },
    });

    for (const courseId of courseIds) {
      await prisma.packageCourse.create({
        data: {
          packageId: packageData.id,
          courseId: courseId,
        },
      });
    }
    console.log(`  ✓ Package créé: ${packageData.name} (${courseIds.length} cours)`);
  }

  console.log('\n✅ Seed terminé avec succès !');
  
  // Afficher un résumé
  const totalCycles = await prisma.cycle.count();
  const totalNiveaux = await prisma.niveau.count();
  const totalCourses = await prisma.course.count();
  const totalTests = await prisma.test.count();
  const totalQuestions = await prisma.question.count();
  const totalPackages = await prisma.package.count();

  console.log('\n📊 Résumé:');
  console.log(`  - Cycles: ${totalCycles}`);
  console.log(`  - Niveaux: ${totalNiveaux}`);
  console.log(`  - Cours: ${totalCourses}`);
  console.log(`  - Tests: ${totalTests}`);
  console.log(`  - Questions: ${totalQuestions}`);
  console.log(`  - Packages: ${totalPackages}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
