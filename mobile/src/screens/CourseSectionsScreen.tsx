import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionTree } from '../components/SectionTree';
import { ProgressBar } from '../components/ProgressBar';
import { sectionService } from '../services/sectionService';
import { progressService } from '../services/progressService';
import { CourseSection } from '../types';

type RootStackParamList = {
  CourseSections: { courseId: string; courseTitle: string };
  SectionDetail: { sectionId: string; courseId: string };
};

type CourseSectionsScreenRouteProp = RouteProp<RootStackParamList, 'CourseSections'>;
type CourseSectionsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CourseSections'>;

export const CourseSectionsScreen: React.FC = () => {
  const route = useRoute<CourseSectionsScreenRouteProp>();
  const navigation = useNavigation<CourseSectionsScreenNavigationProp>();
  const { courseId, courseTitle } = route.params;

  const [sections, setSections] = useState<CourseSection[]>([]);
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set());
  const [completionPercent, setCompletionPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSectionsAndProgress();
  }, [courseId]);

  const loadSectionsAndProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les sections et la progression en parallèle
      const [sectionsData, progressData, sectionProgressData] = await Promise.all([
        sectionService.getRootSections(courseId),
        progressService.getCourseProgress(courseId),
        progressService.getCourseSectionProgress(courseId),
      ]);

      setSections(sectionsData);
      setCompletionPercent(progressData.completionPercent);

      // Créer un Set des sections visitées
      const visited = new Set(
        sectionProgressData
          .filter((s) => s.progress.visited)
          .map((s) => s.id)
      );
      setVisitedSections(visited);
    } catch (err: any) {
      console.error('Erreur lors du chargement des sections:', err);
      setError(err.message || 'Erreur lors du chargement des sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionPress = (section: CourseSection) => {
    navigation.navigate('SectionDetail', {
      sectionId: section.id,
      courseId,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSectionsAndProgress}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête avec progression */}
      <View style={styles.header}>
        <Text style={styles.title}>{courseTitle}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progression</Text>
          <ProgressBar progress={completionPercent} height={8} />
          <Text style={styles.progressText}>{completionPercent}%</Text>
        </View>
      </View>

      {/* Arborescence des sections */}
      <SectionTree
        sections={sections}
        visitedSections={visitedSections}
        onSectionPress={handleSectionPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
});
