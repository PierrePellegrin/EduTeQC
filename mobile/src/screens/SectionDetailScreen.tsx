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
import { sectionService } from '../services/sectionService';
import { progressService } from '../services/progressService';
import { CourseSection } from '../types';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

type RootStackParamList = {
  SectionDetail: { sectionId: string; courseId: string };
  TestDetail: { testId: string };
};

type SectionDetailScreenRouteProp = RouteProp<RootStackParamList, 'SectionDetail'>;
type SectionDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SectionDetail'>;

export const SectionDetailScreen: React.FC = () => {
  const route = useRoute<SectionDetailScreenRouteProp>();
  const navigation = useNavigation<SectionDetailScreenNavigationProp>();
  const { sectionId, courseId } = route.params;

  const [section, setSection] = useState<CourseSection | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<Array<{ id: string; title: string }>>([]);
  const [nextSection, setNextSection] = useState<CourseSection | null>(null);
  const [previousSection, setPreviousSection] = useState<CourseSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSection();
  }, [sectionId]);

  const loadSection = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger la section, le fil d'Ariane et les sections adjacentes
      const [sectionData, breadcrumbData, nextData, prevData] = await Promise.all([
        sectionService.getSectionById(sectionId),
        sectionService.getSectionBreadcrumb(sectionId),
        sectionService.getNextSection(sectionId).catch(() => null),
        sectionService.getPreviousSection(sectionId).catch(() => null),
      ]);

      setSection(sectionData);
      setBreadcrumb(breadcrumbData);
      setNextSection(nextData);
      setPreviousSection(prevData);

      // Marquer la section comme visitée
      await progressService.markSectionVisited(sectionId);
    } catch (err: any) {
      console.error('Erreur lors du chargement de la section:', err);
      setError(err.message || 'Erreur lors du chargement de la section');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (targetSection: CourseSection) => {
    navigation.push('SectionDetail', {
      sectionId: targetSection.id,
      courseId,
    });
  };

  const handleTestPress = (testId: string) => {
    navigation.navigate('TestDetail', { testId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error || !section) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorText}>{error || 'Section introuvable'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSection}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Fil d'Ariane */}
        {breadcrumb.length > 0 && (
          <View style={styles.breadcrumbContainer}>
            {breadcrumb.map((item, index) => (
              <View key={item.id} style={styles.breadcrumbItem}>
                {index > 0 && (
                  <Icon name="chevron-right" size={16} color="#999" style={styles.breadcrumbSeparator} />
                )}
                <Text style={[
                  styles.breadcrumbText,
                  index === breadcrumb.length - 1 && styles.breadcrumbTextActive,
                ]}>
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Titre de la section */}
        <View style={styles.header}>
          <Text style={styles.title}>{section.title}</Text>
        </View>

        {/* Contenu de la section */}
        {section.content ? (
          <View style={styles.contentContainer}>
            <MarkdownRenderer content={section.content} />
          </View>
        ) : (
          <View style={styles.emptyContent}>
            <Icon name="text-box-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Cette section n'a pas encore de contenu</Text>
          </View>
        )}

        {/* Tests associés */}
        {section.tests && section.tests.length > 0 && (
          <View style={styles.testsContainer}>
            <Text style={styles.testsTitle}>Tests disponibles</Text>
            {section.tests.map((test) => (
              <TouchableOpacity
                key={test.id}
                style={styles.testCard}
                onPress={() => handleTestPress(test.id)}
              >
                <Icon name="clipboard-text-outline" size={24} color="#2196F3" />
                <View style={styles.testInfo}>
                  <Text style={styles.testTitle}>{test.title}</Text>
                  <Text style={styles.testDescription}>{test.description}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          {previousSection ? (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrev]}
              onPress={() => handleNavigate(previousSection)}
            >
              <Icon name="chevron-left" size={24} color="#2196F3" />
              <View style={styles.navButtonContent}>
                <Text style={styles.navButtonLabel}>Précédent</Text>
                <Text style={styles.navButtonTitle} numberOfLines={1}>
                  {previousSection.title}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.navButtonPlaceholder} />
          )}

          {nextSection && (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonNext]}
              onPress={() => handleNavigate(nextSection)}
            >
              <View style={styles.navButtonContent}>
                <Text style={styles.navButtonLabel}>Suivant</Text>
                <Text style={styles.navButtonTitle} numberOfLines={1}>
                  {nextSection.title}
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#2196F3" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  breadcrumbContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbSeparator: {
    marginHorizontal: 4,
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#999',
  },
  breadcrumbTextActive: {
    color: '#333',
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  emptyContent: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 8,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  testsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  testsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  testCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  testInfo: {
    flex: 1,
    marginLeft: 12,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  testDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 8,
    gap: 8,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  navButtonPrev: {
    marginRight: 4,
  },
  navButtonNext: {
    marginLeft: 4,
  },
  navButtonPlaceholder: {
    flex: 1,
  },
  navButtonContent: {
    flex: 1,
  },
  navButtonLabel: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 4,
  },
  navButtonTitle: {
    fontSize: 14,
    color: '#333',
  },
});
