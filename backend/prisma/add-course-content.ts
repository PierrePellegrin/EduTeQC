import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Contenu pédagogique basé sur les programmes français officiels
const getCourseContent = () => {
  return {
    // FRANÇAIS
    'Français CM1': {
      sections: [
        {
          title: 'Grammaire',
          content: 'Étude approfondie des classes de mots et des fonctions grammaticales.',
          subsections: [
            { title: 'Les déterminants', content: 'Articles définis, indéfinis, déterminants possessifs, démonstratifs et numéraux.' },
            { title: 'Les pronoms', content: 'Pronoms personnels, possessifs, démonstratifs et relatifs simples.' },
            { title: 'Les fonctions dans la phrase', content: 'Sujet, prédicat, complément de phrase. Analyse des groupes nominaux.' }
          ]
        },
        {
          title: 'Conjugaison',
          content: 'Maîtrise des temps simples et composés de l\'indicatif.',
          subsections: [
            { title: 'Présent et futur', content: 'Conjugaison des verbes des trois groupes au présent et au futur simple.' },
            { title: 'Passé composé', content: 'Formation et utilisation du passé composé avec être et avoir.' },
            { title: 'Imparfait', content: 'Formation et emploi de l\'imparfait pour exprimer l\'habitude et la description.' }
          ]
        },
        {
          title: 'Orthographe',
          content: 'Consolidation de l\'orthographe lexicale et grammaticale.',
          subsections: [
            { title: 'Accords dans le groupe nominal', content: 'Accord en genre et en nombre des adjectifs et des déterminants.' },
            { title: 'Orthographe des verbes', content: 'Terminaisons verbales et accord du participe passé simple.' },
            { title: 'Mots invariables', content: 'Mémorisation de l\'orthographe des mots outils et connecteurs.' }
          ]
        },
        {
          title: 'Expression écrite',
          content: 'Production de textes variés en respectant les contraintes d\'écriture.',
          subsections: [
            { title: 'Le récit', content: 'Écriture de récits courts avec une structure narrative claire.' },
            { title: 'La description', content: 'Description de personnages, de lieux et d\'objets avec vocabulaire précis.' },
            { title: 'La lettre', content: 'Rédaction de lettres personnelles et officielles simples.' }
          ]
        }
      ]
    },

    'Français CM2': {
      sections: [
        {
          title: 'Littérature',
          content: 'Découverte de textes littéraires variés et développement du goût de lire.',
          subsections: [
            { title: 'Romans et nouvelles', content: 'Lecture d\'œuvres complètes adaptées à l\'âge. Analyse des personnages et de l\'intrigue.' },
            { title: 'Poésie', content: 'Découverte de poèmes classiques et contemporains. Apprentissage de la récitation.' },
            { title: 'Théâtre', content: 'Lecture et mise en voix de pièces courtes. Compréhension des didascalies.' }
          ]
        },
        {
          title: 'Rédaction avancée',
          content: 'Maîtrise de l\'expression écrite dans des situations complexes.',
          subsections: [
            { title: 'Le portrait', content: 'Description physique et morale de personnages réels ou imaginaires.' },
            { title: 'Le dialogue', content: 'Insertion de dialogues dans un récit. Ponctuation du discours rapporté.' },
            { title: 'L\'argumentation simple', content: 'Expression d\'opinions personnelles avec justifications.' }
          ]
        },
        {
          title: 'Grammaire complexe',
          content: 'Approfondissement des notions grammaticales.',
          subsections: [
            { title: 'La phrase complexe', content: 'Identification des propositions principales et subordonnées simples.' },
            { title: 'Les compléments', content: 'COD, COI, compléments circonstanciels de temps, lieu, manière.' },
            { title: 'Les types de phrases', content: 'Phrases déclaratives, interrogatives, exclamatives, impératives.' }
          ]
        }
      ]
    },

    // MATHÉMATIQUES
    'Mathématiques CM1': {
      sections: [
        {
          title: 'Nombres et calculs',
          content: 'Consolidation des opérations et découverte des fractions.',
          subsections: [
            { title: 'Grands nombres', content: 'Lecture, écriture et comparaison des nombres jusqu\'au million.' },
            { title: 'Fractions simples', content: 'Comprendre les fractions comme partage équitable. Fractions décimales.' },
            { title: 'Multiplication et division', content: 'Maîtrise des tables. Division euclidienne avec quotient et reste.' }
          ]
        },
        {
          title: 'Géométrie',
          content: 'Étude des figures planes et de leurs propriétés.',
          subsections: [
            { title: 'Polygones', content: 'Triangles, quadrilatères, pentagones. Propriétés et construction.' },
            { title: 'Cercle et disque', content: 'Vocabulaire : centre, rayon, diamètre. Tracé au compas.' },
            { title: 'Symétrie axiale', content: 'Reconnaissance et construction de figures symétriques.' }
          ]
        },
        {
          title: 'Mesures',
          content: 'Utilisation des unités de mesure dans la vie quotidienne.',
          subsections: [
            { title: 'Longueurs', content: 'Mètre, centimètre, kilomètre. Conversions simples et mesures.' },
            { title: 'Masses', content: 'Gramme, kilogramme, tonne. Résolution de problèmes concrets.' },
            { title: 'Durées', content: 'Heures, minutes, secondes. Calculs sur les durées.' }
          ]
        }
      ]
    },

    'Mathématiques CM2': {
      sections: [
        {
          title: 'Fractions et décimaux',
          content: 'Approfondissement des nombres rationnels.',
          subsections: [
            { title: 'Fractions équivalentes', content: 'Reconnaissance et production de fractions égales.' },
            { title: 'Nombres décimaux', content: 'Écriture décimale, comparaison et rangement.' },
            { title: 'Opérations avec décimaux', content: 'Addition, soustraction et multiplication de nombres décimaux.' }
          ]
        },
        {
          title: 'Proportionnalité',
          content: 'Introduction aux situations de proportionnalité.',
          subsections: [
            { title: 'Tableaux de proportionnalité', content: 'Reconnaissance et complétion de tableaux.' },
            { title: 'Échelles et plans', content: 'Utilisation d\'échelles simples pour lire plans et cartes.' },
            { title: 'Pourcentages simples', content: '50%, 25%, 10% dans des situations concrètes.' }
          ]
        },
        {
          title: 'Aires et périmètres',
          content: 'Calcul d\'aires et de périmètres de figures simples.',
          subsections: [
            { title: 'Périmètres', content: 'Calcul du périmètre de polygones et du cercle.' },
            { title: 'Aires par pavage', content: 'Mesure d\'aires par comptage d\'unités.' },
            { title: 'Formules d\'aires', content: 'Aire du rectangle, du carré et du triangle rectangle.' }
          ]
        }
      ]
    },

    // HISTOIRE
    'Histoire CM1': {
      sections: [
        {
          title: 'La Préhistoire',
          content: 'Les premiers hommes et l\'évolution de l\'humanité.',
          subsections: [
            { title: 'Paléolithique', content: 'Homo erectus, Homo sapiens. Outils, feu, art pariétal.' },
            { title: 'Néolithique', content: 'Sédentarisation, agriculture, élevage. Premiers villages.' },
            { title: 'Âge des métaux', content: 'Bronze et fer. Évolution technique et sociale.' }
          ]
        },
        {
          title: 'L\'Antiquité',
          content: 'Les grandes civilisations antiques.',
          subsections: [
            { title: 'L\'Égypte des pharaons', content: 'Civilisation du Nil, pyramides, hiéroglyphes, momification.' },
            { title: 'La Grèce antique', content: 'Cités grecques, démocratie athénienne, jeux olympiques.' },
            { title: 'L\'Empire romain', content: 'Conquêtes, organisation, romanisation de la Gaule.' }
          ]
        },
        {
          title: 'Le Moyen Âge',
          content: 'La société féodale et l\'émergence du royaume de France.',
          subsections: [
            { title: 'Clovis et Charlemagne', content: 'Royaumes francs, expansion et organisation.' },
            { title: 'Seigneurs et paysans', content: 'Féodalité, château fort, vie au village.' },
            { title: 'L\'Église au Moyen Âge', content: 'Rôle social, monastères, cathédrales, croisades.' }
          ]
        }
      ]
    },

    'Histoire CM2': {
      sections: [
        {
          title: 'Renaissance et Temps modernes',
          content: 'Renouveau artistique et grandes découvertes.',
          subsections: [
            { title: 'La Renaissance', content: 'Humanisme, art, châteaux de la Loire. Léonard de Vinci.' },
            { title: 'Grandes découvertes', content: 'Christophe Colomb, Magellan. Nouveaux mondes.' },
            { title: 'Monarchie absolue', content: 'Louis XIV, Versailles, centralisation du pouvoir.' }
          ]
        },
        {
          title: 'Les Lumières et la Révolution',
          content: 'Idées nouvelles et transformation de la société.',
          subsections: [
            { title: 'Philosophes des Lumières', content: 'Voltaire, Rousseau, Diderot. Encyclopédie.' },
            { title: 'La Révolution française', content: '1789, droits de l\'homme, fin de l\'Ancien Régime.' },
            { title: 'Empire et République', content: 'Napoléon, Code civil, retour de la République.' }
          ]
        },
        {
          title: 'Le XIXe siècle',
          content: 'Révolution industrielle et transformations sociales.',
          subsections: [
            { title: 'Révolution industrielle', content: 'Machine à vapeur, chemin de fer, usines.' },
            { title: 'École de la République', content: 'Jules Ferry, instruction obligatoire, laïcité.' },
            { title: 'Expansion coloniale', content: 'Empire colonial français, exploration de l\'Afrique.' }
          ]
        }
      ]
    },

    // GÉOGRAPHIE
    'Géographie CM1': {
      sections: [
        {
          title: 'Se déplacer au quotidien',
          content: 'Moyens de transport et mobilité dans l\'espace proche.',
          subsections: [
            { title: 'Se déplacer dans sa ville', content: 'Transports urbains, plans, itinéraires, sécurité routière.' },
            { title: 'Voyager en France', content: 'TGV, autoroutes, aéroports. Réseaux de transport.' },
            { title: 'Voyager dans le monde', content: 'Avion, bateaux. Fuseaux horaires et distances.' }
          ]
        },
        {
          title: 'Habiter un espace rural',
          content: 'Découverte des espaces ruraux et de leurs activités.',
          subsections: [
            { title: 'Un village agricole', content: 'Paysages ruraux, activités agricoles, vie villageoise.' },
            { title: 'Agriculture moderne', content: 'Machines agricoles, types de cultures, élevage.' },
            { title: 'Espaces naturels', content: 'Parcs nationaux, forêts, protection de la nature.' }
          ]
        },
        {
          title: 'Habiter un espace urbain',
          content: 'Organisation et vie dans les villes.',
          subsections: [
            { title: 'Ma ville', content: 'Quartiers, services, commerces. Organisation urbaine.' },
            { title: 'Grandes métropoles', content: 'Paris, Lyon, Marseille. Fonctions urbaines.' },
            { title: 'Villes dans le monde', content: 'Comparaison avec des villes étrangères.' }
          ]
        }
      ]
    },

    'Géographie CM2': {
      sections: [
        {
          title: 'Le territoire français',
          content: 'Organisation et diversité du territoire national.',
          subsections: [
            { title: 'Relief et climat', content: 'Montagnes, plaines, fleuves. Climats de la France.' },
            { title: 'Régions françaises', content: 'Nouvelles régions, préfectures, spécificités locales.' },
            { title: 'Outre-mer français', content: 'DOM-TOM, diversité des territoires ultramarins.' }
          ]
        },
        {
          title: 'L\'Union européenne',
          content: 'La France dans l\'Europe.',
          subsections: [
            { title: 'Pays européens', content: 'Carte de l\'Europe, capitales, langues principales.' },
            { title: 'Construction européenne', content: 'Histoire de l\'UE, institutions, symboles.' },
            { title: 'Coopération européenne', content: 'Euro, libre circulation, programmes d\'échange.' }
          ]
        },
        {
          title: 'La France dans le monde',
          content: 'Place et rôle de la France sur la planète.',
          subsections: [
            { title: 'Francophonie', content: 'Pays francophones, diversité culturelle francophone.' },
            { title: 'Commerce mondial', content: 'Importations, exportations, partenaires commerciaux.' },
            { title: 'Coopération internationale', content: 'ONU, aide au développement, diplomatie.' }
          ]
        }
      ]
    }

  };
};

// Fonction pour les cours de collège (6ème-3ème)
const getCollegeContent = () => {
  return {
    'Français 6ème': {
      sections: [
        {
          title: 'Récits d\'aventures',
          content: 'Découverte du genre narratif à travers les récits d\'aventures.',
          subsections: [
            { title: 'L\'Odyssée d\'Homère', content: 'Découverte de l\'épopée antique et des valeurs héroïques.' },
            { title: 'Romans d\'aventures modernes', content: 'Jules Verne, Robinson Crusoé. Structure narrative.' },
            { title: 'Héros et merveilleux', content: 'Caractéristiques du héros, éléments merveilleux.' }
          ]
        },
        {
          title: 'Contes et récits merveilleux',
          content: 'Étude du conte et de ses caractéristiques.',
          subsections: [
            { title: 'Contes traditionnels', content: 'Perrault, Grimm. Structure du conte merveilleux.' },
            { title: 'Contes du monde', content: 'Diversité culturelle à travers les contes.' },
            { title: 'Réécriture de contes', content: 'Contes détournés, parodies modernes.' }
          ]
        },
        {
          title: 'Grammaire et langue',
          content: 'Étude de la langue française et de ses règles.',
          subsections: [
            { title: 'Classes grammaticales', content: 'Nom, verbe, adjectif, déterminant, pronom.' },
            { title: 'Fonctions grammaticales', content: 'Sujet, complément d\'objet, attribut.' },
            { title: 'Conjugaison', content: 'Présent, futur, passé composé, imparfait.' }
          ]
        }
      ]
    },

    'Français 5ème': {
      sections: [
        {
          title: 'Littérature du Moyen Âge',
          content: 'Découverte de la littérature médiévale.',
          subsections: [
            { title: 'Romans de chevalerie', content: 'Chrétien de Troyes, quête du Graal, idéal chevaleresque.' },
            { title: 'Poésie courtoise', content: 'Chansons de troubadours, amour courtois.' },
            { title: 'Fabliaux et farces', content: 'Littérature populaire, humour médiéval.' }
          ]
        },
        {
          title: 'Voyage et exotisme',
          content: 'Récits de voyage et découverte de l\'autre.',
          subsections: [
            { title: 'Marco Polo', content: 'Le Livre des merveilles, découverte de l\'Orient.' },
            { title: 'Grandes découvertes', content: 'Récits d\'explorateurs, nouveaux mondes.' },
            { title: 'Robinson Crusoé', content: 'Île déserte, survie, rencontre avec l\'autre.' }
          ]
        }
      ]
    },

    'Français 4ème': {
      sections: [
        {
          title: 'Théâtre classique',
          content: 'Découverte du théâtre français du XVIIe siècle.',
          subsections: [
            { title: 'Molière', content: 'Comédies, satire sociale, règles du théâtre classique.' },
            { title: 'Corneille et Racine', content: 'Tragédie classique, règle des trois unités.' },
            { title: 'Jeu théâtral', content: 'Mise en scène, interprétation, didascalies.' }
          ]
        },
        {
          title: 'Nouvelles réalistes',
          content: 'Le genre de la nouvelle au XIXe siècle.',
          subsections: [
            { title: 'Maupassant', content: 'Art de la nouvelle, chute, réalisme.' },
            { title: 'Mérimée', content: 'Couleur locale, exotisme, fantastique.' },
            { title: 'Techniques narratives', content: 'Point de vue, ellipse, suspense.' }
          ]
        }
      ]
    },

    'Français 3ème': {
      sections: [
        {
          title: 'Littérature engagée',
          content: 'Littérature et engagement aux XIXe et XXe siècles.',
          subsections: [
            { title: 'Poésie de la Résistance', content: 'Éluard, Aragon, engagement et liberté.' },
            { title: 'Récits de guerre', content: 'Témoignages, mémoire, devoir de mémoire.' },
            { title: 'Autobiographie', content: 'Récit de soi, pacte autobiographique.' }
          ]
        },
        {
          title: 'Brevet des collèges',
          content: 'Préparation à l\'examen du DNB.',
          subsections: [
            { title: 'Dictée et questions', content: 'Orthographe, grammaire, compréhension.' },
            { title: 'Rédaction', content: 'Sujet d\'invention, sujet de réflexion.' },
            { title: 'Oral', content: 'Présentation d\'un projet, argumentation.' }
          ]
        }
      ]
    },

    'Mathématiques 6ème': {
      sections: [
        {
          title: 'Nombres entiers et décimaux',
          content: 'Consolidation des acquis sur les nombres.',
          subsections: [
            { title: 'Nombres entiers', content: 'Écriture, comparaison, ordre. Droite graduée.' },
            { title: 'Nombres décimaux', content: 'Écriture décimale, fractions décimales.' },
            { title: 'Opérations', content: 'Addition, soustraction, multiplication, division.' }
          ]
        },
        {
          title: 'Géométrie plane',
          content: 'Figures géométriques et constructions.',
          subsections: [
            { title: 'Droites et segments', content: 'Vocabulaire, notation, constructions.' },
            { title: 'Triangles et quadrilatères', content: 'Propriétés, construction, classification.' },
            { title: 'Cercles', content: 'Vocabulaire, construction, propriétés.' }
          ]
        },
        {
          title: 'Proportionnalité',
          content: 'Situations de proportionnalité.',
          subsections: [
            { title: 'Tableaux et graphiques', content: 'Reconnaissance, complétion, représentation.' },
            { title: 'Échelles et vitesses', content: 'Applications concrètes de la proportionnalité.' },
            { title: 'Pourcentages', content: 'Calculs de pourcentages simples.' }
          ]
        }
      ]
    },

    'Mathématiques 5ème': {
      sections: [
        {
          title: 'Nombres relatifs',
          content: 'Introduction aux nombres négatifs.',
          subsections: [
            { title: 'Nombres relatifs', content: 'Définition, représentation, comparaison.' },
            { title: 'Addition et soustraction', content: 'Règles opératoires avec les relatifs.' },
            { title: 'Coordonnées', content: 'Repère du plan, abscisse, ordonnée.' }
          ]
        },
        {
          title: 'Triangles et parallélisme',
          content: 'Propriétés géométriques fondamentales.',
          subsections: [
            { title: 'Triangles', content: 'Construction, inégalité triangulaire.' },
            { title: 'Parallélisme', content: 'Droites parallèles, angles, propriétés.' },
            { title: 'Symétrie centrale', content: 'Centre de symétrie, construction.' }
          ]
        }
      ]
    },

    'Mathématiques 4ème': {
      sections: [
        {
          title: 'Calcul littéral',
          content: 'Introduction à l\'algèbre.',
          subsections: [
            { title: 'Expressions littérales', content: 'Variables, expressions, substitution.' },
            { title: 'Développement', content: 'Distributivité simple.' },
            { title: 'Équations', content: 'Résolution d\'équations du premier degré.' }
          ]
        },
        {
          title: 'Théorème de Pythagore',
          content: 'Relations métriques dans le triangle rectangle.',
          subsections: [
            { title: 'Théorème de Pythagore', content: 'Énoncé, calculs, applications.' },
            { title: 'Réciproque', content: 'Test d\'angle droit.' },
            { title: 'Distances et longueurs', content: 'Calculs dans des figures complexes.' }
          ]
        }
      ]
    },

    'Mathématiques 3ème': {
      sections: [
        {
          title: 'Fonctions et équations',
          content: 'Approfondissement de l\'algèbre.',
          subsections: [
            { title: 'Fonctions linéaires', content: 'Définition, représentation graphique.' },
            { title: 'Fonctions affines', content: 'Équation de droite, coefficient directeur.' },
            { title: 'Systèmes d\'équations', content: 'Résolution par substitution et addition.' }
          ]
        },
        {
          title: 'Trigonométrie',
          content: 'Relations trigonométriques dans le triangle rectangle.',
          subsections: [
            { title: 'Cosinus, sinus, tangente', content: 'Définitions, calculs d\'angles et longueurs.' },
            { title: 'Applications', content: 'Problèmes concrets de trigonométrie.' },
            { title: 'Cercle trigonométrique', content: 'Introduction aux angles orientés.' }
          ]
        }
      ]
    },

    'Histoire 6ème': {
      sections: [
        {
          title: 'Premiers États et premières écritures',
          content: 'Naissance des civilisations.',
          subsections: [
            { title: 'Mésopotamie', content: 'Sumer, Babylone, cunéiforme, Code d\'Hammourabi.' },
            { title: 'Égypte pharaonique', content: 'Pharaons, hiéroglyphes, pyramides, momification.' },
            { title: 'Hébreux', content: 'Monothéisme, Bible, diaspora.' }
          ]
        },
        {
          title: 'Monde grec antique',
          content: 'Civilisation grecque classique.',
          subsections: [
            { title: 'Cités grecques', content: 'Athènes, Sparte, démocratie, citoyenneté.' },
            { title: 'Culture grecque', content: 'Théâtre, philosophie, jeux olympiques.' },
            { title: 'Alexandre le Grand', content: 'Conquêtes, hellénisation.' }
          ]
        },
        {
          title: 'Empire romain',
          content: 'Rome et son empire.',
          subsections: [
            { title: 'République romaine', content: 'Institutions, conquêtes, société.' },
            { title: 'Empire romain', content: 'Auguste, pax romana, romanisation.' },
            { title: 'Christianisme', content: 'Naissance, persécutions, triomphe.' }
          ]
        }
      ]
    },

    'Histoire 5ème': {
      sections: [
        {
          title: 'Islam et monde musulman',
          content: 'Naissance et expansion de l\'Islam.',
          subsections: [
            { title: 'Mahomet et l\'Islam', content: 'Prophète, Coran, piliers de l\'Islam.' },
            { title: 'Expansion musulmane', content: 'Conquêtes, califats, civilisation.' },
            { title: 'Al-Andalus', content: 'Islam en Espagne, Cordoue, coexistence.' }
          ]
        },
        {
          title: 'Société féodale',
          content: 'Organisation de la société médiévale.',
          subsections: [
            { title: 'Seigneurie', content: 'Château, village, relations féodales.' },
            { title: 'Monde rural', content: 'Paysans, agriculture, vie quotidienne.' },
            { title: 'Église médiévale', content: 'Clergé, monastères, art roman.' }
          ]
        }
      ]
    },

    'Histoire 4ème': {
      sections: [
        {
          title: 'Monarchie absolue',
          content: 'L\'absolutisme royal en France.',
          subsections: [
            { title: 'Louis XIV', content: 'Versailles, administration, guerres.' },
            { title: 'Société d\'Ancien Régime', content: 'Ordres, privilèges, inégalités.' },
            { title: 'Siècle des Lumières', content: 'Philosophes, Encyclopédie, critique.' }
          ]
        },
        {
          title: 'Révolutions et Empire',
          content: 'Transformation de la France (1789-1815).',
          subsections: [
            { title: 'Révolution française', content: '1789, DDHC, République, Terreur.' },
            { title: 'Consulat et Empire', content: 'Napoléon, conquêtes, Code civil.' },
            { title: 'Europe révolutionnaire', content: 'Coalitions, nationalités, Congrès de Vienne.' }
          ]
        }
      ]
    },

    'Histoire 3ème': {
      sections: [
        {
          title: 'Première Guerre mondiale',
          content: 'La Grande Guerre et ses conséquences.',
          subsections: [
            { title: 'Guerre totale', content: 'Tranchées, arrière, propagande, économie de guerre.' },
            { title: 'Révolution russe', content: 'Lénine, bolcheviks, révolution d\'Octobre.' },
            { title: 'Sortie de guerre', content: 'Armistice, traités, Europe nouvelle.' }
          ]
        },
        {
          title: 'Seconde Guerre mondiale',
          content: 'Guerre d\'anéantissement et génocides.',
          subsections: [
            { title: 'Guerre mondiale', content: 'Blitzkrieg, résistances, victoire alliée.' },
            { title: 'Génocides nazis', content: 'Shoah, crimes contre l\'humanité.' },
            { title: 'France dans la guerre', content: 'Défaite, Vichy, Résistance, Libération.' }
          ]
        }
      ]
    },

    'Géographie 6ème': {
      sections: [
        {
          title: 'Habiter une métropole',
          content: 'Vie urbaine dans le monde.',
          subsections: [
            { title: 'Métropoles mondiales', content: 'New York, Londres, Tokyo. Fonctions urbaines.' },
            { title: 'Défis urbains', content: 'Transports, logement, environnement.' },
            { title: 'Métropoles du Sud', content: 'Lagos, Mumbai. Croissance urbaine.' }
          ]
        },
        {
          title: 'Habiter un espace rural',
          content: 'Diversité des espaces ruraux.',
          subsections: [
            { title: 'Agriculture productiviste', content: 'Grandes plaines céréalières.' },
            { title: 'Agriculture vivrière', content: 'Afrique subsaharienne, techniques.' },
            { title: 'Espaces à contraintes', content: 'Déserts, montagnes, adaptation.' }
          ]
        }
      ]
    },

    'Géographie 5ème': {
      sections: [
        {
          title: 'Changement global et développement durable',
          content: 'Défis environnementaux planétaires.',
          subsections: [
            { title: 'Changement climatique', content: 'Causes, conséquences, adaptation.' },
            { title: 'Ressources et énergies', content: 'Énergies fossiles, renouvelables.' },
            { title: 'Développement durable', content: 'Objectifs, politiques, actions.' }
          ]
        },
        {
          title: 'Inégalités de développement',
          content: 'Disparités dans le monde.',
          subsections: [
            { title: 'Pays riches et pauvres', content: 'Indicateurs, IDH, Nord-Sud.' },
            { title: 'Émergence', content: 'BRICS, nouveaux acteurs.' },
            { title: 'Pauvreté', content: 'Causes, manifestations, lutte.' }
          ]
        }
      ]
    },

    'Géographie 4ème': {
      sections: [
        {
          title: 'Espaces et paysages de l\'urbanisation',
          content: 'Processus d\'urbanisation mondiale.',
          subsections: [
            { title: 'Étalement urbain', content: 'Périurbanisation, métropolisation.' },
            { title: 'Villes durables', content: 'Écoquartiers, transports verts.' },
            { title: 'Gouvernance urbaine', content: 'Gestion des métropoles.' }
          ]
        },
        {
          title: 'Mobilités humaines',
          content: 'Migrations et mobilités contemporaines.',
          subsections: [
            { title: 'Migrations internationales', content: 'Causes, flux, intégration.' },
            { title: 'Tourisme de masse', content: 'Impacts, aménagements.' },
            { title: 'Mobilités quotidiennes', content: 'Transports, temps, distances.' }
          ]
        }
      ]
    },

    'Géographie 3ème': {
      sections: [
        {
          title: 'Dynamiques territoriales de la France',
          content: 'Organisation du territoire français.',
          subsections: [
            { title: 'Métropolisation', content: 'Paris, métropoles régionales.' },
            { title: 'Espaces productifs', content: 'Agriculture, industrie, services.' },
            { title: 'Espaces de faible densité', content: 'Rural, montagne, défis.' }
          ]
        },
        {
          title: 'France et Union européenne',
          content: 'Place de la France en Europe et dans le monde.',
          subsections: [
            { title: 'Union européenne', content: 'Construction, institutions, politiques.' },
            { title: 'France dans la mondialisation', content: 'Échanges, influence, défis.' },
            { title: 'Aménagement du territoire', content: 'Politiques, égalité territoriale.' }
          ]
        }
      ]
    }
  };
};

