#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Contenu détaillé des cours de français par niveau
const coursFrancais = {
  "CP": {
    title: "Français CP - Apprentissage de la lecture",
    description: "Découverte de la lecture, écriture des premiers mots et expression orale pour les 6-7 ans",
    sections: [
      {
        title: "Les lettres et les sons",
        content: `
# Les lettres et les sons

## L'alphabet
L'alphabet français contient 26 lettres :
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z

## Les voyelles
Les voyelles sont : **A E I O U**
- Elles se prononcent toutes seules
- On peut les chanter
- Exemples : Âne, Éléphant, Île, Ours, Usine

## Les consonnes
Les consonnes ont besoin d'une voyelle pour se prononcer
- Exemples : B+A = BA, F+I = FI, M+O = MO

## Exercices
1. Reconnaître les voyelles dans des mots simples
2. Associer lettres majuscules et minuscules
3. Identifier le son d'attaque des mots`
      },
      {
        title: "Lecture de syllabes",
        content: `
# Lecture de syllabes

## Les syllabes simples
Une syllabe = 1 consonne + 1 voyelle

### Avec la lettre B
BA - BE - BI - BO - BU
Exemples : BABA, BÉBÉ, BIBI

### Avec la lettre M  
MA - ME - MI - MO - MU
Exemples : MAMA, MIME, MOTO

### Avec la lettre P
PA - PE - PI - PO - PU
Exemples : PAPA, PIPE, PHOTO

## Les premiers mots
- PAPA - MAMA - BÉBÉ
- VÉLO - PHOTO - RADIO
- DOMINO - KIMONO

## Activités
1. Lire des syllabes simples
2. Former des mots avec deux syllabes
3. Découper des mots en syllabes`
      },
      {
        title: "Les premiers mots",
        content: `
# Les premiers mots

## Mots outils fréquents
Ces mots sont très importants :
- **LE - LA - LES**
- **UN - UNE - DES**  
- **ET - EST - A**
- **IL - ELLE - ON**

## Mots du quotidien
### À la maison
- MAISON - PAPA - MAMA
- LIT - TABLE - CHAISE
- CHAT - CHIEN

### À l'école  
- ÉCOLE - MAÎTRE - ÉLÈVE
- LIVRE - CRAYON - CAHIER
- AMI - COPAIN

### Les actions
- LIRE - ÉCRIRE - DESSINER
- JOUER - COURIR - SAUTER
- MANGER - BOIRE - DORMIR

## Construction de phrases
1. LE CHAT MANGE
2. PAPA LIT UN LIVRE  
3. JULIE A UN VÉLO ROUGE`
      },
      {
        title: "Expression orale",
        content: `
# Expression orale

## Raconter une histoire
### Structure d'un récit simple
1. **Qui ?** (les personnages)
2. **Où ?** (le lieu)  
3. **Quand ?** (le moment)
4. **Quoi ?** (l'action)

### Exemple
"Le petit chat gris mange ses croquettes dans la cuisine."
- Qui ? Le petit chat gris
- Où ? Dans la cuisine
- Quand ? (maintenant)
- Quoi ? Il mange ses croquettes

## Vocabulaire de base
### Les émotions
- CONTENT - TRISTE - EN COLÈRE
- PEUR - SURPRISE - FATIGUE

### La description
- GRAND - PETIT - GROS - MINCE
- ROUGE - BLEU - VERT - JAUNE
- BEAU - JOLI - MOCHE

## Activités d'expression
1. Décrire une image
2. Raconter sa journée
3. Inventer une petite histoire
4. Poser des questions et répondre`
      }
    ]
  },
  "CE1": {
    title: "Français CE1 - Lecture et écriture",
    description: "Consolidation de la lecture, apprentissage de l'écriture et découverte de la grammaire pour les 7-8 ans",
    sections: [
      {
        title: "Lecture fluide",
        content: `
# Lecture fluide

## Les sons complexes
### Les sons avec plusieurs lettres
- **ON** : bonbon, maison, pont
- **AN/EN** : maman, dent, grand  
- **IN/AIN/EIN** : matin, pain, frein
- **OU** : loup, douche, joue
- **OI** : roi, oiseau, poisson

### Les lettres muettes
Certaines lettres ne se prononcent pas :
- Le **T** final : chat, rat, lit
- Le **S** final : souris, paris, bras  
- Le **E** final : table, chaise, rouge

## Stratégies de lecture
1. **Déchiffrage** : lire syllabe par syllabe
2. **Reconnaissance** : reconnaître les mots fréquents
3. **Prédiction** : deviner grâce au contexte
4. **Vérification** : contrôler que ça a du sens

## Textes adaptés
### Histoires courtes
Lire des petits textes de 3-4 phrases avec des mots simples et des illustrations pour aider à la compréhension.`
      },
      {
        title: "Les types de phrases",
        content: `
# Les types de phrases

## La phrase déclarative
Elle donne une information. Elle se termine par un **point (.)**.
- Le chien mange ses croquettes.
- Marie va à l'école.
- Il fait beau aujourd'hui.

## La phrase interrogative  
Elle pose une question. Elle se termine par un **point d'interrogation (?)**.
- Comment tu t'appelles ?
- Où habitez-vous ?
- Quel âge as-tu ?

## La phrase exclamative
Elle exprime une émotion forte. Elle se termine par un **point d'exclamation (!)**.
- Quel beau dessin !
- Attention au chien !
- Comme c'est drôle !

## Construction de phrases
### Les éléments essentiels
**QUI** fait **QUOI** ?
- QUI = le sujet (qui fait l'action)
- QUOI = le verbe (l'action)

Exemples :
- **Le chat** (qui) **dort** (quoi)
- **Les enfants** (qui) **jouent** (quoi) dans la cour
- **Papa** (qui) **lit** (quoi) le journal`
      },
      {
        title: "Le nom et l'article",
        content: `
# Le nom et l'article

## Le nom
Le nom désigne une personne, un animal, une chose ou un lieu.

### Noms de personnes
- garçon, fille, papa, maman
- maître, docteur, boulanger

### Noms d'animaux  
- chat, chien, oiseau, poisson
- lion, éléphant, souris

### Noms de choses
- table, chaise, livre, crayon
- voiture, maison, arbre

### Noms de lieux
- école, parc, magasin, jardin
- Paris, France, mer, montagne

## L'article
L'article se place devant le nom.

### Articles définis
- **LE** devant un nom masculin singulier : le chat
- **LA** devant un nom féminin singulier : la maison  
- **LES** devant un nom pluriel : les enfants

### Articles indéfinis
- **UN** devant un nom masculin singulier : un livre
- **UNE** devant un nom féminin singulier : une fleur
- **DES** devant un nom pluriel : des jouets

## Exercices pratiques
1. Classer des noms par catégories
2. Choisir le bon article
3. Transformer du singulier au pluriel`
      },
      {
        title: "Production d'écrits",
        content: `
# Production d'écrits

## Écrire des phrases simples
### Structure de base
**Sujet + Verbe + Complément**

Exemples :
- Le chat mange ses croquettes.
- Les enfants jouent dans la cour.
- Papa lit un livre.

### Enrichir ses phrases
Ajouter des informations :
- **Où ?** : dans le jardin, à l'école, sur la table
- **Quand ?** : hier, ce matin, après l'école  
- **Comment ?** : doucement, rapidement, bien

## Écrire une histoire courte
### Les étapes
1. **Choisir les personnages** : Qui ?
2. **Choisir le lieu** : Où ?
3. **Imaginer l'action** : Que se passe-t-il ?
4. **Trouver une fin** : Comment ça se termine ?

### Exemple d'histoire
"Dans la forêt, un petit lapin cherche des carottes. Il trouve un jardin avec de belles carottes orange. Le jardinier est gentil et lui en donne trois. Le lapin rentre chez lui tout content."

## Les outils d'aide
- Dictionnaire imagé
- Répertoire de mots
- Affichages de classe
- Cahier d'écrivain`
      }
    ]
  },
  "CE2": {
    title: "Français CE2 - Maîtrise de la langue",
    description: "Perfectionnement de la lecture, grammaire et orthographe, expression écrite pour les 8-9 ans",
    sections: [
      {
        title: "Lecture et compréhension",
        content: `
# Lecture et compréhension

## Stratégies de compréhension
### Avant la lecture
- Observer le titre, les images
- Faire des hypothèses sur l'histoire
- Mobiliser ses connaissances

### Pendant la lecture
- Visualiser l'histoire dans sa tête
- Se poser des questions
- Reformuler avec ses propres mots
- Identifier les mots-clés

### Après la lecture
- Résumer l'histoire
- Donner son avis
- Faire des liens avec d'autres histoires

## Types de textes
### Le récit
- Début, milieu, fin
- Personnages, lieu, époque
- Problème et résolution

### Le texte documentaire
- Informations vraies
- Schémas, photos
- Vocabulaire spécialisé

### La poésie
- Rimes, rythme
- Images poétiques
- Émotions

## Questions de compréhension
1. **Explicites** : les réponses sont dans le texte
2. **Implicites** : il faut déduire, comprendre entre les lignes
3. **D'interprétation** : donner son avis, ses impressions`
      },
      {
        title: "Grammaire - Le verbe",
        content: `
# Le verbe

## Reconnaître le verbe
Le verbe exprime une action ou un état.

### Actions
- **Actions physiques** : courir, sauter, manger, dormir
- **Actions mentales** : penser, rêver, comprendre, oublier
- **Actions de communication** : parler, dire, écrire, écouter

### États
- **être, avoir, sembler, paraître, rester, devenir**

## Le verbe change
### Selon la personne
- **JE** mange - **TU** manges - **IL/ELLE** mange
- **NOUS** mangeons - **VOUS** mangez - **ILS/ELLES** mangent

### Selon le temps
- **Présent** : Je mange (maintenant)
- **Passé** : J'ai mangé (hier)  
- **Futur** : Je mangerai (demain)

## Conjugaison au présent
### Verbes du 1er groupe (-ER)
CHANTER : je chante, tu chantes, il chante, nous chantons, vous chantez, ils chantent

### Verbes être et avoir
**ÊTRE** : je suis, tu es, il est, nous sommes, vous êtes, ils sont
**AVOIR** : j'ai, tu as, il a, nous avons, vous avez, ils ont

## Trouver le verbe dans la phrase
1. Chercher l'action ou l'état
2. Vérifier qu'il change selon la personne
3. L'encadrer par "ne...pas" (négation)`
      },
      {
        title: "Orthographe - Les accords",
        content: `
# Les accords en orthographe

## L'accord du verbe avec le sujet
Le verbe s'accorde toujours avec son sujet.

### Sujet singulier = verbe singulier
- Le chat **mange**
- Marie **joue** 
- Il **court**

### Sujet pluriel = verbe pluriel  
- Les chats **mangent**
- Marie et Paul **jouent**
- Ils **courent**

### Comment trouver le sujet ?
Poser la question : "Qui est-ce qui ?" + verbe
- "Qui est-ce qui mange ?" → Le chat

## L'accord dans le groupe nominal
### Masculin/féminin
- **UN** chat noir / **UNE** chatte noire
- **LE** petit garçon / **LA** petite fille

### Singulier/pluriel
- **UN** livre rouge / **DES** livres rouges
- **LA** grande maison / **LES** grandes maisons

## Les lettres muettes
### À la fin des mots
- chat, rat, lit (T muet)
- nez, assez, chez (Z muet)
- grand, petit, vert (T muet au masculin)

### Stratégies pour les trouver
1. Mettre au féminin : petit → petite (on entend le T)
2. Chercher la famille du mot : rat → ratière
3. Apprendre les mots fréquents par cœur`
      },
      {
        title: "Expression écrite",
        content: `
# Expression écrite

## Écrire un récit
### La structure du récit
1. **Situation initiale** : présenter les personnages, le lieu
2. **Élément perturbateur** : le problème qui arrive
3. **Péripéties** : ce qui se passe pour résoudre le problème
4. **Résolution** : comment le problème est résolu
5. **Situation finale** : comment ça se termine

### Exemple de structure
*Il était une fois un petit hérisson qui vivait dans la forêt. Un jour, il se perdit en cherchant des champignons. Il rencontra un écureuil qui lui montra le chemin. Grâce à son nouvel ami, il retrouva sa maison. Depuis ce jour, ils sont devenus inséparables.*

## Enrichir son vocabulaire
### Les connecteurs
- **Pour commencer** : d'abord, tout d'abord, pour commencer
- **Pour continuer** : ensuite, puis, alors, après
- **Pour finir** : enfin, finalement, pour terminer

### Les substituts
Éviter les répétitions :
- Le chien → l'animal, il, celui-ci
- Marie → la fillette, elle, la petite fille

## Relire et corriger
### Grille de relecture
1. **Le sens** : mon texte raconte-t-il bien une histoire ?
2. **Les phrases** : sont-elles complètes ?
3. **L'orthographe** : ai-je vérifié les accords ?
4. **La ponctuation** : ai-je mis les points et les majuscules ?`
      }
    ]
  }
  // ... (on continue avec les autres niveaux)
};

