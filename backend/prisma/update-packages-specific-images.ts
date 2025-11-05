import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Images spécifiques et adaptées pour chaque package
const getSpecificUnsplashImage = (packageId: string, packageName: string) => {
  
  // Français spécifique par niveau
  if (packageId === '23d8659f-7b9c-4943-9ae0-ae995f7e7148') { // Français CP
    return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop'; // Enfants qui apprennent à lire
  }
  if (packageId === 'c5047c75-143b-44ce-a38b-3f4a3e8a7b50') { // Français CE1  
    return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop'; // Pile de livres ouverts
  }
  if (packageId === 'f4f6a5e2-1666-49a2-925a-42987f3299cd') { // Français CE2
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'; // Personne qui écrit dans un carnet
  }
  if (packageId === 'e6f9d891-296d-4be4-b3a4-8554b1621263') { // Français Primaire CP-CE2
    return 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop'; // Dictionnaire ouvert
  }

  // Mathématiques spécifique par niveau
  if (packageId === '48b18f02-9ffa-4b23-bca8-e646bc4a2b14') { // Mathématiques CP
    return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=400&fit=crop'; // Blocs de construction colorés pour apprendre les nombres
  }
  if (packageId === '18d62ffc-8e1f-4b5c-b772-73cc9f598289') { // Mathématiques CE1
    return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop'; // Tableau avec équations mathématiques
  }
  if (packageId === 'd4f3b887-5777-4f24-9b5e-0f2ac256b067') { // Mathématiques CE2
    return 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=400&fit=crop'; // Graphiques et statistiques
  }
  if (packageId === 'e1a5cd46-68db-4025-9495-b2b2b546d1e3') { // Mathématiques Primaire CP-CE2
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop'; // Règles et instruments de géométrie
  }

  // Histoire spécifique par niveau  
  if (packageId === '526805c8-894b-4ced-a68e-d17cf27f2fb9') { // Histoire CP
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop'; // Carte ancienne du monde
  }
  if (packageId === 'e1e6f298-0d4a-42a0-9d79-c46386e13340') { // Histoire CE1
    return 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=400&fit=crop'; // Château médiéval français
  }
  if (packageId === 'f8c98b47-0765-4ec5-86ca-250cddd1ca53') { // Histoire CE2
    return 'https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=400&fit=crop'; // Monuments historiques parisiens
  }
  if (packageId === '402517fb-3376-41ef-8110-018c1a414d6d') { // Histoire Primaire CP-CE2
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop'; // Art et culture française
  }

  // Géographie spécifique par niveau
  if (packageId === 'c8732128-c066-4078-89b7-713a64861d76') { // Géographie CP
    return 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop'; // Globe terrestre pour enfants
  }
  if (packageId === 'd9aa6223-c70f-4bcc-911c-3f201a19ae5d') { // Géographie CE1
    return 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800&h=400&fit=crop'; // Carte de France colorée
  }
  if (packageId === '7286a526-31cb-4e87-a217-948d818a4f93') { // Géographie CE2
    return 'https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=800&h=400&fit=crop'; // Paysages français variés
  }
  if (packageId === '7dc17ff2-ee4d-437b-8e72-d415cef250c1') { // Géographie Primaire CP-CE2
    return 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&h=400&fit=crop'; // Atlas et cartes du monde
  }

  // Programmes complets par niveau
  if (packageId === '97bba2ed-9113-4088-8ebf-edf9481d073c') { // Programme complet CP
    return 'https://images.unsplash.com/photo-1622556498246-755f44ca76f3?w=800&h=400&fit=crop'; // Salle de classe primaire avec enfants
  }
  if (packageId === 'f30b9fde-0fab-41e5-8b9a-d005900b5263') { // Programme complet CE1
    return 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop'; // Enfants qui étudient ensemble
  }
  if (packageId === '77c3622c-785d-486f-ab90-1a5f39179b35') { // Programme complet CE2
    return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop'; // Bureau d'étudiant avec matériel scolaire
  }

  // Formule Premium - Cycle 2 complet
  if (packageId === 'c7dd1b35-cc90-44cd-a983-6c9cd1fd3e13') { // Cycle 2 Premium
    return 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop'; // École française traditionnelle avec drapeau
  }

  // Fallback par défaut
  return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop';
};

async function updatePackagesWithSpecificImages() {
  try {
    console.log('🎨 Mise à jour avec des images vraiment adaptées...');
    
    const packages = await prisma.package.findMany({
      select: {
        id: true,
        name: true,
        description: true
      }
    });
    
    let updatedCount = 0;
    
    for (const pkg of packages) {
      const specificImageUrl = getSpecificUnsplashImage(pkg.id, pkg.name);
      
      await prisma.package.update({
        where: { id: pkg.id },
        data: { imageUrl: specificImageUrl }
      });
      
      console.log(`✅ ${pkg.name}`);
      console.log(`   → ${specificImageUrl}`);
      console.log('');
      
      updatedCount++;
    }
    
    console.log(`🎉 ${updatedCount} packages mis à jour avec des images spécifiquement adaptées !`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePackagesWithSpecificImages();