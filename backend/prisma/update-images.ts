import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Images Unsplash de haute qualité pour chaque catégorie
const categoryImages: Record<string, string> = {
  'Mathématiques': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
  'Français': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
  'Histoire': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=400&fit=crop',
  'Géographie': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=400&fit=crop',
  'Sciences': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
  'Anglais': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
  'Physique': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&h=400&fit=crop',
  'Chimie': 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
  'Biologie': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&h=400&fit=crop',
  'Informatique': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
  'Philosophie': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&h=400&fit=crop',
  'Arts': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop',
  'Musique': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=400&fit=crop',
  'EPS': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
  'Économie': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop',
};

// Image par défaut générique
const defaultCourseImage = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=400&fit=crop';
const defaultPackageImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop';
const defaultTestImage = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop';

async function updateImages() {
  console.log('🖼️  Mise à jour des images...\n');

  try {
    // 1. Mettre à jour les images des cours
    console.log('📚 Mise à jour des images de cours...');
    const courses = await prisma.course.findMany({
      select: { id: true, title: true, category: true },
    });

    for (const course of courses) {
      const imageUrl = categoryImages[course.category] || defaultCourseImage;
      await prisma.course.update({
        where: { id: course.id },
        data: { imageUrl },
      });
      console.log(`  ✓ ${course.title} → ${course.category}`);
    }

    console.log(`\n✅ ${courses.length} cours mis à jour\n`);

    // 2. Mettre à jour les images des packages
    console.log('📦 Mise à jour des images de packages...');
    const packages = await prisma.package.findMany({
      select: { 
        id: true, 
        name: true,
        courses: {
          select: {
            course: {
              select: { category: true }
            }
          },
          take: 1
        }
      },
    });

    for (const pkg of packages) {
      // Utiliser la catégorie du premier cours du package, ou image par défaut
      const firstCategory = pkg.courses[0]?.course?.category;
      const imageUrl = firstCategory 
        ? (categoryImages[firstCategory] || defaultPackageImage)
        : defaultPackageImage;
      
      await prisma.package.update({
        where: { id: pkg.id },
        data: { imageUrl },
      });
      console.log(`  ✓ ${pkg.name} → ${firstCategory || 'Défaut'}`);
    }

    console.log(`\n✅ ${packages.length} packages mis à jour\n`);

    // 3. Mettre à jour les images des tests
    console.log('📝 Mise à jour des images de tests...');
    const tests = await prisma.test.findMany({
      select: { 
        id: true, 
        title: true,
        course: {
          select: { category: true }
        }
      },
    });

    for (const test of tests) {
      const imageUrl = test.course?.category 
        ? (categoryImages[test.course.category] || defaultTestImage)
        : defaultTestImage;
      
      await prisma.test.update({
        where: { id: test.id },
        data: { imageUrl },
      });
      console.log(`  ✓ ${test.title} → ${test.course?.category || 'Défaut'}`);
    }

    console.log(`\n✅ ${tests.length} tests mis à jour\n`);
    console.log('🎉 Toutes les images ont été mises à jour avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateImages();
