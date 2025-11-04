import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkGeneratedContent() {
  console.log('🔍 Vérification du contenu généré...\n');

  try {
    // Récupérer tous les cours avec leurs sections et tests
    const courses = await prisma.course.findMany({
      include: {
        sections: {
          include: {
            children: true,
            tests: {
              include: {
                questions: {
                  include: {
                    options: true
                  }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        tests: {
          include: {
            questions: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });

    for (const course of courses) {
      console.log(`📚 COURS: ${course.title}`);
      console.log(`   Description: ${course.description}`);
      console.log(`   Sections: ${course.sections.length}`);
      console.log(`   Tests globaux: ${course.tests.length}\n`);

      // Afficher les sections principales
      const mainSections = course.sections.filter(s => !s.parentId);
      for (const section of mainSections) {
        console.log(`   📖 ${section.title} ${section.isValidatable ? '✓' : '📁'}`);
        
        // Afficher les sous-sections
        const subSections = course.sections.filter(s => s.parentId === section.id);
        for (const subSection of subSections) {
          console.log(`      📄 ${subSection.title} ${subSection.isValidatable ? '✓' : '📁'}`);
          
          // Afficher les tests de la sous-section
          if (subSection.tests.length > 0) {
            for (const test of subSection.tests) {
              console.log(`         🧪 Test: ${test.title} (${test.questions.length} questions)`);
            }
          }
        }
        
        // Afficher les tests de la section principale
        if (section.tests.length > 0) {
          for (const test of section.tests) {
            console.log(`      🧪 Test: ${test.title} (${test.questions.length} questions)`);
          }
        }
      }

      // Afficher les tests globaux du cours
      if (course.tests.length > 0) {
        console.log(`   🎯 TESTS GLOBAUX:`);
        for (const test of course.tests) {
          console.log(`      🧪 ${test.title} (${test.questions.length} questions, ${test.duration}min)`);
          for (const question of test.questions) {
            console.log(`         ❓ ${question.question} (${question.type}, ${question.points}pts)`);
            for (const option of question.options) {
              console.log(`            ${option.isCorrect ? '✅' : '❌'} ${option.text}`);
            }
          }
        }
      }

      console.log('\n' + '='.repeat(80) + '\n');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkGeneratedContent();