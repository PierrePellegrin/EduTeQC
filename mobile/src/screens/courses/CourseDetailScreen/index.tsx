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

  const { data: courseData, isLoading, error, refetch } = useQuery({
    queryKey: ['course', courseIdString],
    queryFn: async () => {
      const data = await coursesApi.getById(courseIdString);
      return data;
    },
    staleTime: 0, // Forcer le rechargement
    refetchOnMount: 'always', // Toujours recharger au montage
    refetchOnWindowFocus: false,
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
    onMutate: async ({ sectionId, visited }) => {
      // Annule les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: ['section-progress', courseIdString] });
      // Sauvegarde l'état précédent
      const previousSectionProgress = queryClient.getQueryData(['section-progress', courseIdString]);
      // Mise à jour optimiste avec propagation de la dévalidation aux parents
      queryClient.setQueryData(['section-progress', courseIdString], (old: any) => {
        if (!old || !old.sections) return old;
        // On construit une map id -> section pour retrouver les parents
        const sectionMap = new Map();
        old.sections.forEach((section: any) => {
          sectionMap.set(section.id, section);
        });

        // Fonction pour remonter et dévalider tous les parents
        const getAllParentIds = (id: string, acc: Set<string> = new Set()) => {
          const section = sectionMap.get(id);
          if (section && section.parentId) {
            acc.add(section.parentId);
            getAllParentIds(section.parentId, acc);
          }
          return acc;
        };

        let idsToUpdate = [sectionId];
        if (visited === false) {
          // Si on dévalide, on dévalide tous les parents
          idsToUpdate = [sectionId, ...Array.from(getAllParentIds(sectionId))];
        }

        return {
          ...old,
          sections: old.sections.map((section: any) =>
            idsToUpdate.includes(section.id)
              ? { ...section, progress: { ...section.progress, visited } }
              : section
          ),
        };
      });
      return { previousSectionProgress };
    },
    onError: (error: any, _variables, context: any) => {
      // Restaure l'état précédent en cas d'erreur
      if (context?.previousSectionProgress) {
        queryClient.setQueryData(['section-progress', courseIdString], context.previousSectionProgress);
      }
      console.error('Erreur lors de la mise à jour de la progression:', error);
    },
    onSettled: () => {
      // Rafraîchit la progression des sections (léger)
      queryClient.invalidateQueries({ queryKey: ['section-progress', courseIdString] });
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

  // Nettoyer un éventuel H1/H2 égal au titre en tête du contenu
  const cleanContentAgainstTitle = (title?: string, content?: string) => {
    if (typeof content !== 'string') return '';
    const raw = content.trim();
    if (!title) return raw;
    const t = title.trim().toLowerCase();
    let c = raw;
    const lines = c.split(/\r?\n/);
    if (lines.length > 0) {
      const first = lines[0].trim().toLowerCase();
      const headingLine = first.replace(/^#{1,6}\s*/, '').trim();
      if (headingLine === t) {
        lines.shift();
        if (lines.length > 0 && /^(===+|---+)$/.test(lines[0].trim())) {
          lines.shift();
        }
        c = lines.join('\n').trim();
      } else if (lines.length > 1) {
        const line0 = lines[0].trim().toLowerCase();
        const line1 = lines[1].trim();
        if (line0 === t && /^(===+|---+)$/.test(line1)) {
          c = lines.slice(2).join('\n').trim();
        }
      }
    }
    return c.trim();
  };

  // Compter le nombre total de sections avec contenu (récursif, titre nettoyé)
  const countContentSections = (sections: any[]): number => {
    let count = 0;
    sections.forEach((section) => {
      const cleaned = cleanContentAgainstTitle(section.title, section.content);
      const hasContent = cleaned.length > 0;
      if (hasContent) count++;
      if (section.children && section.children.length > 0) {
        count += countContentSections(section.children);
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
  
  // L'API retourne déjà un arbre hiérarchique, pas besoin de buildSectionTree
  const sectionTree = sections;
  // Construire l'ensemble des IDs de sections avec contenu pour compter de façon cohérente
  const collectContentSectionIds = (sections: any[], acc: Set<string>) => {
    sections.forEach((section) => {
      // Utiliser le champ isValidatable du backend au lieu de la logique client
      if (section.isValidatable) {
        acc.add(section.id);
      }
      if (section.children && section.children.length > 0) {
        collectContentSectionIds(section.children, acc);
      }
    });
    return acc;
  };

  const contentSectionIds = collectContentSectionIds(sectionTree, new Set<string>());
  const totalSections = contentSectionIds.size;
  const visitedCount = Array.from(contentSectionIds).filter((id) => visitedSections.has(id)).length;
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
