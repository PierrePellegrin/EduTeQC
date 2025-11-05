import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seulement les images VALIDÉES et quelques très évidentes
const getValidatedImages = () => {
  return {
    // Images VALIDÉES par l'utilisateur
    'books-stack': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop', // ✅ Livres empilés
    'math-blackboard': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop', // ✅ Équations tableau
    
    // Images très évidentes (à tester une par une)
    'school-classroom': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop', // Enfants qui étudient
    'writing-hand': 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&h=400&fit=crop', // Main qui écrit
    'school-supplies': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop', // Fournitures scolaires
    
    // Images par défaut très neutres
    'education-neutral': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop' // Image éducation générale
  };
};

async function updateWithOnlyValidatedImages() {
  try {
    console.log('🎯 Mise à jour avec SEULEMENT les images validées...');
    
    const packages = await prisma.package.findMany();
    const imageMap = getValidatedImages();
    
    for (const pkg of packages) {
      let selectedImage = imageMap['education-neutral']; // Par défaut
      
      const name = pkg.name.toLowerCase();
      
      // Assignments très simples avec les images validées
      if (name.includes('français')) {
        selectedImage = imageMap['books-stack']; // ✅ Livres validés
      } else if (name.includes('mathématiques')) {
        selectedImage = imageMap['math-blackboard']; // ✅ Maths validées
      } else if (name.includes('programme complet')) {
        selectedImage = imageMap['school-classroom']; // Enfants qui étudient
      } else if (name.includes('histoire') || name.includes('géographie')) {
        selectedImage = imageMap['school-supplies']; // Fournitures scolaires neutres
      }
      
      await prisma.package.update({
        where: { id: pkg.id },
        data: { imageUrl: selectedImage }
      });
      
      console.log(`✅ ${pkg.name} → Image assignée`);
    }
    
    console.log('\n🎉 Mise à jour terminée avec des images validées uniquement !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWithOnlyValidatedImages();