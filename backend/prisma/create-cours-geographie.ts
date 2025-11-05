#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCoursGeographie() {
  console.log('🌍 Création des cours de géographie...');
  
  try {
    // Récupérer tous les niveaux
    const niveaux = await prisma.niveau.findMany({
      orderBy: { order: 'asc' }
    });

    // Cours CP
    const niveauCP = niveaux.find(n => n.name === 'CP');
    if (niveauCP) {
      const coursCP = await prisma.course.create({
        data: {
          title: "Géographie CP - Mon environnement proche",
          description: "Découverte de l'espace proche : maison, école, quartier et paysages pour les 6-7 ans",
          category: 'Géographie',
          niveauId: niveauCP.id,
          order: 4,
          isPublished: true,
          imageUrl: '/images/geographie.jpg'
        }
      });

      const sectionsCP = [
        {
          title: "Ma maison et mon quartier",
          content: `# Ma maison et mon quartier

## Ma maison
### Les pièces de la maison
- La cuisine : pour préparer les repas
- Le salon : pour se reposer et recevoir
- Les chambres : pour dormir
- La salle de bain : pour se laver
- Les toilettes : pour les besoins

### Autour de ma maison
- Le jardin ou la cour
- Le garage ou le parking
- La boîte aux lettres
- Le portail ou la porte d'entrée

## Mon quartier
### Les commerces de proximité
- La boulangerie : pour acheter le pain
- L'épicerie : pour les courses quotidiennes
- La pharmacie : pour les médicaments
- Le bureau de poste : pour envoyer le courrier

### Les services publics
- L'école : pour apprendre
- La mairie : pour les papiers officiels
- La bibliothèque : pour emprunter des livres
- Le commissariat : pour la sécurité

### Les lieux de loisirs
- Le parc : pour jouer et se promener
- Le terrain de sport : pour faire du sport
- La piscine : pour nager
- Le cinéma : pour voir des films

## Se repérer dans l'espace
### Les mots de position
- Devant / Derrière
- À droite / À gauche
- Près de / Loin de
- À côté de / En face de

### Faire un plan simple
- Dessiner ma chambre vue du dessus
- Placer les meubles (lit, bureau, armoire)
- Indiquer la porte et les fenêtres
- Comprendre ce qu'est un plan`
        },
        {
          title: "De la maison à l'école",
          content: `# De la maison à l'école

## Le chemin de l'école
### Mon trajet quotidien
- Le chemin que je prends chaque matin
- Les rues que je traverse
- Les bâtiments que je vois
- Le temps qu'il me faut

### Les moyens de transport
- À pied : marcher sur le trottoir
- En voiture : avec papa ou maman
- En bus : transport en commun
- À vélo : sur les pistes cyclables

### La sécurité routière
- Traverser sur les passages piétons
- Regarder à droite et à gauche
- Respecter les feux tricolores
- Porter des vêtements clairs

## Les différents types de routes
### Dans mon quartier
- Les petites rues : peu de circulation
- Les avenues : plus larges et fréquentées
- Les places : espaces ouverts avec commerces
- Les impasses : rues qui se terminent

### La signalisation
- Les panneaux de circulation
- Les feux de signalisation
- Les passages pour piétons
- Les ralentisseurs

## L'école dans le quartier
### Le bâtiment de l'école
- Les classes et les couloirs
- La cour de récréation
- La cantine et la bibliothèque
- Le bureau du directeur

### Autour de l'école
- Les autres écoles du quartier
- Les services pour les familles
- Les transports scolaires
- Les commerces fréquentés par les parents`
        },
        {
          title: "Les paysages autour de moi",
          content: `# Les paysages autour de moi

## Les différents paysages
### Le paysage urbain
- Les immeubles et les maisons
- Les rues et les avenues
- Les voitures et les bus
- Beaucoup de monde et d'activité

### Le paysage rural
- Les champs et les prairies
- Les fermes et les granges
- Les animaux de la ferme
- Moins de monde, plus de nature

### Le paysage naturel
- Les forêts avec des arbres
- Les rivières et les lacs
- Les montagnes et les collines
- Très peu d'habitations

## Reconnaître mon environnement
### En ville
- Beaucoup de bâtiments serrés
- Des rues avec du goudron
- Des réverbères pour éclairer
- Du bruit et de l'animation

### À la campagne
- Des espaces ouverts et verts
- Des chemins en terre
- Le chant des oiseaux
- Le calme et la tranquillité

### Au bord de l'eau
- Les plages avec du sable
- Les ports avec des bateaux
- Les falaises et les rochers
- L'odeur de la mer

## Les éléments du paysage
### Les éléments naturels
- Les arbres et les fleurs
- Les rochers et les pierres
- L'eau des rivières
- Les nuages dans le ciel

### Les éléments construits par l'homme
- Les maisons et les immeubles
- Les routes et les ponts
- Les usines et les magasins
- Les parcs et les jardins`
        },
        {
          title: "La France, mon pays",
          content: `# La France, mon pays

## Qu'est-ce qu'un pays ?
### La France
- Un territoire avec des frontières
- Des habitants : les Français
- Une langue : le français
- Un gouvernement : le président

### Être français
- Avoir la nationalité française
- Respecter les lois françaises
- Partager la culture française
- Vivre en France ou à l'étranger

## Les symboles de mon pays
### Le drapeau français
- Trois bandes : bleu, blanc, rouge
- On le voit sur les mairies
- Il flotte lors des fêtes nationales
- Symbole de la France dans le monde

### L'hymne national
- La Marseillaise
- On la chante lors des événements importants
- Tous les Français la connaissent
- Elle unit tous les Français

## Paris, la capitale
### Une ville très importante
- C'est là que vit le président
- Beaucoup de monuments célèbres
- La Tour Eiffel, Notre-Dame
- Beaucoup d'habitants et de visiteurs

### Pourquoi c'est la capitale ?
- Le gouvernement y travaille
- Les décisions importantes s'y prennent
- Centre culturel et économique
- Relie toutes les régions de France

## Ma région en France
### Situer ma région
- Dans quelle partie de la France ?
- Quelles sont les régions voisines ?
- Y a-t-il la mer ou les montagnes ?
- Quelles sont les grandes villes ?

### Les spécialités de ma région
- Les plats typiques
- Les monuments célèbres
- Les activités économiques
- Les traditions particulières`
        }
      ];

      for (let i = 0; i < sectionsCP.length; i++) {
        await prisma.courseSection.create({
          data: {
            courseId: coursCP.id,
            title: sectionsCP[i].title,
            content: sectionsCP[i].content,
            order: i + 1,
            isValidatable: true
          }
        });
      }

      console.log(`✅ Cours géographie CP créé avec ${sectionsCP.length} sections`);
    }

    // Cours CE1
    const niveauCE1 = niveaux.find(n => n.name === 'CE1');
    if (niveauCE1) {
      const coursCE1 = await prisma.course.create({
        data: {
          title: "Géographie CE1 - Découvrir la France",
          description: "Les régions de France, les paysages français et les villes importantes pour les 7-8 ans",
          category: 'Géographie',
          niveauId: niveauCE1.id,
          order: 4,
          isPublished: true,
          imageUrl: '/images/geographie.jpg'
        }
      });

      const sectionsCE1 = [
        {
          title: "La carte de France",
          content: `# La carte de France

## Comprendre une carte
### Qu'est-ce qu'une carte ?
- Une représentation de la Terre vue du dessus
- Plus petite que la réalité
- Montre les villes, rivières, montagnes
- Permet de se repérer et de voyager

### Les éléments d'une carte
- L'échelle : rapport avec la réalité
- La légende : explication des symboles
- Les couleurs : chaque couleur a un sens
- L'orientation : le nord en haut

## La forme de la France
### L'hexagone
- La France a six côtés
- On l'appelle "l'Hexagone"
- Forme géométrique reconnaissable
- Facile à dessiner et retenir

### Les frontières
- Frontières naturelles : mer, montagnes, rivières
- Frontières artificielles : tracées par l'homme
- 8 pays voisins de la France
- 3 mers et 1 océan autour

## Les points cardinaux
### S'orienter sur la carte
- Nord : vers le haut de la carte
- Sud : vers le bas de la carte
- Est : à droite de la carte
- Ouest : à gauche de la carte

### Les points intermédiaires
- Nord-Est, Nord-Ouest
- Sud-Est, Sud-Ouest
- Permet d'être plus précis
- Utile pour situer les régions

## Utiliser une carte
### Situer une ville
- Chercher dans la légende
- Utiliser les coordonnées
- Se repérer par rapport aux éléments connus
- Mesurer les distances

### Tracer un itinéraire
- Partir du point de départ
- Suivre les routes sur la carte
- Noter les villes traversées
- Calculer la distance totale`
        },
        {
          title: "Les paysages de France",
          content: `# Les paysages de France

## Les montagnes françaises
### Les Alpes
- Plus hautes montagnes de France
- Mont Blanc : point culminant (4809 m)
- Stations de ski en hiver
- Alpinisme et randonnée en été

### Les Pyrénées
- Frontière naturelle avec l'Espagne
- Moins hautes que les Alpes
- Bergers et leurs troupeaux
- Grottes et gouffres célèbres

### Les autres massifs
- Le Massif central : volcans éteints
- Les Vosges : forêts de sapins
- Le Jura : horlogerie et fromages
- Montagnes plus anciennes et arrondies

## Les plaines et plateaux
### Le Bassin parisien
- Grande plaine autour de Paris
- Terres très fertiles
- Culture des céréales
- Nombreuses villes et villages

### La vallée de la Loire
- Fleuve le plus long de France
- Châteaux de la Renaissance
- Jardins à la française
- "Jardin de la France"

## Les côtes françaises
### La côte atlantique
- Océan Atlantique à l'ouest
- Plages de sable fin
- Ports de pêche importants
- Marées très marquées

### La côte méditerranéenne
- Mer Méditerranée au sud
- Climat chaud et sec
- Plages de galets et calanques
- Peu de marées

### La côte de la Manche
- Mer du Nord et Manche au nord
- Falaises blanches (Étretat)
- Ports de commerce (Calais)
- Climat océanique tempéré

## Les fleuves de France
### Les quatre grands fleuves
- La Seine : traverse Paris
- La Loire : châteaux et vignobles
- La Garonne : vers l'océan Atlantique
- Le Rhône : vers la Méditerranée

### Le Rhin
- Frontière avec l'Allemagne
- Important pour le commerce
- Navigation internationale
- Industries le long du fleuve`
        },
        {
          title: "Les villes importantes de France",
          content: `# Les villes importantes de France

## Paris, la capitale
### Une ville unique
- Plus de 2 millions d'habitants
- Centre politique de la France
- Très nombreux musées
- Monuments célèbres dans le monde

### Les arrondissements
- Paris divisé en 20 arrondissements
- Chacun a son caractère propre
- Numérotés en escargot
- Du 1er (centre) au 20ème (périphérie)

### Les monuments parisiens
- Tour Eiffel : symbole de Paris
- Arc de Triomphe : honore les soldats
- Notre-Dame : cathédrale gothique
- Louvre : plus grand musée du monde

## Les grandes métropoles
### Lyon
- Deuxième ville de France
- Carrefour de communication
- Capitale de la gastronomie
- Industries et universités

### Marseille
- Plus ancien port de France
- Porte de la Méditerranée
- Ville cosmopolite
- Pêche et commerce

### Toulouse
- Ville rose (briques roses)
- Industrie aéronautique (Airbus)
- Université très ancienne
- Proche des Pyrénées

## Les villes de province
### Bordeaux
- Capitale du vin
- Port sur la Garonne
- Architecture du 18ème siècle
- Patrimoine mondial UNESCO

### Lille
- Proche de la Belgique
- Grand centre industriel
- Université et recherche
- TGV vers l'Europe du Nord

### Strasbourg
- Siège du Parlement européen
- Cathédrale gothique célèbre
- Quartier de la Petite France
- Frontière avec l'Allemagne

## Les fonctions des villes
### Centres administratifs
- Préfectures et sous-préfectures
- Services publics concentrés
- Tribunaux et administrations
- Écoles et hôpitaux

### Centres économiques
- Industries et entreprises
- Commerces et services
- Banques et assurances
- Création d'emplois`
        },
        {
          title: "Habiter en France",
          content: `# Habiter en France

## Les types d'habitat
### En ville
- Immeubles et appartements
- Maisons de ville avec jardin
- Résidences avec services
- Habitat dense et vertical

### À la campagne
- Maisons individuelles
- Fermes traditionnelles
- Hameaux et petits villages
- Habitat dispersé

### En banlieue
- Zones résidentielles
- Mélange maisons et immeubles
- Proche des villes
- Jardins et espaces verts

## Les différences régionales
### Le Nord
- Maisons en briques rouges
- Toits pentus pour la pluie
- Chauffage important
- Architecture industrielle

### Le Sud
- Maisons en pierre claire
- Toits de tuiles rouges
- Volets pour le soleil
- Terrasses et patios

### Les montagnes
- Chalets en bois
- Toits très pentus (neige)
- Isolation renforcée
- Orientation au sud

### Les côtes
- Protection du vent et des embruns
- Matériaux résistants
- Vues sur la mer
- Architecture balnéaire

## La vie quotidienne
### Les déplacements
- Transports en commun en ville
- Voiture nécessaire à la campagne
- Vélo pour les courtes distances
- Train pour les longues distances

### Les loisirs
- Parcs et jardins publics
- Centres culturels et sportifs
- Cafés et restaurants
- Cinémas et théâtres

### Les commerces
- Grandes surfaces en périphérie
- Commerces de proximité
- Marchés traditionnels
- Achats par internet

## Les problèmes urbains
### La pollution
- Air pollué par les voitures
- Bruit de la circulation
- Déchets à gérer
- Solutions écologiques

### Le logement
- Prix élevés dans les grandes villes
- Manque de logements sociaux
- Rénovation des quartiers anciens
- Nouveaux écoquartiers`
        }
      ];

      for (let i = 0; i < sectionsCE1.length; i++) {
        await prisma.courseSection.create({
          data: {
            courseId: coursCE1.id,
            title: sectionsCE1[i].title,
            content: sectionsCE1[i].content,
            order: i + 1,
            isValidatable: true
          }
        });
      }

      console.log(`✅ Cours géographie CE1 créé avec ${sectionsCE1.length} sections`);
    }

    // Cours CE2
    const niveauCE2 = niveaux.find(n => n.name === 'CE2');
    if (niveauCE2) {
      const coursCE2 = await prisma.course.create({
        data: {
          title: "Géographie CE2 - La France en Europe et dans le monde",
          description: "L'Europe, les continents, les océans et la place de la France dans le monde pour les 8-9 ans",
          category: 'Géographie',
          niveauId: niveauCE2.id,
          order: 4,
          isPublished: true,
          imageUrl: '/images/geographie.jpg'
        }
      });

      const sectionsCE2 = [
        {
          title: "L'Europe et l'Union européenne",
          content: `# L'Europe et l'Union européenne

## L'Europe, continent de la France
### Qu'est-ce que l'Europe ?
- Un des 7 continents de la Terre
- Environ 50 pays européens
- 750 millions d'habitants
- Berceau de notre civilisation

### Les limites de l'Europe
- Océan Atlantique à l'ouest
- Mer Méditerranée au sud
- Montagnes de l'Oural à l'est
- Océan Arctique au nord

### Les pays voisins de la France
- Espagne et Andorre au sud
- Italie et Monaco au sud-est
- Suisse au sud-est
- Allemagne et Luxembourg à l'est
- Belgique au nord

## L'Union européenne
### Qu'est-ce que l'Union européenne ?
- 27 pays unis pour la paix
- Créée après la Seconde Guerre mondiale
- Libre circulation des personnes
- Monnaie commune : l'euro

### Les symboles européens
- Drapeau : 12 étoiles sur fond bleu
- Hymne : "Ode à la joie" de Beethoven
- Devise : "Unie dans la diversité"
- Fête de l'Europe : 9 mai

### Les institutions européennes
- Parlement européen à Strasbourg
- Commission européenne à Bruxelles
- Cour de justice à Luxembourg
- Banque centrale à Francfort

## La diversité européenne
### Les langues européennes
- Plus de 200 langues parlées
- 24 langues officielles dans l'UE
- Familles de langues différentes
- Richesse culturelle immense

### Les paysages européens
- Fjords de Norvège
- Plaines de Pologne
- Îles grecques
- Volcans d'Islande

### Les cultures européennes
- Traditions différentes
- Cuisines variées
- Fêtes particulières
- Arts et musiques diverses

## Les échanges européens
### Le programme Erasmus
- Étudiants qui voyagent pour étudier
- Découverte d'autres pays
- Apprentissage des langues
- Amitiés européennes

### Le commerce européen
- Libre circulation des marchandises
- Pas de douane entre pays membres
- Normes communes de qualité
- Protection des consommateurs`
        },
        {
          title: "Les continents et les océans",
          content: `# Les continents et les océans

## La planète Terre
### Notre planète bleue
- 3/4 de la surface couverte par l'eau
- 1/4 de terres émergées
- Vue depuis l'espace : planète bleue
- Seule planète connue avec la vie

### Les hémisphères
- Hémisphère Nord et Sud
- Séparés par l'équateur
- Saisons inversées
- Différences de climat

## Les 7 continents
### L'Asie
- Plus grand continent
- Plus de 4 milliards d'habitants
- Chine et Inde : pays les plus peuplés
- Himalaya : plus hautes montagnes

### L'Afrique
- Berceau de l'humanité
- Désert du Sahara
- Animaux sauvages (lions, éléphants)
- Climat très chaud

### L'Amérique du Nord
- États-Unis et Canada
- Gratte-ciel de New York
- Chutes du Niagara
- Grand Canyon

### L'Amérique du Sud
- Forêt amazonienne
- Cordillère des Andes
- Football très populaire
- Carnaval de Rio

### L'Antarctique
- Continent glacé
- Pôle Sud géographique
- Pingouins et phoques
- Recherche scientifique

### L'Océanie
- Australie et îles du Pacifique
- Kangourous et koalas
- Grande Barrière de corail
- Aborigènes d'Australie

## Les 5 océans
### L'océan Pacifique
- Plus grand océan du monde
- Entre Asie et Amérique
- Typhons et tsunamis
- Très profond

### L'océan Atlantique
- Entre Europe-Afrique et Amérique
- Titanic y a fait naufrage
- Courants chauds et froids
- Beaucoup de poissons

### L'océan Indien
- Entre Afrique, Asie et Océanie
- Mousson et cyclones
- Îles paradisiaques
- Épices et parfums

### L'océan Arctique
- Autour du pôle Nord
- Banquise et icebergs
- Ours polaires
- Passage du Nord-Ouest

### L'océan Antarctique
- Autour de l'Antarctique
- Très froid et venteux
- Baleines et phoques
- Icebergs géants

## Situer la France dans le monde
### Position géographique
- Hémisphère Nord
- Continent européen
- Entre océan et mer
- Climat tempéré favorable`
        },
        {
          title: "Les climats du monde",
          content: `# Les climats du monde

## Qu'est-ce que le climat ?
### Différence entre temps et climat
- Le temps : ce qu'il fait aujourd'hui
- Le climat : moyennes sur plusieurs années
- Températures et précipitations
- Varie selon les régions du monde

### Les facteurs du climat
- La latitude : distance de l'équateur
- L'altitude : hauteur des montagnes
- Les océans : influence de l'eau
- Les vents : circulation de l'air

## Les grandes zones climatiques
### Le climat équatorial
- Près de l'équateur
- Chaud et humide toute l'année
- Forêts tropicales denses
- Animaux exotiques nombreux

### Le climat tropical
- Nord et sud de l'équateur
- Saison sèche et saison des pluies
- Savanes avec grands herbivores
- Mousson en Asie

### Le climat désertique
- Très sec toute l'année
- Très chaud le jour, froid la nuit
- Peu de végétation
- Oasis rares et précieuses

### Le climat tempéré
- Quatre saisons marquées
- Températures modérées
- Pluies réparties dans l'année
- France dans cette zone

### Le climat polaire
- Très froid toute l'année
- Peu de précipitations
- Toundra ou glace permanente
- Animaux adaptés au froid

## Le climat de la France
### Un climat tempéré océanique
- Influence de l'océan Atlantique
- Températures douces
- Pluies fréquentes mais modérées
- Quatre saisons distinctes

### Les variations régionales
- Nord : plus frais et humide
- Sud : plus chaud et sec
- Montagnes : plus froid selon l'altitude
- Est : plus continental

### Les saisons en France
- Printemps : réveil de la nature
- Été : chaleur et vacances
- Automne : couleurs et récoltes
- Hiver : froid et parfois neige

## L'influence du climat
### Sur la végétation
- Forêts de feuillus en climat tempéré
- Conifères en montagne
- Maquis méditerranéen au sud
- Cultures selon le climat

### Sur les activités humaines
- Agriculture adaptée au climat
- Vêtements selon les saisons
- Chauffage en hiver
- Tourisme selon les régions`
        },
        {
          title: "Les Français dans le monde",
          content: `# Les Français dans le monde

## L'outre-mer français
### Les départements d'outre-mer (DOM)
- Guadeloupe : Antilles, climat tropical
- Martinique : Antilles, volcans actifs
- Guyane : Amérique du Sud, forêt amazonienne
- La Réunion : océan Indien, île volcanique
- Mayotte : océan Indien, lagon

### Les collectivités d'outre-mer
- Nouvelle-Calédonie : Pacifique, nickel
- Polynésie française : Tahiti et ses îles
- Saint-Pierre-et-Miquelon : près du Canada
- Wallis-et-Futuna : Pacifique
- Saint-Martin et Saint-Barthélemy

### Importance de l'outre-mer
- 2,7 millions de Français
- Ressources naturelles importantes
- Bases militaires stratégiques
- Biodiversité exceptionnelle

## Les Français expatriés
### Pourquoi partir vivre à l'étranger ?
- Travail dans une entreprise internationale
- Études dans une université étrangère
- Mariage avec un étranger
- Recherche d'une meilleure qualité de vie

### Les destinations préférées
- Europe : Royaume-Uni, Allemagne, Espagne
- Amérique du Nord : États-Unis, Canada
- Asie : Singapour, Hong Kong, Japon
- Afrique : Maroc, Sénégal, Côte d'Ivoire

### Maintenir le lien avec la France
- Écoles françaises à l'étranger
- Consulats et ambassades
- Associations de Français
- Cours par correspondance (CNED)

## La francophonie
### Qu'est-ce que la francophonie ?
- Ensemble des pays parlant français
- 300 millions de francophones
- 88 États et gouvernements membres
- Langue officielle dans 29 pays

### Les pays francophones
- Afrique : Sénégal, Mali, Burkina Faso...
- Europe : Belgique, Suisse, Monaco...
- Amérique : Canada (Québec), Haïti...
- Océanie : Vanuatu, Nouvelle-Calédonie...

### Rôle de la France
- Promotion de la langue française
- Coopération culturelle et éducative
- Aide au développement
- Échanges universitaires

## Garder ses racines françaises
### Pour les enfants expatriés
- Apprendre l'histoire de France
- Connaître la géographie française
- Maintenir la langue française
- Comprendre la culture française

### L'école française à l'étranger
- Programmes officiels français
- Professeurs français ou formés en France
- Diplômes reconnus en France
- Retour possible en France facilité`
        }
      ];

      for (let i = 0; i < sectionsCE2.length; i++) {
        await prisma.courseSection.create({
          data: {
            courseId: coursCE2.id,
            title: sectionsCE2[i].title,
            content: sectionsCE2[i].content,
            order: i + 1,
            isValidatable: true
          }
        });
      }

      console.log(`✅ Cours géographie CE2 créé avec ${sectionsCE2.length} sections`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la création des cours de géographie:', error);
    throw error;
  }
}

if (require.main === module) {
  createCoursGeographie()
    .then(() => {
      console.log('🎉 Cours de géographie créés avec succès');
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

export { createCoursGeographie };