// Fonction pour les cours de lycée (Seconde-Terminale)
const getLyceeContent = () => {
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

    'Français Terminale': {
      sections: [
        {
          title: 'Œuvres au programme',
          content: 'Étude approfondie d\'œuvres intégrales.',
          subsections: [
            { title: 'Les Contemplations', content: 'Hugo, romantisme, fonction du poète.' },
            { title: 'La Princesse de Clèves', content: 'Mme de Lafayette, analyse psychologique.' },
            { title: 'Gargantua', content: 'Rabelais, humanisme, satire.' }
          ]
        },
        {
          title: 'Préparation au bac',
          content: 'Méthodologie des épreuves du baccalauréat.',
          subsections: [
            { title: 'Dissertation', content: 'Plan, argumentation, rédaction.' },
            { title: 'Commentaire composé', content: 'Analyse littéraire, procédés.' },
            { title: 'Explication linéaire', content: 'Méthode, oral du baccalauréat.' }
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

    'Mathématiques Terminale': {
      sections: [
        {
          title: 'Analyse avancée',
          content: 'Fonctions logarithme et primitives.',
          subsections: [
            { title: 'Fonction logarithme', content: 'Définition, propriétés, équations.' },
            { title: 'Primitives', content: 'Calcul intégral, aires, volumes.' },
            { title: 'Équations différentielles', content: 'Résolution, applications.' }
          ]
        },
        {
          title: 'Géométrie dans l\'espace',
          content: 'Géométrie vectorielle dans l\'espace.',
          subsections: [
            { title: 'Vecteurs de l\'espace', content: 'Coplanarité, repérage dans l\'espace.' },
            { title: 'Produit scalaire', content: 'Définition, applications, orthogonalité.' },
            { title: 'Droites et plans', content: 'Équations, intersections, distances.' }
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

    'Histoire Terminale': {
      sections: [
        {
          title: 'Fragilités des démocraties',
          content: 'Crise des démocraties dans l\'entre-deux-guerres.',
          subsections: [
            { title: 'Crise de 1929', content: 'Krach, dépression, New Deal.' },
            { title: 'Régimes totalitaires', content: 'Stalinisme, nazisme, fascisme.' },
            { title: 'Front populaire', content: 'France, réformes, contexte.' }
          ]
        },
        {
          title: 'Guerre froide',
          content: 'Bipolarisation du monde (1947-1991).',
          subsections: [
            { title: 'Origines', content: 'Rupture, doctrines, blocs.' },
            { title: 'Crises', content: 'Berlin, Cuba, coexistence.' },
            { title: 'Fin', content: 'Détente, Gorbatchev, chute du mur.' }
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
    },

    'Géographie Terminale': {
      sections: [
        {
          title: 'Des territoires inégalement intégrés',
          content: 'France dans la mondialisation.',
          subsections: [
            { title: 'Centres d\'impulsion', content: 'Paris, métropoles, interfaces.' },
            { title: 'Espaces en marge', content: 'Rural, périphéries, fractures.' },
            { title: 'Politiques d\'aménagement', content: 'Cohésion, compétitivité.' }
          ]
        },
        {
          title: 'La France et ses régions dans l\'UE',
          content: 'Intégration européenne et territoriale.',
          subsections: [
            { title: 'Construction européenne', content: 'Étapes, institutions, politiques.' },
            { title: 'Régions françaises', content: 'Réforme, compétences, stratégies.' },
            { title: 'Coopération européenne', content: 'Eurorégions, programmes, échanges.' }
          ]
        }
      ]
    }
  };
};

async function addContentToAllCourses() {
  try {
    console.log('📚 Ajout de contenu pédagogique à tous les cours...\n');

    const courseContents: { [key: string]: any } = { 
      ...getCourseContent(), 
      ...getCollegeContent(),
      ...getLyceeContent()
    };

    // Récupérer tous les cours sans contenu
    const courses = await prisma.course.findMany({
      include: {
        sections: true,
        niveau: true
      }
    });

    console.log(`📖 ${courses.length} cours trouvés\n`);

    let coursesUpdated = 0;

    for (const course of courses) {
      const courseKey = `${course.category} ${course.niveau.name}`;
      const content = courseContents[courseKey];

      if (content && course.sections.length === 0) {
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
      } else if (course.sections.length > 0) {
        console.log(`⏭️  ${course.title} - Contenu déjà présent`);
      } else {
        console.log(`⚠️  ${course.title} - Contenu non défini pour ce niveau`);
      }
    }

    console.log(`\n🎉 AJOUT DE CONTENU TERMINÉ !`);
    console.log(`📊 ${coursesUpdated} cours mis à jour avec du contenu pédagogique`);

    // Statistiques finales
    const stats = await prisma.courseSection.groupBy({
      by: ['courseId'],
      _count: {
        id: true
      }
    });

    console.log(`📈 ${stats.length} cours ont maintenant des sections de contenu`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addContentToAllCourses();