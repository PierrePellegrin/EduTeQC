/**
 * Script de migration des cours existants vers la nouvelle structure avec sections
 * 
 * Ce script :
 * 1. Lit tous les cours existants
 * 2. Pour chaque cours avec du contenu, crée une section "Contenu principal"
 * 3. Migre les tests existants vers les tests globaux du cours
 * 4. Génère un rapport de migration
 * 
 * Usage: npx ts-node ../scripts/database/migrate-to-sections.ts
 * (depuis le dossier backend/)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MigrationReport {
  totalCourses: number;
  migratedCourses: number;
  coursesWithoutContent: number;
  sectionsCreated: number;
  testsProcessed: number;
  errors: Array<{ courseId: string; error: string }>;
}

async function migrateCourseToSections() {
  console.log('🚀 Démarrage de la migration des cours vers les sections...\n');

  const report: MigrationReport = {
    totalCourses: 0,
    migratedCourses: 0,
    coursesWithoutContent: 0,
    sectionsCreated: 0,
    testsProcessed: 0,
    errors: [],
  };

  try {
    // Récupérer tous les cours
    const courses = await prisma.course.findMany({
      include: {
        tests: true,
      },
    });

    report.totalCourses = courses.length;
    console.log(`📚 ${courses.length} cours trouvés\n`);

    // Migrer chaque cours
    for (const course of courses) {
      console.log(`🔄 Traitement du cours: "${course.title}" (${course.id})`);

      try {
        // Vérifier si le cours a déjà des sections
        const existingSections = await prisma.courseSection.findMany({
          where: { courseId: course.id },
        });

        if (existingSections.length > 0) {
          console.log(`   ⏭️  Le cours a déjà ${existingSections.length} section(s), passage au suivant\n`);
          continue;
        }

        // Vérifier si le cours a du contenu
        if (!course.content || course.content.trim() === '') {
          console.log(`   ⚠️  Pas de contenu à migrer\n`);
          report.coursesWithoutContent++;
          continue;
        }

        // Créer une section "Contenu principal" avec le contenu existant
        const mainSection = await prisma.courseSection.create({
          data: {
            courseId: course.id,
            parentId: null,
            title: 'Contenu principal',
            content: course.content,
            order: 0,
          },
        });

        console.log(`   ✅ Section créée: "${mainSection.title}" (${mainSection.id})`);
        report.sectionsCreated++;
        report.migratedCourses++;

        // Traiter les tests existants (les garder comme tests globaux)
        if (course.tests && course.tests.length > 0) {
          console.log(`   📝 ${course.tests.length} test(s) associé(s) au cours (restent globaux)`);
          report.testsProcessed += course.tests.length;
        }

        console.log(`   ✅ Migration réussie\n`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error(`   ❌ Erreur lors de la migration: ${errorMessage}\n`);
        report.errors.push({
          courseId: course.id,
          error: errorMessage,
        });
      }
    }

    // Afficher le rapport final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE MIGRATION');
    console.log('='.repeat(60));
    console.log(`Total de cours:               ${report.totalCourses}`);
    console.log(`Cours migrés avec succès:     ${report.migratedCourses}`);
    console.log(`Cours sans contenu:           ${report.coursesWithoutContent}`);
    console.log(`Sections créées:              ${report.sectionsCreated}`);
    console.log(`Tests traités:                ${report.testsProcessed}`);
    console.log(`Erreurs:                      ${report.errors.length}`);
    console.log('='.repeat(60));

    if (report.errors.length > 0) {
      console.log('\n❌ ERREURS:');
      report.errors.forEach((err, index) => {
        console.log(`${index + 1}. Cours ${err.courseId}: ${err.error}`);
      });
    }

    if (report.migratedCourses === report.totalCourses - report.coursesWithoutContent) {
      console.log('\n✅ Migration terminée avec succès! 🎉');
    } else {
      console.log('\n⚠️  Migration terminée avec des avertissements');
    }

    console.log('\n💡 Prochaines étapes:');
    console.log('1. Vérifier que les sections ont été créées correctement');
    console.log('2. Tester l\'affichage des cours dans l\'application');
    console.log('3. Si tout est OK, supprimer la colonne "content" de la table courses:');
    console.log('   ALTER TABLE "courses" DROP COLUMN "content";\n');

  } catch (error) {
    console.error('❌ Erreur fatale lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateCourseToSections()
  .catch((error) => {
    console.error('💥 Échec de la migration:', error);
    process.exit(1);
  });
