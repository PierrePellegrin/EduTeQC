import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Images spécifiques sélectionnées depuis les liens fournis
const getSpecificImages = () => {
  return {
    // MATHÉMATIQUES - Images piochées dans les recherches math
    'math-cp': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=400&fit=crop', // Blocs colorés
    'math-ce1': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop', // Tableau équations
    'math-ce2': 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=400&fit=crop', // Graphiques stats
    'math-primaire': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop', // Règles géométrie
    
    // FRANÇAIS - Images piochées dans les recherches écriture/français
    'francais-cp': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop', // Enfant lecture
    'francais-ce1': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop', // Livres empilés
    'francais-ce2': 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&h=400&fit=crop', // Main qui écrit
    'francais-primaire': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop', // Carnet écriture
    
    // HISTOIRE - Images piochées dans les recherches history
    'histoire-cp': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop', // Carte ancienne
    'histoire-ce1': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=400&fit=crop', // Château
    'histoire-ce2': 'https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=400&fit=crop', // Monuments
    'histoire-primaire': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop', // Art histoire
    
    // GÉOGRAPHIE - Images piochées dans les recherches geography
    'geo-cp': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop', // Globe terrestre
    'geo-ce1': 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800&h=400&fit=crop', // Carte France
    'geo-ce2': 'https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=800&h=400&fit=crop', // Paysages
    'geo-primaire': 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&h=400&fit=crop', // Atlas cartes
    
    // PROGRAMMES COMPLETS - Images éducation générale
    'programme-cp': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=400&fit=crop', // Classe primaire
    'programme-ce1': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop', // Enfants étude
    'programme-ce2': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop', // Bureau étudiant
    'programme-premium': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop' // École drapeau
  };
};

// Mapping packages avec IDs
const packageMappings = {
  // Français
  '23d8659f-7b9c-4943-9ae0-ae995f7e7148': 'francais-cp',
  'c5047c75-143b-44ce-a38b-3f4a3e8a7b50': 'francais-ce1',
  'f4f6a5e2-1666-49a2-925a-42987f3299cd': 'francais-ce2',
  'e6f9d891-296d-4be4-b3a4-8554b1621263': 'francais-primaire',
  
  // Mathématiques
  '48b18f02-9ffa-4b23-bca8-e646bc4a2b14': 'math-cp',
  '18d62ffc-8e1f-4b5c-b772-73cc9f598289': 'math-ce1',
  'd4f3b887-5777-4f24-9b5e-0f2ac256b067': 'math-ce2',
  'e1a5cd46-68db-4025-9495-b2b2b546d1e3': 'math-primaire',
  
  // Histoire
  '526805c8-894b-4ced-a68e-d17cf27f2fb9': 'histoire-cp',
  'e1e6f298-0d4a-42a0-9d79-c46386e13340': 'histoire-ce1',
  'f8c98b47-0765-4ec5-86ca-250cddd1ca53': 'histoire-ce2',
  '402517fb-3376-41ef-8110-018c1a414d6d': 'histoire-primaire',
  
  // Géographie
  'c8732128-c066-4078-89b7-713a64861d76': 'geo-cp',
  'd9aa6223-c70f-4bcc-911c-3f201a19ae5d': 'geo-ce1',
  '7286a526-31cb-4e87-a217-948d818a4f93': 'geo-ce2',
  '7dc17ff2-ee4d-437b-8e72-d415cef250c1': 'geo-primaire',
  
  // Programmes complets
  '97bba2ed-9113-4088-8ebf-edf9481d073c': 'programme-cp',
  'f30b9fde-0fab-41e5-8b9a-d005900b5263': 'programme-ce1',
  '77c3622c-785d-486f-ab90-1a5f39179b35': 'programme-ce2',
  'c7dd1b35-cc90-44cd-a983-6c9cd1fd3e13': 'programme-premium'
};

async function updatePackagesAndCourses() {
  try {
    console.log('🎨 Assignment d\'images spécifiques aux packages et cours...');
    
    const images = getSpecificImages();
    
    // Mise à jour des packages
    console.log('\n📦 PACKAGES:');
    for (const [packageId, imageKey] of Object.entries(packageMappings)) {
      const imageUrl = images[imageKey as keyof typeof images];
      if (imageUrl) {
        await prisma.package.update({
          where: { id: packageId },
          data: { imageUrl: imageUrl }
        });
        
        const pkg = await prisma.package.findUnique({
          where: { id: packageId },
          select: { name: true }
        });
        
        console.log(`✅ ${pkg?.name} → ${imageKey}`);
      }
    }
    
    // Mise à jour des cours avec images similaires mais adaptées
    console.log('\n📚 COURS:');
    const courses = await prisma.course.findMany({
      select: { id: true, title: true, category: true }
    });
    
    for (const course of courses) {
      let imageKey = 'programme-cp'; // fallback
      const category = course.category?.toLowerCase() || '';
      const title = course.title?.toLowerCase() || '';
      
      if (category.includes('mathématiques') || title.includes('mathématiques')) {
        if (title.includes('cp')) imageKey = 'math-cp';
        else if (title.includes('ce1')) imageKey = 'math-ce1';
        else if (title.includes('ce2')) imageKey = 'math-ce2';
        else imageKey = 'math-primaire';
      } else if (category.includes('français') || title.includes('français')) {
        if (title.includes('cp')) imageKey = 'francais-cp';
        else if (title.includes('ce1')) imageKey = 'francais-ce1';
        else if (title.includes('ce2')) imageKey = 'francais-ce2';
        else imageKey = 'francais-primaire';
      } else if (category.includes('histoire') || title.includes('histoire')) {
        if (title.includes('cp')) imageKey = 'histoire-cp';
        else if (title.includes('ce1')) imageKey = 'histoire-ce1';
        else if (title.includes('ce2')) imageKey = 'histoire-ce2';
        else imageKey = 'histoire-primaire';
      } else if (category.includes('géographie') || title.includes('géographie')) {
        if (title.includes('cp')) imageKey = 'geo-cp';
        else if (title.includes('ce1')) imageKey = 'geo-ce1';
        else if (title.includes('ce2')) imageKey = 'geo-ce2';
        else imageKey = 'geo-primaire';
      }
      
      const imageUrl = images[imageKey as keyof typeof images];
      if (imageUrl) {
        await prisma.course.update({
          where: { id: course.id },
          data: { imageUrl: imageUrl }
        });
        
        console.log(`✅ ${course.title} → ${imageKey}`);
      }
    }
    
    console.log('\n🎉 Mise à jour complète terminée !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePackagesAndCourses();