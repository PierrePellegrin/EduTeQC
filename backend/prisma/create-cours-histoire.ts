#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCoursHistoire() {
  console.log('🏛️ Création des cours d\'histoire...');
  
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
          title: "Histoire CP - Se repérer dans le temps",
          description: "Découverte du temps qui passe, des générations et du passé proche pour les 6-7 ans",
          category: 'Histoire',
          niveauId: niveauCP.id,
          order: 3,
          isPublished: true,
          imageUrl: '/images/histoire.jpg'
        }
      });

      const sectionsCP = [
        {
          title: "Le temps qui passe",
          content: `# Le temps qui passe

## Les moments de la journée
- Le matin : on se lève, on prend le petit-déjeuner
- Le midi : on déjeune, c'est la récréation
- L'après-midi : on travaille, on joue
- Le soir : on dîne, on se couche

## Les jours de la semaine
Lundi - Mardi - Mercredi - Jeudi - Vendredi - Samedi - Dimanche
- Les jours d'école : du lundi au vendredi
- Le week-end : samedi et dimanche

## Les mois et les saisons
### Les 4 saisons
- Printemps : les fleurs poussent (mars, avril, mai)
- Été : il fait chaud (juin, juillet, août)
- Automne : les feuilles tombent (septembre, octobre, novembre)
- Hiver : il fait froid (décembre, janvier, février)

## Hier, aujourd'hui, demain
- Hier : c'était avant, c'est passé
- Aujourd'hui : c'est maintenant, c'est le présent
- Demain : ce sera après, c'est le futur

## Les instruments pour mesurer le temps
- La montre et l'horloge : pour les heures
- Le calendrier : pour les jours et les mois
- Le sablier : pour mesurer des minutes`
        },
        {
          title: "Ma famille et mes ancêtres",
          content: `# Ma famille et mes ancêtres

## Ma famille proche
- Mes parents : papa et maman
- Mes frères et sœurs (si j'en ai)
- Mes grands-parents : papi et mamie

## Les générations
### Mes grands-parents
- Ils sont nés avant mes parents
- Ils étaient enfants il y a longtemps
- Ils peuvent me raconter comment c'était avant

### Mes parents
- Ils sont nés après mes grands-parents
- Ils étaient enfants quand mes grands-parents étaient adultes
- Ils me racontent leur enfance

### Moi
- Je suis né après mes parents
- Je suis l'enfant maintenant
- Plus tard, je serai adulte comme eux

## Les photos de famille
- Les vieilles photos montrent le passé
- On peut voir comment s'habillaient nos grands-parents
- Les objets et les maisons étaient différents

## L'arbre généalogique
C'est comme un arbre qui montre ma famille :
- Les racines : mes arrière-grands-parents
- Le tronc : mes grands-parents
- Les branches : mes parents
- Les feuilles : mes frères, sœurs et moi

## Questions à poser en famille
- Comment viviez-vous quand vous étiez petits ?
- Quels jeux aimiez-vous ?
- Comment était votre école ?
- Aviez-vous la télévision ? Internet ?`
        },
        {
          title: "L'école d'autrefois",
          content: `# L'école d'autrefois

## L'école de mes grands-parents
### La salle de classe
- Tous les élèves dans la même classe
- Des pupitres en bois avec un encrier
- Un grand tableau noir
- Le poêle pour se chauffer

### Les élèves
- Les filles d'un côté, les garçons de l'autre
- Ils portaient une blouse pour protéger leurs vêtements
- Ils étaient très nombreux dans la classe

### L'écriture
- On écrivait avec une plume trempée dans l'encre
- Il fallait faire très attention à ne pas faire de pâtés
- On utilisait un buvard pour sécher l'encre

## L'école de mes parents
### Les années 1980-1990
- Premiers ordinateurs dans les écoles
- Stylos à bille et feutres
- Rétroprojecteurs au lieu du tableau noir
- Walkman et premières consoles de jeux

## Mon école aujourd'hui
### Les différences avec avant
- Tableaux interactifs et ordinateurs
- Tablettes et internet
- Cartables à roulettes
- Récréations avec aires de jeux modernes

## Ce qui ne change pas
- On apprend toujours à lire, écrire et compter
- Les maîtres et maîtresses enseignent
- Les enfants jouent ensemble à la récréation
- On fait des sorties scolaires`
        },
        {
          title: "Les objets du passé et d'aujourd'hui",
          content: `# Les objets du passé et d'aujourd'hui

## Dans la cuisine
### Autrefois
- Cuisinière à bois ou à charbon
- Glacière avec de la glace pour conserver
- Batteur à œufs manuel
- Moulin à café à manivelle

### Aujourd'hui
- Cuisinière électrique ou à gaz
- Réfrigérateur et congélateur
- Robot de cuisine électrique
- Machine à café automatique

## Pour communiquer
### Autrefois
- Lettres envoyées par la poste
- Télégrammes pour les messages urgents
- Téléphone à cadran fixé au mur
- Facteur qui distribuait le courrier

### Aujourd'hui
- Emails et messages instantanés
- Téléphones portables
- Internet et réseaux sociaux
- Visioconférences

## Pour se déplacer
### Autrefois
- Chevaux et charrettes
- Premières voitures sans vitesses
- Trains à vapeur
- Vélos sans vitesses

### Aujourd'hui
- Voitures modernes avec GPS
- Trains à grande vitesse (TGV)
- Avions pour voyager loin
- Vélos électriques

## Les jouets
### Autrefois
- Poupées en porcelaine
- Cerceaux et diabolo
- Billes et osselets
- Jouets en bois fait main

### Aujourd'hui
- Jouets électroniques
- Consoles de jeux vidéo
- Tablettes pour enfants
- Jouets en plastique`
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

      console.log(`✅ Cours histoire CP créé avec ${sectionsCP.length} sections`);
    }

    // Cours CE1
    const niveauCE1 = niveaux.find(n => n.name === 'CE1');
    if (niveauCE1) {
      const coursCE1 = await prisma.course.create({
        data: {
          title: "Histoire CE1 - La France et ses symboles",
          description: "Découverte de la France, de ses symboles républicains et de son patrimoine pour les 7-8 ans",
          category: 'Histoire',
          niveauId: niveauCE1.id,
          order: 3,
          isPublished: true,
          imageUrl: '/images/histoire.jpg'
        }
      });

      const sectionsCE1 = [
        {
          title: "Les symboles de la France",
          content: `# Les symboles de la France

## Le drapeau français
### Les trois couleurs
- Bleu : couleur de Paris et de la royauté
- Blanc : couleur du roi et de la paix
- Rouge : couleur du sang versé pour la liberté

### Histoire du drapeau
- Créé pendant la Révolution française (1789)
- Les trois couleurs représentent la devise française
- On le voit sur tous les bâtiments publics

## L'hymne national : La Marseillaise
### Son histoire
- Écrite en 1792 par Rouget de Lisle
- Chantée par les soldats de Marseille
- Devenue l'hymne national français

### Quand la chante-t-on ?
- Lors des matchs sportifs internationaux
- Pour les cérémonies officielles
- Le 14 juillet, fête nationale

## La devise française
"Liberté, Égalité, Fraternité"
- Liberté : être libre de ses choix
- Égalité : tous égaux devant la loi
- Fraternité : vivre ensemble comme des frères

## Marianne, symbole de la République
- Femme qui représente la France
- Elle porte un bonnet phrygien (bonnet de la liberté)
- On la voit sur les pièces de monnaie et les timbres

## Le coq gaulois
- Animal symbole de la France depuis très longtemps
- Les Gaulois étaient les ancêtres des Français
- On le voit sur les maillots de sport français`
        },
        {
          title: "Les monuments célèbres de France",
          content: `# Les monuments célèbres de France

## À Paris
### La Tour Eiffel
- Construite par Gustave Eiffel en 1889
- Haute de 324 mètres
- Monument le plus visité de France
- Symbole de Paris dans le monde entier

### Notre-Dame de Paris
- Cathédrale construite au Moyen Âge
- Architecture gothique avec ses voûtes
- Célèbre pour ses gargouilles
- Restaurée après l'incendie de 2019

### L'Arc de Triomphe
- Construit par Napoléon Ier
- Honore les soldats français
- Flame du Soldat inconnu
- Point de départ des Champs-Élysées

## En province
### Le château de Versailles
- Résidence des rois de France
- Galerie des Glaces magnifique
- Jardins immenses à la française
- Témoin de l'art de vivre royal

### Le Mont-Saint-Michel
- Abbaye sur un îlot rocheux
- Architecture du Moyen Âge
- Entouré par les marées
- "Merveille de l'Occident"

### Les châteaux de la Loire
- Chambord, Chenonceau, Amboise...
- Résidences royales de la Renaissance
- Architecture élégante et jardins
- Patrimoine artistique français

## Les monuments préhistoriques
### Les menhirs et dolmens
- Pierres dressées par nos ancêtres
- Il y a plus de 4000 ans
- Mystère de leur utilisation
- Principalement en Bretagne`
        },
        {
          title: "Les rois célèbres de France",
          content: `# Les rois célèbres de France

## Charlemagne (742-814)
### L'empereur qui savait tout
- Roi des Francs et empereur
- Créé l'école pour tous les enfants
- Agrandit le royaume de France
- Couronné empereur par le Pape

### Ses réalisations
- Construction d'écoles dans tout l'empire
- Développement de l'écriture caroline
- Protection des arts et des lettres
- Unification de l'Europe de l'Ouest

## Louis XIV, le Roi-Soleil (1638-1715)
### Le roi le plus célèbre
- Régné 72 ans, record mondial !
- Vécut au château de Versailles
- Disait : "L'État, c'est moi"
- Faisait tout tourner autour de lui

### Sa cour à Versailles
- Château somptueux avec 2300 pièces
- Fêtes grandioses tous les soirs
- Étiquette très stricte
- Nobles obligés de vivre à la cour

### Ses guerres et conquêtes
- Agrandit le territoire français
- Guerres contre les pays voisins
- Construction de forteresses (Vauban)
- France très puissante en Europe

## François Ier (1494-1547)
### Le roi de la Renaissance
- Époque de redécouverte des arts
- Invitation d'artistes italiens
- Construction de châteaux magnifiques
- Développement des lettres et des sciences

### Léonard de Vinci en France
- Invité par François Ier
- Vécut ses dernières années en Touraine
- Apporta La Joconde en France
- Influence sur l'art français

## La fin de la royauté
- Louis XVI guillotiné en 1793
- Révolution française (1789)
- Fin de la monarchie absolue
- Naissance de la République`
        },
        {
          title: "La vie au Moyen Âge",
          content: `# La vie au Moyen Âge

## Le château fort
### Architecture défensive
- Murailles épaisses et hautes
- Tours rondes pour surveiller
- Pont-levis et douves pour protéger
- Donjon au centre pour le seigneur

### La vie dans le château
- Le seigneur et sa famille au donjon
- Les soldats dans les tours
- Les servants dans la basse-cour
- Animaux et provisions stockés

## Les chevaliers
### L'armure et les armes
- Armure en métal pour se protéger
- Épée, lance et bouclier
- Casque avec visière
- Cheval de guerre puissant

### Les tournois
- Combats sportifs entre chevaliers
- Joutes à cheval avec des lances
- Fêtes pour impressionner les dames
- Entraînement pour la guerre

### Le code de chevalerie
- Protéger les faibles et les pauvres
- Être loyal envers son seigneur
- Respecter les femmes
- Être généreux et courageux

## Les paysans (serfs)
### Leur travail
- Cultivent les terres du seigneur
- Élèvent les animaux
- Donnent une partie de leur récolte
- Corvées : travail gratuit pour le seigneur

### Leur maison
- Maison simple en bois et torchis
- Une seule pièce pour toute la famille
- Animaux parfois dans la maison
- Cheminée au centre pour cuisiner

## L'Église au Moyen Âge
### Rôle important
- Tous les gens sont chrétiens
- L'Église enseigne et soigne
- Construction de cathédrales
- Pèlerinages vers Saint-Jacques

### Les moines
- Vivent dans des abbayes
- Prient, travaillent et étudient
- Copient les livres à la main
- Conservent le savoir de l'Antiquité`
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

      console.log(`✅ Cours histoire CE1 créé avec ${sectionsCE1.length} sections`);
    }

    // Cours CE2
    const niveauCE2 = niveaux.find(n => n.name === 'CE2');
    if (niveauCE2) {
      const coursCE2 = await prisma.course.create({
        data: {
          title: "Histoire CE2 - De la Préhistoire à l'Antiquité",
          description: "Découverte des premières civilisations, de la Préhistoire aux Gaulois et aux Romains pour les 8-9 ans",
          category: 'Histoire',
          niveauId: niveauCE2.id,
          order: 3,
          isPublished: true,
          imageUrl: '/images/histoire.jpg'
        }
      });

      const sectionsCE2 = [
        {
          title: "La Préhistoire",
          content: `# La Préhistoire

## Les premiers hommes
### L'évolution de l'homme
- Lucy : un des premiers ancêtres (3 millions d'années)
- Homo habilis : premier à fabriquer des outils
- Homo erectus : premier à maîtriser le feu
- Homo sapiens : l'homme moderne (nous !)

### La découverte du feu
- Il y a environ 400 000 ans
- Révolution pour l'humanité
- Cuire la nourriture, se chauffer
- Se protéger des animaux sauvages
- Se réunir autour du foyer

## La vie des hommes préhistoriques
### Les chasseurs-cueilleurs
- Vivent en petits groupes nomades
- Chassent les mammouths, rennes, bisons
- Cueillent fruits, racines, baies
- Pêchent dans les rivières

### Leurs outils
- Pierre taillée : premiers outils
- Silex pour couper et gratter
- Bois et os pour les manches
- Aiguilles en os pour coudre

### Leurs abris
- Grottes naturelles
- Huttes en peaux et branchages
- Campements temporaires
- Près des points d'eau

## L'art préhistorique
### Les peintures rupestres
- Dessins sur les parois des grottes
- Animaux : chevaux, bisons, cerfs
- Mains négatives au pochoir
- Grotte de Lascaux en Dordogne

### Les objets d'art
- Vénus de Willendorf (statuettes)
- Bijoux en os et coquillages
- Instruments de musique primitifs
- Premiers objets décoratifs

## La révolution néolithique
### L'invention de l'agriculture
- Il y a 10 000 ans environ
- Domestication des animaux
- Culture des céréales
- Sédentarisation des humains

### Les premiers villages
- Maisons en dur (pierre, brique)
- Greniers pour stocker les récoltes
- Artisanat spécialisé
- Invention de la poterie`
        },
        {
          title: "L'Antiquité : l'Égypte",
          content: `# L'Égypte antique

## Le pharaon et sa civilisation
### Le pharaon, roi-dieu
- Chef politique et religieux
- Considéré comme un dieu vivant
- Porte la couronne et le sceptre
- Garant de l'ordre dans le royaume

### Les dynasties célèbres
- Ramsès II : grand conquérant
- Toutânkhamon : pharaon enfant
- Cléopâtre : dernière reine d'Égypte
- Règnes qui durent des siècles

## Les pyramides et l'au-delà
### Construction des pyramides
- Tombeaux des pharaons
- Grandes pyramides de Gizeh
- Millions de blocs de pierre
- Travail de milliers d'ouvriers

### La momification
- Conservation du corps pour l'éternité
- Processus de 70 jours
- Bandelettes et sarcophages
- Objets funéraires pour l'au-delà

### Le livre des morts
- Guide pour l'âme du défunt
- Épreuves dans l'au-delà
- Pesée du cœur contre une plume
- Vie éternelle si le cœur est pur

## La société égyptienne
### La hiérarchie sociale
- Pharaon au sommet
- Prêtres et nobles
- Scribes et artisans
- Paysans et esclaves

### Les scribes
- Savent lire et écrire
- Très respectés dans la société
- Gèrent l'administration
- Utilisent les hiéroglyphes

## Le Nil, fleuve de vie
### Importance du Nil
- Seule source d'eau du pays
- Crues annuelles fertilisent la terre
- Transport des marchandises
- "Don du Nil" selon Hérodote

### L'agriculture
- Blé, orge, lin cultivés
- Irrigation avec des canaux
- Utilisation de l'araire
- Récoltes trois fois par an`
        },
        {
          title: "Les Gaulois",
          content: `# Les Gaulois

## Qui étaient les Gaulois ?
### Le peuple de nos ancêtres
- Habitaient la Gaule (actuelle France)
- Peuple celte arrivé vers 800 av. J.-C.
- Différentes tribus sur le territoire
- Guerriers et agriculteurs habiles

### Leurs territoires
- Parisii à Paris (Lutèce)
- Éduens en Bourgogne
- Arvernes en Auvergne
- Plus de 60 tribus différentes

## La société gauloise
### Les classes sociales
- Druides : prêtres et juges
- Nobles guerriers : chefs et soldats
- Artisans : forgerons, potiers...
- Paysans : la majorité du peuple

### Les druides
- Prêtres, médecins, professeurs
- Connaissent les plantes médicinales
- Rendent la justice
- Enseignent oralement (pas d'écriture)

## La vie quotidienne
### Leurs maisons
- Rondes avec toit de chaume
- Murs en torchis et bois
- Une seule pièce pour la famille
- Animaux protégés à côté

### Leur nourriture
- Sanglier, porc, bœuf
- Céréales : blé, orge, avoine
- Hydromel (boisson au miel)
- Fromages et légumes

### Leurs vêtements
- Braies (pantalons) en tissu
- Tuniques de lin ou laine
- Saies (manteaux) multicolores
- Très coquet avec bijoux

## L'artisanat gaulois
### Les forgerons
- Maîtres du travail du fer
- Épées réputées dans l'Europe entière
- Outils agricoles performants
- Bijoux en métal précieux

### Les potiers
- Céramiques de grande qualité
- Décors géométriques
- Amphores pour conserver
- Commerce avec d'autres peuples

## La guerre des Gaules
### Vercingétorix contre César
- Chef arverne unifie les tribus
- Résistance contre l'invasion romaine
- Siège d'Alésia en 52 av. J.-C.
- Défaite et capture du chef gaulois

### Conséquences
- Fin de l'indépendance gauloise
- Début de la romanisation
- Mélange des cultures
- Naissance de la Gaule romaine`
        },
        {
          title: "Les Romains en Gaule",
          content: `# Les Romains en Gaule

## L'empire romain
### Rome, capitale du monde
- Ville de plus d'un million d'habitants
- Maîtresse de tout le bassin méditerranéen
- Empire dirigé par l'empereur
- Armée la plus puissante du monde

### L'expansion romaine
- Conquêtes dans toute l'Europe
- Routes reliant toutes les provinces
- "Tous les chemins mènent à Rome"
- Paix romaine pendant des siècles

## La romanisation de la Gaule
### Transformation des villes
- Lutèce devient Paris
- Forums, théâtres, amphithéâtres
- Thermes pour se laver
- Aqueducs pour l'eau courante

### Les monuments romains encore visibles
- Pont du Gard : aqueduc magistral
- Arènes de Nîmes : amphithéâtre
- Théâtre d'Orange : acoustique parfaite
- Maison Carrée : temple romain

## La civilisation gallo-romaine
### Mélange des cultures
- Gaulois adoptent la langue latine
- Dieux gaulois et romains mélangés
- Architecture romaine adaptée
- Commerce prospère

### L'école et l'écriture
- Enfants apprennent le latin
- Écriture sur tablettes de cire
- Livres en papyrus ou parchemin
- Développement des lettres

### La religion
- Panthéon romain adopté
- Jupiter, Mars, Vénus...
- Temples dans chaque ville
- Plus tard : christianisme

## La fin de l'Empire romain
### Les invasions barbares
- Peuples germains attaquent l'Empire
- Francs, Wisigoths, Vandales...
- Chute de Rome en 476 ap. J.-C.
- Début du Moyen Âge

### Héritage de Rome
- Langue française vient du latin
- Droit romain base de nos lois
- Architecture inspirée
- Organisation administrative`
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

      console.log(`✅ Cours histoire CE2 créé avec ${sectionsCE2.length} sections`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la création des cours d\'histoire:', error);
    throw error;
  }
}

if (require.main === module) {
  createCoursHistoire()
    .then(() => {
      console.log('🎉 Cours d\'histoire créés avec succès');
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

export { createCoursHistoire };