import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixGeographyCPImage() {
  try {
    console.log('🔄 Correction de l\'image Géographie CP...');
    
    // Image d'un vrai globe terrestre pour enfants
    const correctGlobeImage = 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop';
    
    // Mettre à jour le package Géographie CP
    await prisma.package.update({
      where: { id: 'c8732128-c066-4078-89b7-713a64861d76' }, // ID du package Géographie CP
      data: { imageUrl: correctGlobeImage }
    });
    
    console.log('✅ Géographie CP mis à jour');
    console.log(`   Nouvelle image: ${correctGlobeImage}`);
    console.log('   Description: Vrai globe terrestre coloré pour enfants');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixGeographyCPImage();