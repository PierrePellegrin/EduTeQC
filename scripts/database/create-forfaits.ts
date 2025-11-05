#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createForfaits() {
  console.log('📦 Création des forfaits...');
  
  try {
    // Récupérer tous les cycles, niveaux et cours
    const cycles = await prisma.cycle.findMany({
      include: {
        niveaux: {
          include: {
            courses: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    const allCourses = await prisma.course.findMany({
      include: {
        niveau: {
          include: {
            cycle: true
          }
        }
      }
    });

    console.log(`📊 Trouvé ${allCourses.length} cours dans ${cycles.length} cycles`);

    // 1. FORFAITS PAR MATIÈRE ET NIVEAU (ex: Mathématiques CP, Français CE1)
    console.log('🎯 Création des forfaits par matière et niveau...');
    
    const matieres = ['Français', 'Mathématiques', 'Histoire', 'Géographie'];
    let forfaitsMatierePage = 0;

    for (const matiere of matieres) {
      const coursMatiere = allCourses.filter(c => c.category === matiere);
      
      for (const cours of coursMatiere) {
        const forfait = await prisma.package.create({
          data: {
            name: `${matiere} ${cours.niveau.name}`,
            description: `Forfait complet ${matiere} niveau ${cours.niveau.name}. Contenu adapté au programme officiel français pour les ${getAgeRange(cours.niveau.name)}. Parfait pour maintenir le niveau scolaire français à l'étranger.`,
            price: getPriceMatierePage(matiere),
            imageUrl: `/images/packages/${matiere.toLowerCase()}-${cours.niveau.name.toLowerCase()}.jpg`,
            isActive: true
          }
        });

        // Associer le cours au forfait
        await prisma.packageCourse.create({
          data: {
            packageId: forfait.id,
            courseId: cours.id
          }
        });

        forfaitsMatierePage++;
      }
    }

    console.log(`✅ ${forfaitsMatierePage} forfaits matière-niveau créés`);

    // 2. FORFAITS PAR MATIÈRE ET CYCLE (ex: Mathématiques Primaire)
    console.log('🎓 Création des forfaits par matière et cycle...');
    
    let forfaitsMatiereComplete = 0;

    for (const matiere of matieres) {
      for (const cycle of cycles) {
        const coursMatiereCycle = allCourses.filter(c => 
          c.category === matiere && c.niveau.cycleId === cycle.id
        );

        if (coursMatiereCycle.length > 0) {
          const forfait = await prisma.package.create({
            data: {
              name: `${matiere} ${getCycleName(cycle.name)}`,
              description: `Forfait complet ${matiere} pour tout le ${cycle.name}. ${coursMatiereCycle.length} cours progressifs du ${coursMatiereCycle[0].niveau.name} au ${coursMatiereCycle[coursMatiereCycle.length - 1].niveau.name}. Programme français officiel adapté aux expatriés.`,
              price: getPriceMatiereComplete(matiere, coursMatiereCycle.length),
              imageUrl: `/images/packages/${matiere.toLowerCase()}-${getCycleName(cycle.name).toLowerCase()}.jpg`,
              isActive: true
            }
          });

          // Associer tous les cours de la matière du cycle
          for (const cours of coursMatiereCycle) {
            await prisma.packageCourse.create({
              data: {
                packageId: forfait.id,
                courseId: cours.id
              }
            });
          }

          forfaitsMatiereComplete++;
        }
      }
    }

    console.log(`✅ ${forfaitsMatiereComplete} forfaits matière-cycle créés`);

    // 3. FORFAITS PAR NIVEAU (ex: Toutes les matières du CP)
    console.log('📚 Création des forfaits par niveau...');
    
    let forfaitsParPage = 0;

    for (const cycle of cycles) {
      for (const niveau of cycle.niveaux) {
        const coursPage = allCourses.filter(c => c.niveauId === niveau.id);
        
        if (coursPage.length > 0) {
          const forfait = await prisma.package.create({
            data: {
              name: `Programme complet ${niveau.name}`,
              description: `Forfait complet niveau ${niveau.name} - Toutes les matières principales. ${coursPage.length} cours (${coursPage.map(c => c.category).join(', ')}). Programme français officiel pour les ${getAgeRange(niveau.name)}. Idéal pour un suivi complet à l'étranger.`,
              price: getPriceNiveauComplet(coursPage.length),
              imageUrl: `/images/packages/niveau-${niveau.name.toLowerCase()}.jpg`,
              isActive: true
            }
          });

          // Associer tous les cours du niveau
          for (const cours of coursPage) {
            await prisma.packageCourse.create({
              data: {
                packageId: forfait.id,
                courseId: cours.id
              }
            });
          }

          forfaitsParPage++;
        }
      }
    }

    console.log(`✅ ${forfaitsParPage} forfaits par niveau créés`);

    // 4. FORFAITS PREMIUM (ex: Tout le primaire, Tout le cycle 2)
    console.log('💎 Création des forfaits premium par cycle...');
    
    let forfaitsPremium = 0;

    for (const cycle of cycles) {
      const coursCycle = allCourses.filter(c => c.niveau.cycleId === cycle.id);
      
      if (coursCycle.length > 0) {
        const forfait = await prisma.package.create({
          data: {
            name: `${cycle.name} - Formule Premium`,
            description: `Forfait premium complet pour tout le ${cycle.name}. ${coursCycle.length} cours dans toutes les matières principales. Accompagnement scolaire français complet pour expatriés. Économie maximum avec cette formule tout-en-un.`,
            price: getPricePremium(coursCycle.length),
            imageUrl: `/images/packages/premium-${getCycleName(cycle.name).toLowerCase()}.jpg`,
            isActive: true
          }
        });

        // Associer tous les cours du cycle
        for (const cours of coursCycle) {
          await prisma.packageCourse.create({
            data: {
              packageId: forfait.id,
              courseId: cours.id
            }
          });
        }

        forfaitsPremium++;
      }
    }

    console.log(`✅ ${forfaitsPremium} forfaits premium créés`);

    // Statistiques finales
    const totalForfaits = forfaitsMatierePage + forfaitsMatiereComplete + forfaitsParPage + forfaitsPremium;
    console.log(`\n🎉 CRÉATION TERMINÉE :`);
    console.log(`📦 ${forfaitsMatierePage} forfaits matière-niveau`);
    console.log(`🎓 ${forfaitsMatiereComplete} forfaits matière-cycle`);
    console.log(`📚 ${forfaitsParPage} forfaits par niveau`);
    console.log(`💎 ${forfaitsPremium} forfaits premium`);
    console.log(`🏆 TOTAL: ${totalForfaits} forfaits créés`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des forfaits:', error);
    throw error;
  }
}

// Fonctions utilitaires pour les prix et descriptions
function getPriceMatierePage(matiere: string): number {
  const basePrices = {
    'Français': 19.99,
    'Mathématiques': 19.99,
    'Histoire': 15.99,
    'Géographie': 15.99
  };
  return basePrices[matiere as keyof typeof basePrices] || 19.99;
}

function getPriceMatiereComplete(matiere: string, nbCours: number): number {
  const pricePerCourse = getPriceMatierePage(matiere);
  const bundleDiscount = 0.25; // 25% de réduction
  return Math.round((pricePerCourse * nbCours * (1 - bundleDiscount)) * 100) / 100;
}

function getPriceNiveauComplet(nbCours: number): number {
  const averagePrice = 18.99;
  const bundleDiscount = 0.20; // 20% de réduction
  return Math.round((averagePrice * nbCours * (1 - bundleDiscount)) * 100) / 100;
}

function getPricePremium(nbCours: number): number {
  const averagePrice = 18.99;
  const premiumDiscount = 0.35; // 35% de réduction
  return Math.round((averagePrice * nbCours * (1 - premiumDiscount)) * 100) / 100;
}

function getCycleName(cycleName: string): string {
  const cycleNames = {
    'Cycle 1 - École maternelle': 'Maternelle',
    'Cycle 2 - Apprentissages fondamentaux': 'Primaire CP-CE2',
    'Cycle 3 - Consolidation': 'Primaire CM1-6ème',
    'Cycle 4 - Approfondissements': 'Collège',
    'Lycée': 'Lycée'
  };
  return cycleNames[cycleName as keyof typeof cycleNames] || cycleName;
}

function getAgeRange(niveauName: string): string {
  const ageRanges = {
    'Petite Section': '3-4 ans',
    'Moyenne Section': '4-5 ans',
    'Grande Section': '5-6 ans',
    'CP': '6-7 ans',
    'CE1': '7-8 ans',
    'CE2': '8-9 ans',
    'CM1': '9-10 ans',
    'CM2': '10-11 ans',
    '6ème': '11-12 ans',
    '5ème': '12-13 ans',
    '4ème': '13-14 ans',
    '3ème': '14-15 ans',
    'Seconde': '15-16 ans',
    'Première': '16-17 ans',
    'Terminale': '17-18 ans'
  };
  return ageRanges[niveauName as keyof typeof ageRanges] || 'âge adapté';
}

if (require.main === module) {
  createForfaits()
    .then(() => {
      console.log('🎉 Forfaits créés avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { createForfaits };