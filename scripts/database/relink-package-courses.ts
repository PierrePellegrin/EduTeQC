import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find the package (by name or id)
  const pkg = await prisma.package.findFirst({
    where: { name: 'Pack Découverte' },
  });
  if (!pkg) {
    throw new Error('Package not found');
  }

  // Find the two courses
  const math = await prisma.course.findFirst({ where: { title: { contains: 'Mathématiques' } } });
  const french = await prisma.course.findFirst({ where: { title: { contains: 'Français' } } });
  if (!math || !french) {
    throw new Error('One or both courses not found');
  }

  // Remove existing links
  await prisma.packageCourse.deleteMany({ where: { packageId: pkg.id } });

  // Add links
  await prisma.packageCourse.createMany({
    data: [
      { packageId: pkg.id, courseId: math.id },
      { packageId: pkg.id, courseId: french.id },
    ],
  });

  console.log('✅ Les cours ont été ré-associés au package.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
