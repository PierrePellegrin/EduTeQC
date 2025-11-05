import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Contenu pour les niveaux Seconde et Première
const getMissingContent = () => {
  return {
    'Français Seconde': {
      sections: [
        {
          title: 'Poésie du Moyen Âge au XVIIIe siècle',
          content: 'Évolution de la poésie française.',
          subsections: [
            { title: 'Poésie médiévale', content: 'Chanson de Roland, poésie courtoise.' },
            { title: 'Renaissance', content: 'Ronsard, du Bellay, Pléiade.' },
            { title: 'Classicisme et Lumières', content: 'Boileau, Voltaire, évolution des formes.' }
          ]
        },
        {
          title: 'Littérature d\'idées',
          content: 'Argumentation et pensée critique.',
          subsections: [
            { title: 'Essais de Montaigne', content: 'Humanisme, relativisme, connaissance de soi.' },
            { title: 'Lettres persanes', content: 'Montesquieu, critique sociale, regard de l\'autre.' },
            { title: 'Méthodologie', content: 'Commentaire, dissertation, question de grammaire.' }
          ]
        }
      ]
    },

    'Français Première': {
      sections: [
        {
          title: 'Roman et récit du XVIIIe au XXIe siècle',
          content: 'Évolution du genre romanesque.',
          subsections: [
            { title: 'Roman des Lumières', content: 'Abbé Prévost, Laclos, roman d\'analyse.' },
            { title: 'Réalisme et naturalisme', content: 'Balzac, Zola, représentation du réel.' },
            { title: 'Roman contemporain', content: 'Nouveau roman, littérature francophone.' }
          ]
        },
        {
          title: 'Théâtre du XVIIe au XXIe siècle',
          content: 'Évolution de l\'art théâtral.',
          subsections: [
            { title: 'Théâtre classique', content: 'Racine, Corneille, règles classiques.' },
            { title: 'Drame romantique', content: 'Hugo, renouveau théâtral.' },
            { title: 'Théâtre moderne', content: 'Beckett, Ionesco, théâtre de l\'absurde.' }
          ]
        }
      ]
    },

    'Mathématiques Seconde': {
      sections: [
        {
          title: 'Fonctions',
          content: 'Étude générale des fonctions.',
          subsections: [
            { title: 'Notion de fonction', content: 'Définition, domaine, image, graphique.' },
            { title: 'Fonctions de référence', content: 'Linéaire, affine, carré, inverse.' },
            { title: 'Variations', content: 'Croissance, décroissance, extremums.' }
          ]
        },
        {
          title: 'Géométrie plane',
          content: 'Géométrie analytique et configurations.',
          subsections: [
            { title: 'Repérage', content: 'Coordonnées, distance, milieu.' },
            { title: 'Équations de droites', content: 'Coefficient directeur, équation.' },
            { title: 'Géométrie vectorielle', content: 'Vecteurs, coordonnées, opérations.' }
          ]
        }
      ]
    },

    'Mathématiques Première': {
      sections: [
        {
          title: 'Analyse',
          content: 'Dérivation et applications.',
          subsections: [
            { title: 'Dérivation', content: 'Nombre dérivé, fonction dérivée, tangente.' },
            { title: 'Applications', content: 'Variations, extremums, optimisation.' },
            { title: 'Fonction exponentielle', content: 'Définition, propriétés, équations.' }
          ]
        },
        {
          title: 'Probabilités',
          content: 'Calcul des probabilités.',
          subsections: [
            { title: 'Probabilités conditionnelles', content: 'Définition, formules, indépendance.' },
            { title: 'Variables aléatoires', content: 'Loi binomiale, espérance, variance.' },
            { title: 'Échantillonnage', content: 'Fluctuation, estimation, intervalles.' }
          ]
        }
      ]
    },

    'Histoire Seconde': {
      sections: [
        {
          title: 'Le monde méditerranéen antique',
          content: 'Civilisations antiques du bassin méditerranéen.',
          subsections: [
            { title: 'Citoyenneté grecque', content: 'Athènes, démocratie, exclusions.' },
            { title: 'Citoyenneté romaine', content: 'Empire, droit, intégration.' },
            { title: 'Naissance du christianisme', content: 'Contexte, expansion, persécutions.' }
          ]
        },
        {
          title: 'XVe-XVIe siècles : nouveau monde',
          content: 'Renaissance et grandes découvertes.',
          subsections: [
            { title: 'Humanisme et Renaissance', content: 'Art, sciences, imprimerie.' },
            { title: 'Grandes découvertes', content: 'Explorations, conquêtes, échanges.' },
            { title: 'Réformes religieuses', content: 'Luther, Calvin, Contre-Réforme.' }
          ]
        }
      ]
    },

    'Histoire Première': {
      sections: [
        {
          title: 'Une difficile conquête : voter de 1815 à 1870',
          content: 'Démocratisation de la France au XIXe siècle.',
          subsections: [
            { title: 'Restauration et monarchie', content: 'Charte, suffrage censitaire.' },
            { title: 'Révolutions du XIXe', content: '1830, 1848, République.' },
            { title: 'Second Empire', content: 'Napoléon III, plébiscites, libéralisation.' }
          ]
        },
        {
          title: 'Métropole et colonies',
          content: 'Empire colonial français.',
          subsections: [
            { title: 'Conquête coloniale', content: 'Expansion, motivations, méthodes.' },
            { title: 'Société coloniale', content: 'Administration, mise en valeur.' },
            { title: 'Résistances', content: 'Révoltes, nationalismes, décolonisation.' }
          ]
        }
      ]
    },

    'Géographie Seconde': {
      sections: [
        {
          title: 'Sociétés et environnements',
          content: 'Relations homme-environnement.',
          subsections: [
            { title: 'Changement climatique', content: 'Causes, conséquences, adaptations.' },
            { title: 'Risques naturels', content: 'Vulnérabilité, prévention, gestion.' },
            { title: 'Ressources naturelles', content: 'Exploitation, durabilité, conflits.' }
          ]
        },
        {
          title: 'Territoires, populations et développement',
          content: 'Inégalités spatiales du développement.',
          subsections: [
            { title: 'Développement inégal', content: 'Indicateurs, facteurs, dynamiques.' },
            { title: 'Populations mondiales', content: 'Croissance, transitions, migrations.' },
            { title: 'Villes mondiales', content: 'Urbanisation, métropolisation.' }
          ]
        }
      ]
    },

    'Géographie Première': {
      sections: [
        {
          title: 'La métropolisation en France',
          content: 'Dynamiques urbaines françaises.',
          subsections: [
            { title: 'Paris, métropole mondiale', content: 'Fonctions, rayonnement, défis.' },
            { title: 'Métropoles régionales', content: 'Lyon, Marseille, spécialisations.' },
            { title: 'Villes moyennes', content: 'Rôle, enjeux, politiques.' }
          ]
        },
        {
          title: 'Une diversification des espaces et des acteurs',
          content: 'Nouveaux territoires de production.',
          subsections: [
            { title: 'Espaces productifs', content: 'Industrie, agriculture, services.' },
            { title: 'Reconversions', content: 'Désindustrialisation, innovation.' },
            { title: 'Acteurs', content: 'État, collectivités, entreprises.' }
          ]
        }
      ]
    }
  };
};

