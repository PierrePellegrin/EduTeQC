import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listPackages() {
  try {
    const packages = await prisma.package.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log('📦 PACKAGES EXISTANTS:');
    console.log('======================');
    
    packages.forEach((pkg, index) => {
      console.log(`\n${index + 1}. ${pkg.name}`);
      console.log(`   Description: ${pkg.description}`);
      console.log(`   Image actuelle: ${pkg.imageUrl}`);
      console.log(`   ID: ${pkg.id}`);
    });
    
    console.log(`\n📊 Total: ${packages.length} packages`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listPackages();