import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, ScrollView, Alert, Animated } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi, testsApi } from '../../../services/api';
import { progressApi } from '../../../services/progress.api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CourseContent, TestsList, SectionsList, ProgressCard } from './components';
import { MemoizedSegmentedButtons } from '../../../components';
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

  // État pour gérer les tabs
  const [activeTab, setActiveTab] = useState<'course' | 'tests'>('course');

  // Refs pour l'animation sticky
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickyTabs, setShowStickyTabs] = useState(false);

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

  // Récupérer les résultats des tests pour vérifier les tests réussis
  const { data: testResultsData } = useQuery({
    queryKey: ['test-results'],
    queryFn: async () => {
      const response = await testsApi.getAllResultsForUser();
      return response?.results || [];
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

  // Fonction pour vérifier si un test est réussi
  const isTestPassed = (testId: string) => {
    if (!testResultsData) return false;
    const testResults = testResultsData.filter((result: any) => result.testId === testId);
    if (testResults.length === 0) return false;
    // Prendre le meilleur résultat
    const bestResult = testResults.reduce((best: any, current: any) => 
      current.score > best.score ? current : best
    );
    return bestResult.passed;
  };

  // Fonction pour trouver les tests associés à une section
  const getTestsForSection = (sectionId: string, sectionsArray: any[]): any[] => {
    for (const section of sectionsArray) {
      if (section.id === sectionId) {
        return section.tests || [];
      }
      if (section.children && section.children.length > 0) {
        const found = getTestsForSection(sectionId, section.children);
        if (found.length > 0) return found;
      }
    }
    return [];
  };

  const handleSectionToggle = (sectionId: string, visited: boolean) => {
    // Si on essaie de valider la section (visited = true), vérifier les tests
    if (visited) {
      const sectionTests = getTestsForSection(sectionId, sectionTree);
      if (sectionTests.length > 0) {
        const unpassedTests = sectionTests.filter(test => !isTestPassed(test.id));
        if (unpassedTests.length > 0) {
          Alert.alert(
            'Tests requis',
            `Vous devez réussir ${unpassedTests.length === 1 ? 'le test associé' : 'les tests associés'} à cette section avant de pouvoir la valider.\n\nTest${unpassedTests.length > 1 ? 's' : ''} non réussi${unpassedTests.length > 1 ? 's' : ''} :\n${unpassedTests.map(test => `• ${test.title}`).join('\n')}`,
            [
              { text: 'Annuler', style: 'cancel' },
              { 
                text: 'Aller aux tests', 
                onPress: () => setActiveTab('tests')
              }
            ]
          );
          return;
        }
      }
    }
    
    toggleSectionMutation.mutate({ sectionId, visited });
  };

  const handleFinishCourse = () => {
    // Vérifier les tests globaux du cours
    const courseTests = course.tests || [];
    const globalTests = courseTests.filter((test: any) => !test.sectionId); // Tests globaux (non associés à une section)
    const unpassedGlobalTests = globalTests.filter((test: any) => !isTestPassed(test.id));

    // Vérifier les sections non validées
    const allSections = sectionTree;
    const unvalidatedSections: any[] = [];
    
    const checkSectionsValidation = (sections: any[]) => {
      sections.forEach(section => {
        if (section.isValidatable && !visitedSections.has(section.id)) {
          unvalidatedSections.push(section);
        }
        if (section.children && section.children.length > 0) {
          checkSectionsValidation(section.children);
        }
      });
    };
    
    checkSectionsValidation(allSections);

    // S'il y a des éléments non complétés, demander confirmation
    if (unpassedGlobalTests.length > 0 || unvalidatedSections.length > 0) {
      let message = 'Le cours ne semble pas être complètement terminé :\n\n';
      
      if (unpassedGlobalTests.length > 0) {
        message += `• ${unpassedGlobalTests.length} test${unpassedGlobalTests.length > 1 ? 's' : ''} global${unpassedGlobalTests.length > 1 ? 'aux' : ''} non réussi${unpassedGlobalTests.length > 1 ? 's' : ''}\n`;
      }
      
      if (unvalidatedSections.length > 0) {
        message += `• ${unvalidatedSections.length} section${unvalidatedSections.length > 1 ? 's' : ''} non validée${unvalidatedSections.length > 1 ? 's' : ''}\n`;
      }
      
      message += '\nÊtes-vous sûr de vouloir terminer le cours ?';

      Alert.alert(
        'Terminer le cours',
        message,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Terminer quand même', 
            style: 'destructive',
            onPress: () => finalizeCourse()
          }
        ]
      );
    } else {
      // Tout est complété, terminer directement
      Alert.alert(
        'Félicitations !',
        'Vous avez terminé tous les éléments du cours. Voulez-vous marquer ce cours comme terminé ?',
        [
          { text: 'Pas maintenant', style: 'cancel' },
          { 
            text: 'Terminer le cours', 
            onPress: () => finalizeCourse()
          }
        ]
      );
    }
  };

  const finalizeCourse = () => {
    // Pour l'instant, on affiche juste un message
    // Plus tard, on pourrait ajouter une API pour marquer le cours comme terminé
    Alert.alert(
      'Cours terminé !',
      'Félicitations ! Vous avez terminé ce cours. Vous pouvez toujours y revenir pour réviser.',
      [{ text: 'OK' }]
    );
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

  // Calculer la hauteur approximative avant les tabs
  const headerHeight = useMemo(() => {
    let height = 0;
    if (showImages) height += 250; // hauteur de l'image
    height += 150; // hauteur approximative du CourseContent (titre + description + chips)
    height += 56; // hauteur des tabs eux-mêmes
    return height;
  }, [showImages]);

  // Gestion du scroll pour sticky tabs
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const scrollOffset = event.nativeEvent.contentOffset.y;
        // Les tabs sticky apparaissent exactement quand les tabs normaux disparaissent
        setShowStickyTabs(scrollOffset >= headerHeight);
      },
    }
  );

  // Rendu des tabs (composant réutilisable)
  const renderTabs = (isSticky = false) => (
    <View style={[
      { paddingHorizontal: 16, paddingVertical: 8 },
      isSticky && {
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outline,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    ]}>
      <MemoizedSegmentedButtons
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'course' | 'tests')}
        buttons={[
          { value: 'course', label: 'Cours', icon: 'book-open' },
          { value: 'tests', label: 'Tests', icon: 'file-document' },
        ]}
        style={{ marginBottom: isSticky ? 0 : 8 }}
      />
    </View>
  );

  // Rendu du contenu de l'onglet Cours
  const renderCourseTab = () => (
    <View style={{ 
      paddingHorizontal: 16, 
      backgroundColor: theme.colors.background,
      // Pas de padding top conditionnel - on laisse le contenu normal
    }}>
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
        onNavigateToTest={(testId) => navigation.navigate('TestDetail', { testId })}
      />

      <Button
        mode="outlined"
        onPress={handleResetProgress}
        style={{ marginTop: 16, marginBottom: 8 }}
        icon="refresh"
      >
        Réinitialiser la progression
      </Button>

      <Button
        mode="contained"
        onPress={handleFinishCourse}
        style={{ marginTop: 8, marginBottom: 16 }}
        icon="check-circle"
      >
        Terminer le cours
      </Button>
    </View>
  );

  // Rendu du contenu de l'onglet Tests
  const renderTestsTab = () => (
    <View style={{ 
      paddingHorizontal: 16, 
      backgroundColor: theme.colors.background, 
      paddingTop: 16,
    }}>
      <TestsList
        tests={course.tests}
        onNavigateToTest={(testId) => navigation.navigate('TestDetail', { testId })}
        sections={sectionTree}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        {showImages && (
          <Card.Cover source={{ uri: imageSource }} style={styles.cover} />
        )}

        <CourseContent course={course} />

        {/* Tabs intégrés dans le scroll - masqués quand sticky est actif */}
        {!showStickyTabs && renderTabs(false)}

        {/* Contenu des onglets */}
        <View style={showStickyTabs ? { paddingTop: 64 } : {}}>
          {activeTab === 'course' && renderCourseTab()}
          {activeTab === 'tests' && renderTestsTab()}
        </View>
      </Animated.ScrollView>

      {/* Tabs sticky en position absolue */}
      {showStickyTabs && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}>
          {renderTabs(true)}
        </View>
      )}
    </View>
  );
};
