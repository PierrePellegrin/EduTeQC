import React, { useState, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, ActivityIndicator, Card, Chip, Searchbar, SegmentedButtons, List } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../../../services/api';
import { styles } from './styles';
import { useTheme } from '../../../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type GroupBy = 'none' | 'course' | 'category';

export const ResultsScreen = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

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

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const formatDateTime = (value?: string) => {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '-';
    try {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return '-';
    }
  };

  const renderResultCard = (result: any, idx: number) => (
    <Card key={result.id || idx} style={[styles.resultCard, { backgroundColor: theme.colors.cardBackground }]}>
      <View style={styles.cardImageContainer}>
        <Card.Cover
          source={{ uri: result?.test?.imageUrl || 'https://via.placeholder.com/800x400?text=Test' }}
          style={styles.cardCover}
        />
        <View style={[
          styles.statusChipOverlay,
          { backgroundColor: result.passed ? '#4CAF50' : '#F44336' }
        ]}>
          <Icon 
            name={result.passed ? 'check-circle' : 'close-circle'} 
            size={24} 
            color="#FFFFFF" 
          />
        </View>
      </View>
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
          <Chip compact icon="percent" style={styles.chip}>
            {typeof result.score === 'number' ? Math.round(result.score) : '-'}%
          </Chip>
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
          Object.keys(groupedResults).map((groupKey) => {
            const results = groupedResults[groupKey];
            const resultsCount = results.length;
            
            if (groupBy === 'none') {
              // No grouping - render all cards directly
              return results.map((result: any, idx: number) =>
                renderResultCard(result, idx)
              );
            }

            // Grouped view with accordion
            return (
              <List.Accordion
                key={groupKey}
                title={groupKey}
                description={`${resultsCount} résultat${resultsCount > 1 ? 's' : ''}`}
                left={(props) => <List.Icon {...props} icon={groupBy === 'course' ? 'book' : 'folder'} />}
                expanded={expandedGroups[groupKey] || false}
                onPress={() => toggleGroup(groupKey)}
                style={styles.accordion}
              >
                {results.map((result: any, idx: number) =>
                  renderResultCard(result, idx)
                )}
              </List.Accordion>
            );
          })
        ) : (
          <Text style={styles.emptyText}>
            {searchQuery ? 'Aucun résultat ne correspond à votre recherche.' : 'Aucun résultat trouvé.'}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
