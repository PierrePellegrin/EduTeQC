import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany({
    include: {
      courses: {
        include: {
          course: {
            include: {
              niveau: {
                include: {
                  cycle: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  console.log(`\n📦 LISTE DES ${packages.length} FORFAITS CRÉÉS :\n`);

  // Grouper par type de forfait
  const forfaitsMatierePage = packages.filter(p => 
    p.name.includes('CP') || p.name.includes('CE1') || p.name.includes('CE2')
  );

  const forfaitsMatiereComplete = packages.filter(p => 
    p.name.includes('Primaire') || p.name.includes('Maternelle') || p.name.includes('Collège') || p.name.includes('Lycée')
  );

  const forfaitsParPage = packages.filter(p => 
    p.name.includes('Programme complet')
  );

  const forfaitsPremium = packages.filter(p => 
    p.name.includes('Premium')
  );

  console.log('🎯 FORFAITS PAR MATIÈRE ET NIVEAU :');
  forfaitsMatierePage.forEach(p => {
    console.log(`   • ${p.name} - ${p.price}€ (${p.courses.length} cours)`);
  });

  console.log('\n🎓 FORFAITS PAR MATIÈRE ET CYCLE :');
  forfaitsMatiereComplete.forEach(p => {
    console.log(`   • ${p.name} - ${p.price}€ (${p.courses.length} cours)`);
  });

  console.log('\n📚 FORFAITS PAR NIVEAU :');
  forfaitsParPage.forEach(p => {
    console.log(`   • ${p.name} - ${p.price}€ (${p.courses.length} cours)`);
  });

  console.log('\n💎 FORFAITS PREMIUM :');
  forfaitsPremium.forEach(p => {
    console.log(`   • ${p.name} - ${p.price}€ (${p.courses.length} cours)`);
  });

  console.log(`\n🏆 TOTAL: ${packages.length} forfaits créés`);
  const avgPrice = packages.length > 0 ? (packages.reduce((sum, p) => sum + p.price, 0) / packages.length).toFixed(2) : '0.00';
  console.log(`💰 Prix moyen: ${avgPrice}€`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
