import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CourseSection } from '../types';

interface SectionItemProps {
  section: CourseSection;
  level: number;
  isExpanded: boolean;
  isVisited?: boolean;
  onPress: (section: CourseSection) => void;
  onToggleExpand: (sectionId: string) => void;
}

export const SectionItem: React.FC<SectionItemProps> = ({
  section,
  level,
  isExpanded,
  isVisited = false,
  onPress,
  onToggleExpand,
}) => {
  const hasChildren = section.children && section.children.length > 0;
  const hasTests = section.tests && section.tests.length > 0;
  const marginLeft = level * 20;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.sectionRow, { marginLeft }]}
        onPress={() => onPress(section)}
        activeOpacity={0.7}
      >
        {/* Icône d'expansion si la section a des enfants */}
        {hasChildren ? (
          <TouchableOpacity
            onPress={() => onToggleExpand(section.id)}
            style={styles.expandButton}
          >
            <Icon
              name={isExpanded ? 'chevron-down' : 'chevron-right'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.expandButton} />
        )}

        {/* Icône de la section */}
        <View style={styles.iconContainer}>
          <Icon
            name={hasChildren ? 'folder-outline' : 'file-document-outline'}
            size={24}
            color={isVisited ? '#4CAF50' : '#2196F3'}
          />
        </View>

        {/* Titre de la section */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, isVisited && styles.visitedTitle]}>
            {section.title}
          </Text>
          {hasTests && (
            <View style={styles.badge}>
              <Icon name="clipboard-text-outline" size={14} color="#FF9800" />
              <Text style={styles.badgeText}>{section.tests?.length || 0} test(s)</Text>
            </View>
          )}
        </View>

        {/* Indicateur de visite */}
        {isVisited && (
          <Icon name="check-circle" size={20} color="#4CAF50" />
        )}
      </TouchableOpacity>

      {/* Sous-sections (si développées) */}
      {hasChildren && isExpanded && (
        <View>
          {section.children!.map((child) => (
            <SectionItem
              key={child.id}
              section={child}
              level={level + 1}
              isExpanded={false} // Par défaut, les sous-sections ne sont pas développées
              onPress={onPress}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  expandButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  visitedTitle: {
    color: '#666',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
  },
});
