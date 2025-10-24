import { StyleSheet } from 'react-native';

/**
 * Styles globaux pour les sections de cours
 * Utilisés à la fois dans l'affichage client et l'édition admin
 */
export const sectionStyles = StyleSheet.create({
  // Card de base pour les sections
  sectionCard: {
    elevation: 1,
    marginVertical: 4,
  },

  // Card vide (aucune section)
  emptyCard: {
    marginTop: 16,
    alignItems: 'center',
    padding: 24,
  },

  // Conteneur de section
  sectionWrapper: {
    marginBottom: 8,
  },

  // Header de la section (titre + icônes)
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  // Partie gauche du header (icônes + titre)
  sectionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Conteneur d'actions (boutons en bas de section)
  actionButtonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },

  // Bouton d'action
  actionButton: {
    minWidth: 250,
  },

  // Item de l'arbre admin
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    paddingRight: 4,
    borderRadius: 8,
    marginVertical: 2,
  },

  treeItemLeftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  treeItemSpacer: {
    width: 24,
  },

  treeItemIcon: {
    marginHorizontal: 8,
  },

  treeItemTextContent: {
    flex: 1,
    marginRight: 8,
  },

  treeItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

/**
 * Fonction pour obtenir les couleurs de section en fonction de l'état
 */
export const getSectionColors = (theme: any, isVisited: boolean = false) => {
  return {
    // Couleur de fond de la card - utilise elevation pour plus de contraste
    cardBackground: theme.colors.primaryContainer,

    // Couleur de fond si visitée (pour client uniquement) - elevation level4 pour plus de contraste
    visitedBackground: theme.colors.elevation.level4,
    
    // Couleur du texte
    textColor: theme.colors.onSurface,
    
    // Couleur du texte si visitée
    visitedTextColor: theme.colors.onSurfaceVariant,
    
    // Couleur des icônes
    iconColor: isVisited ? theme.colors.primary : theme.colors.onSurfaceVariant,
    
    // Couleur de l'icône de validation
    checkColor: theme.colors.primary,
  };
};
