import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Images par matière et niveau
const getImageBySubjectAndLevel = (subject: string, level: string) => {
  const baseImages = {
    // FRANÇAIS
    'français': {
      'cm1': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop', // Dictionnaire
      'cm2': 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&h=400&fit=crop', // Écriture élégante
      '6ème': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=400&fit=crop', // Livres empilés
      '5ème': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop', // Carnet écriture
      '4ème': 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&h=400&fit=crop', // Main qui écrit
      '3ème': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop', // Pile de livres
      '2nd': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop', // Lecture avancée
      '1ère': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop', // Littérature
      'terminale': 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&h=400&fit=crop' // Analyse littéraire
    },
    // MATHÉMATIQUES
    'mathématiques': {
      'cm1': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop', // Calculs avancés
      'cm2': 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=400&fit=crop', // Graphiques
      '6ème': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop', // Tableau équations
      '5ème': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop', // Géométrie
      '4ème': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=400&fit=crop', // Algèbre
      '3ème': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop', // Maths complexes
      '2nd': 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=400&fit=crop', // Fonctions
      '1ère': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop', // Analyse
      'terminale': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop' // Maths supérieures
    },
    // HISTOIRE
    'histoire': {
      'cm1': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop', // Cartes historiques
      'cm2': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop', // Art historique
      '6ème': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=400&fit=crop', // Château médiéval
      '5ème': 'https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=400&fit=crop', // Monuments
      '4ème': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop', // Renaissance
      '3ème': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop', // Histoire moderne
      '2nd': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=400&fit=crop', // Histoire européenne
      '1ère': 'https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=400&fit=crop', // Histoire contemporaine
      'terminale': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop' // Histoire du monde
    },
    // GÉOGRAPHIE
    'géographie': {
      'cm1': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop', // Cartes géographiques
      'cm2': 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&h=400&fit=crop', // Atlas
      '6ème': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop', // Globe terrestre
      '5ème': 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800&h=400&fit=crop', // Continents
      '4ème': 'https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=800&h=400&fit=crop', // Paysages
      '3ème': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop', // Géographie humaine
      '2nd': 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&h=400&fit=crop', // Géographie mondiale
      '1ère': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop', // Géopolitique
      'terminale': 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800&h=400&fit=crop' // Géographie complexe
    }
  };
  
  return (baseImages as any)[subject]?.[level] || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop';
};

