#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function showAdminClientStats() {
  try {
    console.log('📊 STATISTIQUES ACTUELLES DE L\'UTILISATEUR ADMIN\n');

    // Rechercher l'utilisateur Admin
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'ADMIN' },
          { email: { contains: 'admin' } },
          { firstName: { contains: 'Admin' } },
          { lastName: { contains: 'Admin' } }
        ]
      },
      include: {
        purchasedPackages: {
          include: {
            package: {
              select: {
                name: true,
                price: true
              }
            }
          }
        },
        courseProgress: {
          include: {
            course: {
              select: {
                title: true,
                category: true
              }
            }
          }
        },
        sectionProgress: {
          include: {
            section: {
              select: {
                title: true
              }
            }
          }
        },
        testResults: {
          include: {
            test: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });

    if (!adminUser) {
      console.log('❌ Aucun utilisateur Admin trouvé');
      return null;
    }

    console.log(`👤 ${adminUser.firstName} ${adminUser.lastName} (${adminUser.email})`);
    console.log(`🆔 ID: ${adminUser.id}`);
    console.log(`👥 Rôle: ${adminUser.role}\n`);

    // Forfaits achetés
    console.log(`📦 FORFAITS ACHETÉS (${adminUser.purchasedPackages.length}):`);
    if (adminUser.purchasedPackages.length === 0) {
      console.log('   Aucun forfait acheté');
    } else {
      let totalSpent = 0;
      adminUser.purchasedPackages.forEach(up => {
        console.log(`   • ${up.package.name} - ${up.package.price}€`);
        totalSpent += up.package.price;
      });
      console.log(`   💰 Total dépensé: ${totalSpent}€`);
    }

    // Progression des cours
    console.log(`\n📚 PROGRESSION DES COURS (${adminUser.courseProgress.length}):`);
    if (adminUser.courseProgress.length === 0) {
      console.log('   Aucune progression de cours');
    } else {
      adminUser.courseProgress.forEach(cp => {
        console.log(`   • ${cp.course.title} (${cp.course.category}) - ${cp.completionPercent}%`);
      });
    }

    // Progression des sections
    console.log(`\n📄 PROGRESSION DES SECTIONS (${adminUser.sectionProgress.length}):`);
    if (adminUser.sectionProgress.length === 0) {
      console.log('   Aucune progression de section');
    } else {
      const visitedSections = adminUser.sectionProgress.filter(sp => sp.visited).length;
      console.log(`   📈 Sections visitées: ${visitedSections}/${adminUser.sectionProgress.length}`);
      adminUser.sectionProgress.slice(0, 5).forEach(sp => {
        console.log(`   • ${sp.section.title} - ${sp.visited ? '✅ Visitée' : '⏳ Non visitée'}`);
      });
      if (adminUser.sectionProgress.length > 5) {
        console.log(`   ... et ${adminUser.sectionProgress.length - 5} autres`);
      }
    }

    // Résultats de tests
    console.log(`\n🎯 RÉSULTATS DE TESTS (${adminUser.testResults.length}):`);
    if (adminUser.testResults.length === 0) {
      console.log('   Aucun test passé');
    } else {
      const avgScore = adminUser.testResults.reduce((sum, tr) => sum + tr.score, 0) / adminUser.testResults.length;
      console.log(`   📊 Score moyen: ${avgScore.toFixed(1)}%`);
      adminUser.testResults.slice(0, 5).forEach(tr => {
        console.log(`   • ${tr.test.title} - ${tr.score}% (${tr.passed ? '✅ Réussi' : '❌ Échoué'})`);
      });
      if (adminUser.testResults.length > 5) {
        console.log(`   ... et ${adminUser.testResults.length - 5} autres`);
      }
    }

    return adminUser;

  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage des statistiques:', error);
    throw error;
  }
}

async function cleanAdminClientDataWithConfirm() {
  try {
    // Afficher les statistiques actuelles
    const adminUser = await showAdminClientStats();
    
    if (!adminUser) {
      return;
    }

    // Compter le total d'éléments à supprimer
    const totalItems = 
      adminUser.purchasedPackages.length +
      adminUser.courseProgress.length +
      adminUser.sectionProgress.length +
      adminUser.testResults.length;

    if (totalItems === 0) {
      console.log('\n✨ L\'utilisateur Admin n\'a aucune donnée client à supprimer.');
      return;
    }

    console.log(`\n⚠️  ATTENTION: ${totalItems} éléments seront supprimés définitivement !`);
    console.log('🗑️  Suppression en cours...\n');

    // Supprimer les données
    const deletedPackages = await prisma.userPackage.deleteMany({
      where: { userId: adminUser.id }
    });

    const deletedCourseProgress = await prisma.courseProgress.deleteMany({
      where: { userId: adminUser.id }
    });

    const deletedSectionProgress = await prisma.sectionProgress.deleteMany({
      where: { userId: adminUser.id }
    });

    const deletedTestResults = await prisma.testResult.deleteMany({
      where: { userId: adminUser.id }
    });

    console.log('✅ SUPPRESSION TERMINÉE:');
    console.log(`   📦 Forfaits achetés: ${deletedPackages.count}`);
    console.log(`   📚 Progressions de cours: ${deletedCourseProgress.count}`);
    console.log(`   📄 Progressions de sections: ${deletedSectionProgress.count}`);
    console.log(`   🎯 Résultats de tests: ${deletedTestResults.count}`);
    
    console.log('\n🎉 L\'utilisateur Admin peut maintenant utiliser l\'app comme un nouveau client !');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}

async function main() {
  await cleanAdminClientDataWithConfirm();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { showAdminClientStats, cleanAdminClientDataWithConfirm };