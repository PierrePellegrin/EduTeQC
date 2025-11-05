#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAdminClientData() {
  try {
    console.log('🧹 Nettoyage des données client de l\'utilisateur Admin...\n');

    // Rechercher l'utilisateur Admin
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'ADMIN' },
          { email: { contains: 'admin' } },
          { firstName: { contains: 'Admin' } },
          { lastName: { contains: 'Admin' } }
        ]
      }
    });

    if (!adminUser) {
      console.log('❌ Aucun utilisateur Admin trouvé');
      return;
    }

    console.log(`👤 Utilisateur Admin trouvé: ${adminUser.firstName} ${adminUser.lastName} (${adminUser.email})`);
    console.log(`🆔 ID: ${adminUser.id}\n`);

    // 1. Supprimer les forfaits achetés
    const deletedPackages = await prisma.userPackage.deleteMany({
      where: { userId: adminUser.id }
    });
    console.log(`📦 Forfaits achetés supprimés: ${deletedPackages.count}`);

    // 2. Supprimer la progression des cours
    const deletedCourseProgress = await prisma.courseProgress.deleteMany({
      where: { userId: adminUser.id }
    });
    console.log(`📚 Progressions de cours supprimées: ${deletedCourseProgress.count}`);

    // 3. Supprimer la progression des sections
    const deletedSectionProgress = await prisma.sectionProgress.deleteMany({
      where: { userId: adminUser.id }
    });
    console.log(`📄 Progressions de sections supprimées: ${deletedSectionProgress.count}`);

    // 4. Supprimer les résultats de tests
    const deletedTestResults = await prisma.testResult.deleteMany({
      where: { userId: adminUser.id }
    });
    console.log(`🎯 Résultats de tests supprimés: ${deletedTestResults.count}`);

    console.log('\n✅ Nettoyage terminé avec succès !');
    console.log('🔄 L\'utilisateur Admin peut maintenant utiliser l\'app comme un nouveau client.');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}

async function main() {
  await cleanAdminClientData();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { cleanAdminClientData };