async function createCompleteEducationSystem() {
  try {
    console.log('🚀 Création du système éducatif complet...\n');

    // 0. CRÉATION DES CYCLES ET NIVEAUX D'ABORD
    console.log('🔄 CRÉATION DES CYCLES ET NIVEAUX:');
    
    const cyclesData = [
      { name: 'Primaire', order: 1 },
      { name: 'Collège', order: 2 },
      { name: 'Lycée', order: 3 }
    ];

    const niveauxData = [
      { name: 'CP', cycleName: 'Primaire', order: 1 },
      { name: 'CE1', cycleName: 'Primaire', order: 2 },
      { name: 'CE2', cycleName: 'Primaire', order: 3 },
      { name: 'CM1', cycleName: 'Primaire', order: 4 },
      { name: 'CM2', cycleName: 'Primaire', order: 5 },
      { name: '6ème', cycleName: 'Collège', order: 1 },
      { name: '5ème', cycleName: 'Collège', order: 2 },
      { name: '4ème', cycleName: 'Collège', order: 3 },
      { name: '3ème', cycleName: 'Collège', order: 4 },
      { name: '2nd', cycleName: 'Lycée', order: 1 },
      { name: '1ère', cycleName: 'Lycée', order: 2 },
      { name: 'Terminale', cycleName: 'Lycée', order: 3 }
    ];

    // Créer les cycles
    for (const cycleData of cyclesData) {
      const existingCycle = await prisma.cycle.findUnique({
        where: { name: cycleData.name }
      });
      
      if (!existingCycle) {
        await prisma.cycle.create({
          data: cycleData
        });
        console.log(`✅ Cycle: ${cycleData.name}`);
      }
    }

    // Créer les niveaux
    for (const niveauData of niveauxData) {
      const cycle = await prisma.cycle.findUnique({
        where: { name: niveauData.cycleName }
      });
      
      if (cycle) {
        const existingNiveau = await prisma.niveau.findUnique({
          where: { name: niveauData.name }
        });
        
        if (!existingNiveau) {
          await prisma.niveau.create({
            data: {
              name: niveauData.name,
              cycleId: cycle.id,
              order: niveauData.order
            }
          });
          console.log(`✅ Niveau: ${niveauData.name}`);
        }
      }
    }

    // 1. CRÉATION DES COURS MANQUANTS (CM1 à Terminale)
    console.log('\n📚 AJOUT DES COURS MANQUANTS:');
    
    const subjects = ['Français', 'Mathématiques', 'Histoire', 'Géographie'];
    const levels = [
      { name: 'CM1', description: 'Cours de niveau CM1. Programme français officiel pour les 9-10 ans.' },
      { name: 'CM2', description: 'Cours de niveau CM2. Programme français officiel pour les 10-11 ans.' },
      { name: '6ème', description: 'Cours de niveau 6ème. Programme français officiel pour les 11-12 ans.' },
      { name: '5ème', description: 'Cours de niveau 5ème. Programme français officiel pour les 12-13 ans.' },
      { name: '4ème', description: 'Cours de niveau 4ème. Programme français officiel pour les 13-14 ans.' },
      { name: '3ème', description: 'Cours de niveau 3ème. Programme français officiel pour les 14-15 ans.' },
      { name: '2nd', description: 'Cours de niveau Seconde. Programme français officiel pour les 15-16 ans.' },
      { name: '1ère', description: 'Cours de niveau Première. Programme français officiel pour les 16-17 ans.' },
      { name: 'Terminale', description: 'Cours de niveau Terminale. Programme français officiel pour les 17-18 ans.' }
    ];

    const subjectDescriptions = {
      'Français': {
        'CM1': 'Grammaire, conjugaison et expression écrite',
        'CM2': 'Littérature et rédaction avancée',
        '6ème': 'Initiation à la littérature et grammaire',
        '5ème': 'Littérature médiévale et expression',
        '4ème': 'Littérature classique et argumentation',
        '3ème': 'Littérature moderne et brevet',
        '2nd': 'Littérature et écriture d\'invention',
        '1ère': 'Littérature française et commentaire',
        'Terminale': 'Philosophie du langage et dissertation'
      },
      'Mathématiques': {
        'CM1': 'Fractions et géométrie',
        'CM2': 'Décimaux et mesures',
        '6ème': 'Nombres entiers et géométrie de base',
        '5ème': 'Fractions et proportionnalité',
        '4ème': 'Équations et théorème de Pythagore',
        '3ème': 'Fonctions et trigonométrie',
        '2nd': 'Fonctions et statistiques',
        '1ère': 'Dérivation et probabilités',
        'Terminale': 'Analyse et géométrie dans l\'espace'
      },
      'Histoire': {
        'CM1': 'L\'Antiquité et le Moyen Âge',
        'CM2': 'Les Temps modernes',
        '6ème': 'L\'Orient ancien et la Grèce',
        '5ème': 'Du Moyen Âge aux Temps modernes',
        '4ème': 'XVIIIe et XIXe siècles',
        '3ème': 'Le XXe siècle et le monde actuel',
        '2nd': 'Histoire européenne et mondiale',
        '1ère': 'Histoire contemporaine de la France',
        'Terminale': 'Grandes puissances et conflits'
      },
      'Géographie': {
        'CM1': 'Découvrir les lieux où j\'habite',
        'CM2': 'Communiquer d\'un bout à l\'autre du monde',
        '6ème': 'Habiter une métropole',
        '5ème': 'Géographie du développement',
        '4ème': 'L\'urbanisation du monde',
        '3ème': 'Territoires et mondialisation',
        '2nd': 'Sociétés et environnements',
        '1ère': 'Métropolisation et recomposition',
        'Terminale': 'Géopolitique et géoéconomie'
      }
    };

    for (const subject of subjects) {
      for (const level of levels) {
        const courseTitle = `${subject} ${level.name} - ${(subjectDescriptions as any)[subject][level.name]}`;
        const imageUrl = getImageBySubjectAndLevel(subject.toLowerCase(), level.name.toLowerCase());
        
        // Trouver le niveau dans la base
        const niveau = await prisma.niveau.findUnique({
          where: { name: level.name }
        });
        
        if (niveau) {
          const existingCourse = await prisma.course.findFirst({
            where: {
              title: courseTitle
            }
          });

          if (!existingCourse) {
            await prisma.course.create({
              data: {
                title: courseTitle,
                description: level.description,
                category: subject,
                niveauId: niveau.id,
                imageUrl: imageUrl,
                isPublished: true
              }
            });
            console.log(`✅ ${courseTitle}`);
          }
        }
      }
    }

    // 2. SUPPRESSION DES ANCIENS FORFAITS (CP-CE2 uniquement)
    console.log('\n🗑️ SUPPRESSION DES ANCIENS FORFAITS:');
    const oldPackages = await prisma.package.findMany({
      where: {
        OR: [
          { name: { contains: 'CP' } },
          { name: { contains: 'CE1' } },
          { name: { contains: 'CE2' } },
          { name: { contains: 'CP-CE2' } }
        ]
      }
    });

    for (const pkg of oldPackages) {
      await prisma.package.delete({ where: { id: pkg.id } });
      console.log(`🗑️ Supprimé: ${pkg.name}`);
    }

    // 3. CRÉATION DES NOUVEAUX FORFAITS
    console.log('\n📦 CRÉATION DES NOUVEAUX FORFAITS:');

    const allLevels = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème', '2nd', '1ère', 'Terminale'];
    const cycles = [
      { name: 'Primaire', levels: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], description: 'Cycle primaire complet' },
      { name: 'Collège', levels: ['6ème', '5ème', '4ème', '3ème'], description: 'Cycle collège complet' },
      { name: 'Lycée', levels: ['2nd', '1ère', 'Terminale'], description: 'Cycle lycée complet' }
    ];

    // A. FORFAITS PAR MATIÈRE ET NIVEAU
    console.log('\n📚 Forfaits par matière et niveau:');
    for (const subject of subjects) {
      for (const level of allLevels) {
        const packageName = `${subject} ${level}`;
        const description = `Forfait complet ${subject} niveau ${level}. Contenu adapté au programme officiel français. Parfait pour maintenir le niveau scolaire français à l'étranger.`;
        const imageUrl = getImageBySubjectAndLevel(subject.toLowerCase(), level.toLowerCase());
        
        await prisma.package.create({
          data: {
            name: packageName,
            description: description,
            price: 15.99,
            imageUrl: imageUrl
          }
        });
        console.log(`✅ ${packageName}`);
      }
    }

    // B. FORFAITS PAR MATIÈRE ET CYCLE
    console.log('\n🔄 Forfaits par matière et cycle:');
    for (const subject of subjects) {
      for (const cycle of cycles) {
        const packageName = `${subject} ${cycle.name}`;
        const description = `Forfait complet ${subject} pour tout le ${cycle.name}. ${cycle.levels.length} cours progressifs. Programme français officiel adapté aux expatriés.`;
        const imageUrl = getImageBySubjectAndLevel(subject.toLowerCase(), cycle.levels[0].toLowerCase());
        
        await prisma.package.create({
          data: {
            name: packageName,
            description: description,
            price: cycle.levels.length * 12.99,
            imageUrl: imageUrl
          }
        });
        console.log(`✅ ${packageName} (${cycle.levels.join(', ')})`);
      }
    }

    // C. FORFAITS PAR NIVEAU (toutes matières)
    console.log('\n🎯 Forfaits par niveau (toutes matières):');
    for (const level of allLevels) {
      const packageName = `Programme complet ${level}`;
      const description = `Forfait complet niveau ${level} - Toutes les matières principales. 4 cours (Français, Mathématiques, Histoire, Géographie). Programme français officiel. Idéal pour un suivi complet à l'étranger.`;
      const imageUrl = 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop'; // Image éducation générale
      
      await prisma.package.create({
        data: {
          name: packageName,
          description: description,
          price: 49.99,
          imageUrl: imageUrl
        }
      });
      console.log(`✅ ${packageName}`);
    }

    // D. FORFAITS PREMIUM PAR CYCLE
    console.log('\n⭐ Forfaits Premium par cycle:');
    for (const cycle of cycles) {
      const packageName = `${cycle.name} Complet - Formule Premium`;
      const description = `Forfait premium complet pour tout le ${cycle.name}. Toutes les matières, tous les niveaux. Accompagnement scolaire français complet pour expatriés. Économie maximum avec cette formule tout-en-un.`;
      const imageUrl = 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop'; // École française
      
      await prisma.package.create({
        data: {
          name: packageName,
          description: description,
          price: cycle.levels.length * 39.99,
          imageUrl: imageUrl
        }
      });
      console.log(`✅ ${packageName}`);
    }

    console.log('\n🎉 SYSTÈME ÉDUCATIF COMPLET CRÉÉ !');
    console.log('\n📊 RÉSUMÉ:');
    console.log(`✅ Cours: ${subjects.length * levels.length} nouveaux cours ajoutés`);
    console.log(`✅ Forfaits par matière/niveau: ${subjects.length * allLevels.length} forfaits`);
    console.log(`✅ Forfaits par matière/cycle: ${subjects.length * cycles.length} forfaits`);
    console.log(`✅ Forfaits par niveau: ${allLevels.length} forfaits`);
    console.log(`✅ Forfaits Premium: ${cycles.length} forfaits`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCompleteEducationSystem();