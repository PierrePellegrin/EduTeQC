import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../../../services/api';
import { progressApi } from '../../../services/progress.api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CourseContent, TestsList, SectionsList, ProgressCard } from './components';
import { styles } from './styles';
import { useSettings } from '../../../contexts/SettingsContext';
import { useTheme } from '../../../contexts/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { courseId: string } }, 'params'>;
};

export const CourseDetailScreen = ({ navigation, route }: Props) => {
  const { courseId } = route.params;
  const courseIdString = String(courseId);
  const { showImages } = useSettings();
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ['course', courseIdString],
    queryFn: () => coursesApi.getById(courseIdString),
  });

  const { data: progressData, isLoading: isProgressLoading } = useQuery({
    queryKey: ['course-progress', courseIdString],
    queryFn: () => progressApi.getCourseProgress(courseIdString),
    staleTime: 30000, // 30 secondes
  });

  // Récupérer la progression détaillée des sections
  const { data: sectionProgressData } = useQuery({
    queryKey: ['section-progress', courseIdString],
    queryFn: async () => {
      const response = await progressApi.getCourseSectionProgress(courseIdString);
      return response;
    },
    staleTime: 30000,
  });

  // Mutation pour marquer/démarquer une section comme visitée
  const toggleSectionMutation = useMutation({
    mutationFn: ({ sectionId, visited }: { sectionId: string; visited: boolean }) =>
      progressApi.toggleSectionVisited(sectionId, visited),
    onSuccess: () => {
      // Invalider la progression du cours ET des sections
      queryClient.invalidateQueries({ queryKey: ['course-progress', courseIdString] });
      queryClient.invalidateQueries({ queryKey: ['section-progress', courseIdString] });
      queryClient.invalidateQueries({ queryKey: ['all-progress'] }); // Pour mettre à jour la liste des cours
    },
    onError: (error: any) => {
      console.error('Erreur lors de la mise à jour de la progression:', error);
    },
  });

  // Construire un Set des sections visitées pour un accès rapide
  const visitedSections = useMemo(() => {
    const visited = new Set<string>();
    if (sectionProgressData?.sections) {
      sectionProgressData.sections.forEach((section: any) => {
        if (section.progress?.visited) {
          visited.add(section.id);
        }
      });
    }
    return visited;
  }, [sectionProgressData]);

  // Construire l'arbre de sections
  const buildSectionTree = (sections: any[]) => {
    if (!sections) return [];
    
    const map = new Map();
    const roots: any[] = [];

    sections.forEach((section: any) => {
      map.set(section.id, { ...section, children: [], visited: visitedSections.has(section.id) });
    });

    sections.forEach((section: any) => {
      const node = map.get(section.id);
      if (section.parentId) {
        const parent = map.get(section.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    const sortByOrder = (items: any[]) => {
      return items.sort((a, b) => a.order - b.order).map((item) => {
        if (item.children && item.children.length > 0) {
          item.children = sortByOrder(item.children);
        }
        return item;
      });
    };

    return sortByOrder(roots);
  };

  // Compter le nombre total de sections (récursif)
  const countSections = (sections: any[]): number => {
    let count = 0;
    sections.forEach((section) => {
      count++;
      if (section.children && section.children.length > 0) {
        count += countSections(section.children);
      }
    });
    return count;
  };

  const handleSectionToggle = (sectionId: string, visited: boolean) => {
    toggleSectionMutation.mutate({ sectionId, visited });
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Réinitialiser la progression',
      'Êtes-vous sûr de vouloir réinitialiser votre progression sur ce cours ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              await progressApi.resetCourseProgress(courseIdString);
              queryClient.invalidateQueries({ queryKey: ['course-progress', courseIdString] });
              Alert.alert('Succès', 'Progression réinitialisée');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réinitialiser la progression');
            }
          },
        },
      ]
    );
  };

  const course = courseData?.course;
  const sections = course?.sections || [];
  const sectionTree = buildSectionTree(sections);
  const totalSections = countSections(sectionTree);
  const visitedCount = visitedSections.size;
  const completionPercent = progressData?.progress?.completionPercent || 0;
  const lastAccessedAt = progressData?.progress?.lastAccessedAt;

  if (isLoading || isProgressLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Erreur lors du chargement du cours</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cours introuvable</Text>
      </View>
    );
  }

  const defaultImage = 'https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=' + encodeURIComponent(course.category);
  const imageSource = course.imageUrl || defaultImage;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {showImages && (
        <Card.Cover source={{ uri: imageSource }} style={styles.cover} />
      )}

      <CourseContent course={course} />

      <View style={{ paddingHorizontal: 16, backgroundColor: theme.colors.background }}>
        <ProgressCard
          completionPercent={completionPercent}
          visitedSectionsCount={visitedCount}
          totalSectionsCount={totalSections}
          lastAccessedAt={lastAccessedAt}
        />

        <Divider style={{ marginVertical: 16 }} />

        <Text variant="titleLarge" style={styles.sectionTitle}>
          Contenu du cours
        </Text>

        <SectionsList
          sections={sectionTree}
          visitedSections={visitedSections}
          onSectionToggle={handleSectionToggle}
        />

        <Button
          mode="outlined"
          onPress={handleResetProgress}
          style={{ marginTop: 16, marginBottom: 8 }}
          icon="refresh"
        >
          Réinitialiser la progression
        </Button>
      </View>

      <Divider style={{ marginVertical: 16, marginHorizontal: 16 }} />

      <TestsList
        tests={course.tests}
        onNavigateToTest={(testId) => navigation.navigate('TestDetail', { testId })}
      />
    </ScrollView>
  );
};
