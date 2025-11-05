const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n📊 Vérification des données...\n');

  // Vérifier les cycles et niveaux
  const cycles = await prisma.cycle.findMany({
    include: { niveaux: true },
    orderBy: { order: 'asc' },
  });

  console.log('🔄 CYCLES ET NIVEAUX:');
  cycles.forEach(cycle => {
    console.log(`\n  ${cycle.name} (${cycle.niveaux.length} niveaux):`);
    console.log(`    ${cycle.niveaux.map(n => n.name).join(', ')}`);
  });

  // Vérifier les cours
  const courses = await prisma.course.findMany({
    include: {
      niveau: {
        include: { cycle: true },
      },
      sections: true,
      tests: true,
    },
  });

  console.log('\n\n📚 COURS:');
  courses.forEach(course => {
    console.log(`\n  ${course.title}`);
    console.log(`    Niveau: ${course.niveau.name} (${course.niveau.cycle.name})`);
    console.log(`    Catégorie: ${course.category}`);
    console.log(`    Sections: ${course.sections.length}`);
    console.log(`    Tests: ${course.tests.length}`);
  });

  // Vérifier les packages
  const packages = await prisma.package.findMany({
    include: {
      courses: {
        include: { course: true },
      },
    },
  });

  console.log('\n\n📦 PACKAGES:');
  packages.forEach(pkg => {
    console.log(`\n  ${pkg.name} (${pkg.price}€)`);
    console.log(`    Cours: ${pkg.courses.map(c => c.course.title).join(', ')}`);
  });

  console.log('\n✅ Vérification terminée!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
