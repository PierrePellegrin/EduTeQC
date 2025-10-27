import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateChapitre1() {
  const result = await prisma.courseSection.update({
    where: { id: 'b8ab5690-dea4-4807-8462-57800ef883a5' }, // ID de Chapitre 1
    data: { isValidatable: true },
  });
  
  console.log('✅ Chapitre 1 - Les bases is now validatable:', result.title);
  
  // Afficher toutes les sections validables
  const validatables = await prisma.courseSection.findMany({
    where: {
      courseId: 'f9a7504f-bb91-4f72-95dc-db574d51fe00',
      isValidatable: true,
    },
    select: { id: true, title: true, parentId: true },
  });
  
  console.log(`\nTotal sections validables: ${validatables.length}`);
  validatables.forEach(s => {
    const depth = s.parentId ? '  → ' : '';
    console.log(`${depth}${s.title}`);
  });
}

updateChapitre1()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