async function createCoursFrancais() {
  console.log('📚 Création des cours de français...');
  
  try {
    // Récupérer tous les niveaux
    const niveaux = await prisma.niveau.findMany({
      orderBy: { order: 'asc' }
    });

    // Pour l'instant, créer les cours pour CP, CE1, CE2
    const niveauxACreer = ['CP', 'CE1', 'CE2'];
    
    for (const nomNiveau of niveauxACreer) {
      const niveau = niveaux.find(n => n.name === nomNiveau);
      if (!niveau) {
        console.log(`⚠️ Niveau ${nomNiveau} non trouvé`);
        continue;
      }

      const coursData = coursFrancais[nomNiveau as keyof typeof coursFrancais];
      if (!coursData) {
        console.log(`⚠️ Données cours non trouvées pour ${nomNiveau}`);
        continue;
      }

      console.log(`📖 Création du cours de français ${nomNiveau}...`);

      // Créer le cours
      const cours = await prisma.course.create({
        data: {
          title: coursData.title,
          description: coursData.description,
          category: 'Français',
          niveauId: niveau.id,
          order: 1,
          isPublished: true,
          imageUrl: '/images/francais.jpg'
        }
      });

      // Créer les sections
      for (let i = 0; i < coursData.sections.length; i++) {
        const section = coursData.sections[i];
        
        await prisma.courseSection.create({
          data: {
            courseId: cours.id,
            title: section.title,
            content: section.content,
            order: i + 1,
            isValidatable: true
          }
        });
      }

      console.log(`✅ Cours français ${nomNiveau} créé avec ${coursData.sections.length} sections`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la création des cours de français:', error);
    throw error;
  }
}

if (require.main === module) {
  createCoursFrancais()
    .then(() => {
      console.log('🎉 Cours de français créés avec succès');
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

export { createCoursFrancais };