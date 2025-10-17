import React, { useState, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, ActivityIndicator, Card, Chip, Searchbar, SegmentedButtons } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../../../services/api';
import { styles } from './styles';
import { useTheme } from '../../../contexts/ThemeContext';

type GroupBy = 'none' | 'course' | 'category';

export const ResultsScreen = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');

  const { data, isLoading, error } = useQuery({
    queryKey: ['userResults'],
    queryFn: async () => {
      const response = await testsApi.getAllResultsForUser();
      return response?.results || [];
    },
  });

  // Filter and group results
  const { groupedResults, hasResults } = useMemo(() => {
    let filtered = Array.isArray(data) ? [...data] : [];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((result: any) => {
        const testTitle = result?.test?.title?.toLowerCase() || '';
        const courseTitle = result?.test?.course?.title?.toLowerCase() || '';
        const category = result?.test?.course?.category?.toLowerCase() || '';
        return testTitle.includes(query) || courseTitle.includes(query) || category.includes(query);
      });
    }

    // Sort by date desc
    filtered.sort((a: any, b: any) => {
      const tb = b?.completedAt ? new Date(b.completedAt).getTime() : 0;
      const ta = a?.completedAt ? new Date(a.completedAt).getTime() : 0;
      return tb - ta;
    });

    let grouped: Record<string, any[]> = {};

    if (groupBy === 'course') {
      // Group by course
      filtered.forEach((result: any) => {
        const courseTitle = result?.test?.course?.title || 'Sans cours';
        if (!grouped[courseTitle]) grouped[courseTitle] = [];
        grouped[courseTitle].push(result);
      });
    } else if (groupBy === 'category') {
      // Group by category (package-like)
      filtered.forEach((result: any) => {
        const category = result?.test?.course?.category || 'Sans catégorie';
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(result);
      });
    } else {
      // No grouping
      grouped['all'] = filtered;
    }

    return {
      groupedResults: grouped,
      hasResults: filtered.length > 0,
    };
  }, [data, searchQuery, groupBy]);

  const formatDateTime = (value?: string) => {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '-';
    try {
      return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' } as any);
    } catch {
      return d.toLocaleString();
    }
  };

  const renderResultCard = (result: any, idx: number) => (
    <Card key={result.id || idx} style={[styles.resultCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Cover
        source={{ uri: result?.test?.imageUrl || 'https://via.placeholder.com/800x400?text=Test' }}
        style={styles.cardCover}
      />
      <Card.Content>
        <Text variant="titleMedium" style={styles.cardTitle}>
          {result.test?.title || 'Inconnu'}
        </Text>
        {result?.test?.course && (
          <Text variant="bodySmall" style={styles.courseInfo}>
            📚 {result.test.course.title}
          </Text>
        )}
        <View style={styles.chipContainer}>
          {(() => {
            const scoreNum = typeof result.score === 'number' ? result.score : undefined;
            const passThreshold = typeof result?.test?.passingScore === 'number' ? result.test.passingScore : undefined;
            const meets = typeof scoreNum === 'number' && typeof passThreshold === 'number' && scoreNum >= passThreshold;
            const chipStyle = [
              styles.chip,
              meets ? { backgroundColor: theme.colors.successContainer } : null,
            ];
            const textStyle = meets ? { color: theme.colors.onSuccessContainer } : undefined;
            return (
              <Chip compact icon="percent" style={chipStyle as any} textStyle={textStyle as any}>
                {typeof result.score === 'number' ? result.score.toFixed(1) : '-'}%
              </Chip>
            );
          })()}
          <Chip compact icon={result.passed ? 'check-circle' : 'close-circle'} style={styles.chip}>
            {result.passed ? 'Réussi' : 'Échoué'}
          </Chip>
        </View>
        <View style={styles.chipContainer}>
          <Chip compact icon="calendar" style={styles.chip}>
            {formatDateTime(result.completedAt)}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={[styles.content, styles.centerContent]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.content}>
        <Text>Erreur lors du chargement des résultats</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>Mes résultats</Text>
        
        <Searchbar
          placeholder="Rechercher..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <SegmentedButtons
          value={groupBy}
          onValueChange={(value) => setGroupBy(value as GroupBy)}
          buttons={[
            { value: 'none', label: 'Tous', icon: 'view-list' },
            { value: 'course', label: 'Par cours', icon: 'book' },
            { value: 'category', label: 'Par matière', icon: 'folder' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {hasResults ? (
          Object.keys(groupedResults).map((groupKey) => (
            <View key={groupKey}>
              {groupBy !== 'none' && (
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  {groupKey}
                </Text>
              )}
              {groupedResults[groupKey].map((result: any, idx: number) =>
                renderResultCard(result, idx)
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            {searchQuery ? 'Aucun résultat ne correspond à votre recherche.' : 'Aucun résultat trouvé.'}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
