import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Images Unsplash par catégorie
const getUnsplashImageByCategory = (category: string, courseId: string) => {
  const cat = category.toLowerCase();
  
  // Hash simple pour sélectionner une image basée sur l'ID
  const hash = courseId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const imageIndex = Math.abs(hash) % 5;
  
  if (cat.includes('mathématiques') || cat.includes('maths')) {
    const mathImages = [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop'
    ];
    return mathImages[imageIndex];
  } else if (cat.includes('français')) {
    const frenchImages = [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&h=400&fit=crop'
    ];
    return frenchImages[imageIndex];
  } else if (cat.includes('histoire')) {
    const historyImages = [
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop'
    ];
    return historyImages[imageIndex];
  } else if (cat.includes('géographie')) {
    const geographyImages = [
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&h=400&fit=crop'
    ];
    return geographyImages[imageIndex];
  } else if (cat.includes('science')) {
    const scienceImages = [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&h=400&fit=crop'
    ];
    return scienceImages[imageIndex];
  }
  
  // Images par défaut pour autres catégories
  const defaultImages = [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop'
  ];
  return defaultImages[imageIndex];
};

async function updateCoursesImages() {
  try {
    console.log('🔄 Mise à jour des images des cours...');
    
    // Récupérer tous les cours
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        imageUrl: true
      }
    });
    
    console.log(`📚 ${courses.length} cours trouvés`);
    
    let updatedCount = 0;
    
    for (const course of courses) {
      // Générer une nouvelle image Unsplash basée sur la catégorie
      const newImageUrl = getUnsplashImageByCategory(course.category || 'Cours', course.id);
      
      // Mettre à jour le cours
      await prisma.course.update({
        where: { id: course.id },
        data: { imageUrl: newImageUrl }
      });
      
      console.log(`✅ ${course.title}: ${newImageUrl}`);
      updatedCount++;
    }
    
    console.log(`🎉 ${updatedCount} cours mis à jour avec des images Unsplash !`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
updateCoursesImages();