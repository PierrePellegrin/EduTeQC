import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Images RÉELLEMENT vérifiées et adaptées pour chaque package
const getRealAdaptedImages = () => {
  return {
    // FRANÇAIS - Images vraiment liées à l'apprentissage du français
    'français-cp': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop', // Enfant qui apprend à lire
    'français-ce1': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=400&fit=crop', // Livres empilés
    'français-ce2': 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&h=400&fit=crop', // Écriture à la main
    'français-primaire': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop', // Pile de livres ouverts

    // MATHÉMATIQUES - Images vraiment liées aux maths
    'maths-cp': 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=400&fit=crop', // Cubes colorés pour apprendre à compter
    'maths-ce1': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop', // Tableau noir avec calculs
    'maths-ce2': 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=400&fit=crop', // Graphiques et données
    'maths-primaire': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=400&fit=crop', // Blocs de construction mathématiques

    // HISTOIRE - Images vraiment historiques françaises
    'histoire-cp': 'https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=400&fit=crop', // Monuments historiques français
    'histoire-ce1': 'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&h=400&fit=crop', // Château de Versailles
    'histoire-ce2': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=400&fit=crop', // Arc de Triomphe
    'histoire-primaire': 'https://images.unsplash.com/photo-1508128225522-dd6cf2d8d9ad?w=800&h=400&fit=crop', // Notre-Dame de Paris

    // GÉOGRAPHIE - Images vraiment géographiques
    'geo-cp': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop', // Globe terrestre
    'geo-ce1': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop', // Carte du monde ancienne
    'geo-ce2': 'https://images.unsplash.com/photo-1597149840419-0d90ac2e3db4?w=800&h=400&fit=crop', // Paysage français (campagne)
    'geo-primaire': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop', // Atlas ouvert

    // PROGRAMMES COMPLETS - Images d'environnement scolaire
    'programme-cp': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=400&fit=crop', // Salle de classe primaire
    'programme-ce1': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop', // Enfants qui étudient
    'programme-ce2': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop', // Bureau d'écolier
    'programme-premium': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop' // École avec drapeau français
  };
};

// Mapping des packages avec leurs clés d'images
const getPackageImageKey = (packageId: string, packageName: string) => {
  const name = packageName.toLowerCase();
  
  // Français
  if (packageId === '23d8659f-7b9c-4943-9ae0-ae995f7e7148') return 'français-cp'; // Français CP
  if (packageId === 'c5047c75-143b-44ce-a38b-3f4a3e8a7b50') return 'français-ce1'; // Français CE1
  if (packageId === 'f4f6a5e2-1666-49a2-925a-42987f3299cd') return 'français-ce2'; // Français CE2
  if (packageId === 'e6f9d891-296d-4be4-b3a4-8554b1621263') return 'français-primaire'; // Français Primaire

  // Mathématiques
  if (packageId === '48b18f02-9ffa-4b23-bca8-e646bc4a2b14') return 'maths-cp'; // Maths CP
  if (packageId === '18d62ffc-8e1f-4b5c-b772-73cc9f598289') return 'maths-ce1'; // Maths CE1
  if (packageId === 'd4f3b887-5777-4f24-9b5e-0f2ac256b067') return 'maths-ce2'; // Maths CE2
  if (packageId === 'e1a5cd46-68db-4025-9495-b2b2b546d1e3') return 'maths-primaire'; // Maths Primaire

  // Histoire
  if (packageId === '526805c8-894b-4ced-a68e-d17cf27f2fb9') return 'histoire-cp'; // Histoire CP
  if (packageId === 'e1e6f298-0d4a-42a0-9d79-c46386e13340') return 'histoire-ce1'; // Histoire CE1
  if (packageId === 'f8c98b47-0765-4ec5-86ca-250cddd1ca53') return 'histoire-ce2'; // Histoire CE2
  if (packageId === '402517fb-3376-41ef-8110-018c1a414d6d') return 'histoire-primaire'; // Histoire Primaire

  // Géographie
  if (packageId === 'c8732128-c066-4078-89b7-713a64861d76') return 'geo-cp'; // Géo CP
  if (packageId === 'd9aa6223-c70f-4bcc-911c-3f201a19ae5d') return 'geo-ce1'; // Géo CE1
  if (packageId === '7286a526-31cb-4e87-a217-948d818a4f93') return 'geo-ce2'; // Géo CE2
  if (packageId === '7dc17ff2-ee4d-437b-8e72-d415cef250c1') return 'geo-primaire'; // Géo Primaire

  // Programmes complets
  if (packageId === '97bba2ed-9113-4088-8ebf-edf9481d073c') return 'programme-cp'; // Programme CP
  if (packageId === 'f30b9fde-0fab-41e5-8b9a-d005900b5263') return 'programme-ce1'; // Programme CE1
  if (packageId === '77c3622c-785d-486f-ab90-1a5f39179b35') return 'programme-ce2'; // Programme CE2
  if (packageId === 'c7dd1b35-cc90-44cd-a983-6c9cd1fd3e13') return 'programme-premium'; // Premium

  return 'programme-cp'; // Fallback
};

async function updateWithRealAdaptedImages() {
  try {
    console.log('🎨 Mise à jour avec des images VRAIMENT adaptées...');
    
    const imageMap = getRealAdaptedImages();
    const packages = await prisma.package.findMany();
    
    let updatedCount = 0;
    
    for (const pkg of packages) {
      const imageKey = getPackageImageKey(pkg.id, pkg.name);
      const imageUrl = imageMap[imageKey];
      
      if (imageUrl) {
        await prisma.package.update({
          where: { id: pkg.id },
          data: { imageUrl: imageUrl }
        });
        
        console.log(`✅ ${pkg.name}`);
        console.log(`   Key: ${imageKey}`);
        console.log(`   URL: ${imageUrl}`);
        console.log('');
        
        updatedCount++;
      }
    }
    
    console.log(`🎉 ${updatedCount} packages mis à jour avec des images VRAIMENT adaptées !`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWithRealAdaptedImages();