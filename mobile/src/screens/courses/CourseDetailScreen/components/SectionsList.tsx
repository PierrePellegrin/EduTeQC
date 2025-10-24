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
  const indent = level * 16;
  const colors = getSectionColors(theme, isVisited);

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
        style={[
          sectionStyles.sectionCard,
          {
            backgroundColor: isVisited ? colors.visitedBackground : colors.cardBackground,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (hasChildren || !section.content) {
              setExpanded(!expanded);
            } else {
              // Pour les sections avec contenu, on les ouvre sans les marquer comme visitées
              setExpanded(!expanded);
            }
          }}
          activeOpacity={0.7}
        >
          <Card.Content style={sectionStyles.sectionHeader}>
            <View style={sectionStyles.sectionLeft}>
              {hasChildren && (
                <MaterialCommunityIcons
                  name={expanded ? 'chevron-down' : 'chevron-right'}
                  size={20}
                  color={theme.colors.onSurface}
                  style={{ marginRight: 8 }}
                />
              )}
              {!hasChildren && <View style={{ width: 8 }} />}
              
              <MaterialCommunityIcons
                name={hasChildren ? 'folder-outline' : 'file-document-outline'}
                size={18}
                color={colors.iconColor}
                style={{ marginRight: 12 }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  variant="bodyLarge"
                  style={{
                    color: isVisited ? colors.visitedTextColor : colors.textColor,
                    fontWeight: '600',
                  }}
                >
                  {section.title}
                </Text>
                {hasChildren && (
                  <Text
                    variant="bodySmall"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginTop: 4,
                    }}
                  >
                    {section.children?.length} sous-section
                    {(section.children?.length || 0) > 1 ? 's' : ''}
                  </Text>
                )}
              </View>
            </View>

            {isVisited && (
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={colors.checkColor}
              />
            )}
          </Card.Content>
        </TouchableOpacity>

        {!hasChildren && expanded && section.content && (
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
      </Card>

      {hasChildren && expanded && (
        <View style={{ marginTop: 8 }}>
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
