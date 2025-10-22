import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SectionItem } from './SectionItem';
import { CourseSection } from '../types';

interface SectionTreeProps {
  sections: CourseSection[];
  visitedSections?: Set<string>;
  onSectionPress: (section: CourseSection) => void;
  loading?: boolean;
}

export const SectionTree: React.FC<SectionTreeProps> = ({
  sections,
  visitedSections = new Set(),
  onSectionPress,
  loading = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Développer automatiquement les sections racines
  useEffect(() => {
    const rootIds = sections.map((s) => s.id);
    setExpandedSections(new Set(rootIds));
  }, [sections]);

  const toggleExpand = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Chargement des sections...</Text>
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune section disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SectionItem
            section={item}
            level={0}
            isExpanded={expandedSections.has(item.id)}
            isVisited={visitedSections.has(item.id)}
            onPress={onSectionPress}
            onToggleExpand={toggleExpand}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
