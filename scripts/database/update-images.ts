import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Multiple images variées pour chaque catégorie
const categoryImages: Record<string, string[]> = {
  'Mathématiques': [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&h=400&fit=crop',
  ],
  'Français': [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&h=400&fit=crop',
  ],
  'Histoire': [
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1577017040065-650ee4d43339?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529243856184-fd5465488984?w=800&h=400&fit=crop',
  ],
  'Histoire de France': [
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?w=800&h=400&fit=crop',
  ],
  'Géographie': [
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?w=800&h=400&fit=crop',
  ],
  'Sciences': [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop',
  ],
  'Anglais': [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
  ],
  'Physique': [
    'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611762606988-ee4a279d44e7?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1613963761787-b1a4b5a49f63?w=800&h=400&fit=crop',
  ],
  'Chimie': [
    'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&h=400&fit=crop',
  ],
  'Biologie': [
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=800&h=400&fit=crop',
  ],
  'Informatique': [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  ],
};

// Images par défaut variées
const defaultImages = [
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&h=400&fit=crop',
];

// Compteurs pour varier les images
const categoryCounters: Record<string, number> = {};
let defaultCounter = 0;

// Fonction pour obtenir une image unique pour une catégorie
function getImageForCategory(category: string): string {
  const images = categoryImages[category] || defaultImages;
  
  if (!categoryCounters[category]) {
    categoryCounters[category] = 0;
  }
  
  const imageUrl = images[categoryCounters[category] % images.length];
  categoryCounters[category]++;
  
  return imageUrl;
}

// Fonction pour obtenir une image par défaut unique
function getDefaultImage(): string {
  const imageUrl = defaultImages[defaultCounter % defaultImages.length];
  defaultCounter++;
  return imageUrl;
}

async function updateImages() {
  console.log('🖼️  Mise à jour des images (chaque élément aura une image unique)...\n');

  try {
    // 1. Mettre à jour les images des cours
    console.log('📚 Mise à jour des images de cours...');
    const courses = await prisma.course.findMany({
      select: { id: true, title: true, category: true },
    });

    for (const course of courses) {
      const imageUrl = getImageForCategory(course.category);
      await prisma.course.update({
        where: { id: course.id },
        data: { imageUrl },
      });
      console.log(`  ✓ ${course.title}`);
    }

    console.log(`\n✅ ${courses.length} cours mis à jour avec des images uniques\n`);

    // Réinitialiser les compteurs pour les packages
    Object.keys(categoryCounters).forEach(key => categoryCounters[key] = 0);

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
      const firstCategory = pkg.courses[0]?.course?.category;
      const imageUrl = firstCategory 
        ? getImageForCategory(firstCategory)
        : getDefaultImage();
      
      await prisma.package.update({
        where: { id: pkg.id },
        data: { imageUrl },
      });
      console.log(`  ✓ ${pkg.name}`);
    }

    console.log(`\n✅ ${packages.length} packages mis à jour avec des images uniques\n`);

    // Réinitialiser les compteurs pour les tests
    Object.keys(categoryCounters).forEach(key => categoryCounters[key] = 0);

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
        ? getImageForCategory(test.course.category)
        : getDefaultImage();
      
      await prisma.test.update({
        where: { id: test.id },
        data: { imageUrl },
      });
      console.log(`  ✓ ${test.title}`);
    }

    console.log(`\n✅ ${tests.length} tests mis à jour avec des images uniques\n`);
    console.log('🎉 Toutes les images ont été mises à jour avec succès !');
    console.log('   Chaque cours, package et test a maintenant une image différente.');

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateImages();
