import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setValidatableFlags() {
  console.log('Mise à jour des flags isValidatable...');

  // Récupérer toutes les sections
  const allSections = await prisma.courseSection.findMany({
    select: { id: true, title: true, parentId: true },
  });

  // Identifier les sections qui ont des enfants
  const parentIds = new Set<string>();
  allSections.forEach((section) => {
    if (section.parentId) {
      parentIds.add(section.parentId);
    }
  });

  console.log(`Total sections: ${allSections.length}`);
  console.log(`Sections avec enfants: ${parentIds.size}`);

  // Par défaut : toutes les sections sont validables
  // SAUF celles qui ont des enfants ET pas de contenu significatif
  // Pour simplifier : on rend non-validables uniquement les sections qui ont des enfants
  
  let updatedCount = 0;
  
  for (const section of allSections) {
    const hasChildren = parentIds.has(section.id);
    
    // Par défaut, on met isValidatable = true pour toutes les feuilles
    // et false pour les parents (conteneurs)
    const isValidatable = !hasChildren;
    
    await prisma.courseSection.update({
      where: { id: section.id },
      data: { isValidatable },
    });
    
    console.log(
      `  ${section.title}: ${hasChildren ? 'PARENT (non validable)' : 'FEUILLE (validable)'}`
    );
    updatedCount++;
  }

  console.log(`\n✅ ${updatedCount} sections mises à jour`);
  console.log('\nNote: Vous pouvez maintenant modifier manuellement isValidatable via l\'admin');
  console.log('      si vous voulez qu\'un parent soit aussi validable.');
}

setValidatableFlags()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
