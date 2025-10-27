import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Card, Icon, ProgressBar, Divider, Button } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { MarkdownRenderer } from '../../../../components/MarkdownRenderer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { sectionStyles, getSectionColors } from '../../../../styles/sectionStyles';

type Section = {
  id: string;
  title: string;
  content?: string;
  order: number;
  parentId?: string | null;
  isValidatable?: boolean; // Nouveau champ du backend
  children?: Section[];
  visited?: boolean;
};

type SectionsListProps = {
  sections: Section[];
  visitedSections: Set<string>;
  onSectionToggle: (sectionId: string, visited: boolean) => void;
};

export const SectionsList: React.FC<SectionsListProps> = ({
  sections,
  visitedSections,
  onSectionToggle,
}) => {
  const { theme } = useTheme();
  const colors = getSectionColors(theme);

  if (!sections || sections.length === 0) {
    return (
      <Card style={[sectionStyles.emptyCard, { backgroundColor: theme.colors.elevation.level2 }]}>
        <Card.Content>
          <Icon source="book-open-page-variant-outline" size={48} color={theme.colors.outline} />
          <Text variant="bodyLarge" style={{ marginTop: 12, textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
            Aucune section disponible pour ce cours
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <SectionItem
          key={section.id}
          section={section}
          index={index}
          level={0}
          visitedSections={visitedSections}
          onToggle={onSectionToggle}
          theme={theme}
        />
      ))}
    </View>
  );
};

type SectionItemProps = {
  section: Section;
  index: number;
  level: number;
  visitedSections: Set<string>;
  onToggle: (sectionId: string, visited: boolean) => void;
  theme: any;
};

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  index,
  level,
  visitedSections,
  onToggle,
  theme,
}) => {
  const [expanded, setExpanded] = useState(level === 0); // Premier niveau ouvert par défaut
  const hasChildren = section.children && section.children.length > 0;
  const isVisited = visitedSections.has(section.id);
  const indent = level * 6; // Indentation minimale pour économiser l'espace
  const colors = getSectionColors(theme, isVisited);
  
  // Utiliser le champ isValidatable du backend
  const isValidatable = section.isValidatable !== false; // Default true si absent

  // Fonction pour éclaircir le background selon le niveau de profondeur
  const getBackgroundColor = () => {
    // Niveau 0 : couleur normale du thème
    if (level === 0) {
      return isVisited ? colors.visitedBackground : colors.cardBackground;
    }
    
    // Pour les enfants, on utilise les niveaux d'élévation du thème
    // Plus le niveau est profond, plus on monte dans les niveaux d'élévation (plus clair)
    if (level === 1) {
      return theme.colors.elevation.level1;
    } else if (level === 2) {
      return theme.colors.elevation.level2;
    } else {
      return theme.colors.elevation.level3;
    }
  };

  const handleToggleSection = () => {
    onToggle(section.id, !isVisited);
  };

  // Fonction pour supprimer le premier titre si c'est le même que le titre de la section
  const getCleanedContent = (content: string, title: string) => {
    if (!content) return '';
    
    // Supprime différents formats de titre H1 qui correspondent au titre de la section
    const patterns = [
      /^#\s+(.+?)(\r?\n)/,           // # Titre
      /^##\s+(.+?)(\r?\n)/,          // ## Titre
      /^(.+?)\r?\n=+\r?\n/,          // Titre avec === en dessous
    ];
    
    let cleanedContent = content;
    
    for (const pattern of patterns) {
      const match = cleanedContent.match(pattern);
      if (match && match[1].trim().toLowerCase() === title.trim().toLowerCase()) {
        cleanedContent = cleanedContent.replace(pattern, '').trim();
        break;
      }
    }
    
    return cleanedContent;
  };

  return (
    <View style={[sectionStyles.sectionWrapper, { marginLeft: indent }]}>
      <Card
        style={{
          backgroundColor: getBackgroundColor(),
          borderLeftWidth: level > 0 ? 3 : 0,
          borderLeftColor: level === 1 ? theme.colors.primary : level === 2 ? theme.colors.secondary : theme.colors.tertiary,
          marginLeft: level > 0 ? 4 : 0,
          marginBottom: 8,
          borderRadius: 12,
          elevation: 0,
          shadowColor: 'transparent',
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 0
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setExpanded(!expanded);
          }}
          activeOpacity={0.7}
        >
          <Card.Content style={sectionStyles.sectionHeader}>
            <View style={sectionStyles.sectionLeft}>
              {/* Indicateur d'expansion pour les sections avec enfants */}
              {hasChildren ? (
                <MaterialCommunityIcons
                  name={expanded ? 'chevron-down' : 'chevron-right'}
                  size={24}
                  color={theme.colors.primary}
                  style={{ marginRight: 8 }}
                />
              ) : (
                <View style={{ width: level > 0 ? 4 : 8 }} />
              )}
              
              {/* Icône de type de section */}
              <MaterialCommunityIcons
                name={
                  hasChildren 
                    ? (expanded ? 'folder-open-outline' : 'folder-outline')
                    : level === 0 
                    ? 'file-document-outline' 
                    : 'file-outline'
                }
                size={level === 0 ? 20 : 18}
                color={level === 0 ? colors.iconColor : theme.colors.onSurfaceVariant}
                style={{ marginRight: 12 }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  variant={level === 0 ? 'bodyLarge' : level === 1 ? 'bodyMedium' : 'bodySmall'}
                  style={{
                    color: isVisited ? colors.visitedTextColor : colors.textColor,
                    fontWeight: level === 0 ? '600' : level === 1 ? '500' : '400',
                  }}
                >
                  {section.title}
                </Text>
                {hasChildren && (
                  <Text
                    variant="bodySmall"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginTop: 2,
                      fontSize: 11,
                    }}
                  >
                    {section.children?.length} sous-section{(section.children?.length || 0) > 1 ? 's' : ''}
                  </Text>
                )}
              </View>
            </View>

            {isValidatable && isVisited && (
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={colors.checkColor}
              />
            )}
          </Card.Content>
        </TouchableOpacity>

        {/* Contenu de la section (si validatable et a du contenu) */}
        {expanded && section.content && isValidatable && (
          <>
            <Card.Content style={{ paddingTop: 8, paddingBottom: 16, paddingHorizontal: 16 }}>
              <MarkdownRenderer content={getCleanedContent(section.content, section.title)} />
              
              {/* Bouton pour marquer/démarquer la section comme terminée */}
              <View style={sectionStyles.actionButtonContainer}>
                {isVisited ? (
                  <Button
                    mode="outlined"
                    onPress={handleToggleSection}
                    icon={() => (
                      <MaterialCommunityIcons
                        name="checkbox-marked-circle-outline"
                        size={20}
                        color={theme.colors.primary}
                      />
                    )}
                    style={[sectionStyles.actionButton, { borderColor: theme.colors.primary }]}
                    labelStyle={{ color: theme.colors.primary }}
                  >
                    Marquer comme non terminée
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    onPress={handleToggleSection}
                    icon={() => (
                      <MaterialCommunityIcons
                        name="checkbox-marked-circle"
                        size={20}
                        color={theme.colors.onPrimary}
                      />
                    )}
                    style={sectionStyles.actionButton}
                  >
                    Marquer comme terminée
                  </Button>
                )}
              </View>
            </Card.Content>
          </>
        )}
        
        {/* Contenu non-validatable (conteneur avec description) */}
        {expanded && section.content && !isValidatable && (
          <Card.Content style={{ paddingTop: 8, paddingBottom: 16, paddingHorizontal: 16 }}>
            <MarkdownRenderer content={getCleanedContent(section.content, section.title)} />
          </Card.Content>
        )}

        {/* Sous-sections (enfants) à l'intérieur de la Card parente */}
        {hasChildren && expanded && (
          <Card.Content style={{ paddingTop: 0, paddingBottom: 4, paddingHorizontal: 4 }}>
            {section.children?.map((child, childIndex) => (
              <SectionItem
                key={child.id}
                section={child}
                index={childIndex}
                level={level + 1}
                visitedSections={visitedSections}
                onToggle={onToggle}
                theme={theme}
              />
            ))}
          </Card.Content>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
