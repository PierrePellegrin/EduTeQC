#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAndPopulateDatabase() {
  console.log('🧹 Nettoyage de la base de données...');
  
  try {
    // Supprimer toutes les données existantes dans l'ordre des dépendances
    await prisma.testResult.deleteMany();
    await prisma.option.deleteMany();
    await prisma.question.deleteMany();
    await prisma.test.deleteMany();
    await prisma.sectionProgress.deleteMany();
    await prisma.courseProgress.deleteMany();
    await prisma.courseSection.deleteMany();
    await prisma.packageCourse.deleteMany();
    await prisma.userPackage.deleteMany();
    await prisma.course.deleteMany();
    await prisma.package.deleteMany();
    await prisma.niveau.deleteMany();
    await prisma.cycle.deleteMany();

    console.log('✅ Base de données nettoyée');

    // Créer la structure des cycles français
    console.log('🏗️ Création de la structure éducative française...');

    // Cycle 1 : École maternelle
    const cycle1 = await prisma.cycle.create({
      data: {
        name: "Cycle 1 - École maternelle",
        order: 1,
      }
    });

    const niveauxCycle1 = await Promise.all([
      prisma.niveau.create({
        data: { name: "Petite Section", cycleId: cycle1.id, order: 1 }
      }),
      prisma.niveau.create({
        data: { name: "Moyenne Section", cycleId: cycle1.id, order: 2 }
      }),
      prisma.niveau.create({
        data: { name: "Grande Section", cycleId: cycle1.id, order: 3 }
      })
    ]);

    // Cycle 2 : Apprentissages fondamentaux
    const cycle2 = await prisma.cycle.create({
      data: {
        name: "Cycle 2 - Apprentissages fondamentaux",
        order: 2,
      }
    });

    const niveauxCycle2 = await Promise.all([
      prisma.niveau.create({
        data: { name: "CP", cycleId: cycle2.id, order: 4 }
      }),
      prisma.niveau.create({
        data: { name: "CE1", cycleId: cycle2.id, order: 5 }
      }),
      prisma.niveau.create({
        data: { name: "CE2", cycleId: cycle2.id, order: 6 }
      })
    ]);

    // Cycle 3 : Consolidation
    const cycle3 = await prisma.cycle.create({
      data: {
        name: "Cycle 3 - Consolidation",
        order: 3,
      }
    });

    const niveauxCycle3 = await Promise.all([
      prisma.niveau.create({
        data: { name: "CM1", cycleId: cycle3.id, order: 7 }
      }),
      prisma.niveau.create({
        data: { name: "CM2", cycleId: cycle3.id, order: 8 }
      }),
      prisma.niveau.create({
        data: { name: "6ème", cycleId: cycle3.id, order: 9 }
      })
    ]);

    // Cycle 4 : Approfondissements
    const cycle4 = await prisma.cycle.create({
      data: {
        name: "Cycle 4 - Approfondissements",
        order: 4,
      }
    });

    const niveauxCycle4 = await Promise.all([
      prisma.niveau.create({
        data: { name: "5ème", cycleId: cycle4.id, order: 10 }
      }),
      prisma.niveau.create({
        data: { name: "4ème", cycleId: cycle4.id, order: 11 }
      }),
      prisma.niveau.create({
        data: { name: "3ème", cycleId: cycle4.id, order: 12 }
      })
    ]);

    // Lycée
    const lycee = await prisma.cycle.create({
      data: {
        name: "Lycée",
        order: 5,
      }
    });

    const niveauxLycee = await Promise.all([
      prisma.niveau.create({
        data: { name: "Seconde", cycleId: lycee.id, order: 13 }
      }),
      prisma.niveau.create({
        data: { name: "Première", cycleId: lycee.id, order: 14 }
      }),
      prisma.niveau.create({
        data: { name: "Terminale", cycleId: lycee.id, order: 15 }
      })
    ]);

    const tousLesNiveaux = [
      ...niveauxCycle1,
      ...niveauxCycle2, 
      ...niveauxCycle3,
      ...niveauxCycle4,
      ...niveauxLycee
    ];

    console.log(`✅ ${tousLesNiveaux.length} niveaux créés`);
    
    // Retourner les niveaux pour la suite
    return {
      cycles: [cycle1, cycle2, cycle3, cycle4, lycee],
      niveaux: tousLesNiveaux
    };

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage/peuplement:', error);
    throw error;
  }
}

if (require.main === module) {
  cleanAndPopulateDatabase()
    .then(() => {
      console.log('🎉 Base de données préparée avec succès');
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

export { cleanAndPopulateDatabase };