async function addMissingContent() {
  try {
    console.log('📚 Ajout du contenu manquant pour Seconde et Première...\n');

    const courseContents: { [key: string]: any } = getMissingContent();

    // Récupérer les cours des niveaux manquants
    const courses = await prisma.course.findMany({
      where: {
        sections: {
          none: {} // Courses sans sections
        }
      },
      include: {
        sections: true,
        niveau: true
      }
    });

    console.log(`📖 ${courses.length} cours sans contenu trouvés\n`);

    let coursesUpdated = 0;

    for (const course of courses) {
      const courseKey = `${course.category} ${course.niveau.name}`;
      const content = courseContents[courseKey];

      if (content) {
        console.log(`📝 Ajout de contenu pour: ${course.title}`);

        let sectionOrder = 1;

        for (const section of content.sections) {
          // Créer la section principale
          const mainSection = await prisma.courseSection.create({
            data: {
              courseId: course.id,
              title: section.title,
              content: section.content,
              isValidatable: false, // Section conteneur
              order: sectionOrder++
            }
          });

          console.log(`  ✅ Section: ${section.title}`);

          // Créer les sous-sections
          if (section.subsections) {
            let subsectionOrder = 1;
            for (const subsection of section.subsections) {
              await prisma.courseSection.create({
                data: {
                  courseId: course.id,
                  parentId: mainSection.id,
                  title: subsection.title,
                  content: subsection.content,
                  isValidatable: true, // Sous-section validable
                  order: subsectionOrder++
                }
              });

              console.log(`    📄 Sous-section: ${subsection.title}`);
            }
          }
        }

        coursesUpdated++;
        console.log(`  🎯 ${content.sections.length} sections ajoutées\n`);
      } else {
        console.log(`⚠️  ${course.title} - Contenu non disponible`);
      }
    }

    console.log(`\n🎉 AJOUT TERMINÉ !`);
    console.log(`📊 ${coursesUpdated} cours mis à jour avec du contenu`);

    // Statistiques finales
    const totalWithContent = await prisma.course.count({
      where: {
        sections: {
          some: {}
        }
      }
    });

    const totalCourses = await prisma.course.count();

    console.log(`📈 ${totalWithContent}/${totalCourses} cours ont maintenant du contenu pédagogique`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingContent();