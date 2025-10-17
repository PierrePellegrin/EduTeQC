import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, ActivityIndicator, Card, Chip } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../../../services/api';
import { styles } from './styles';
import { useTheme } from '../../../contexts/ThemeContext';

export const ResultsScreen = () => {
  const { theme } = useTheme();
  const { data, isLoading, error } = useQuery({
    queryKey: ['userResults'],
    queryFn: async () => {
      const response = await testsApi.getAllResultsForUser();
      return response?.results || [];
    },
  });

  // Sort by completedAt desc
  const items = React.useMemo(() => {
    const arr = Array.isArray(data) ? [...data] : [];
    arr.sort((a: any, b: any) => {
      const tb = b?.completedAt ? new Date(b.completedAt).getTime() : 0;
      const ta = a?.completedAt ? new Date(a.completedAt).getTime() : 0;
      return tb - ta;
    });
    return arr;
  }, [data]);

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

  if (isLoading) {
    return (
      <View style={[styles.content, { alignItems: 'center' }]}>
        <ActivityIndicator />
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
    <ScrollView contentContainerStyle={styles.content}>
      <Text variant="titleLarge" style={styles.title}>Mes résultats</Text>
      {items && items.length > 0 ? (
        items.map((result: any, idx: number) => (
          <Card key={result.id || idx} style={{ marginBottom: 16, backgroundColor: theme.colors.cardBackground }}>
            <Card.Cover
              source={{ uri: result?.test?.imageUrl || 'https://via.placeholder.com/800x400?text=Test' }}
              style={{ height: 180 }}
            />
            <Card.Content>
              <Text variant="titleMedium" style={{ marginBottom: 6 }}>
                {result.test?.title || 'Inconnu'}
              </Text>
              <View style={{ flexDirection: 'row', marginHorizontal: -4 }}>
                {(() => {
                  const scoreNum = typeof result.score === 'number' ? result.score : undefined;
                  const passThreshold = typeof result?.test?.passingScore === 'number' ? result.test.passingScore : undefined;
                  const meets = typeof scoreNum === 'number' && typeof passThreshold === 'number' && scoreNum >= passThreshold;
                  const chipStyle = [
                    { margin: 4 },
                    meets ? { backgroundColor: theme.colors.successContainer } : null,
                  ];
                  const textStyle = meets ? { color: theme.colors.onSuccessContainer } : undefined;
                  return (
                    <Chip compact icon="percent" style={chipStyle as any} textStyle={textStyle as any}>
                      {typeof result.score === 'number' ? result.score.toFixed(1) : '-'}%
                    </Chip>
                  );
                })()}
                <Chip compact icon={result.passed ? 'check-circle' : 'close-circle'} style={{ margin: 4 }}>
                  {result.passed ? 'Réussi' : 'Échoué'}
                </Chip>
              </View>
              <View style={{ flexDirection: 'row', marginHorizontal: -4, marginTop: 4 }}>
                <Chip compact icon="calendar" style={{ margin: 4 }}>
                  {formatDateTime(result.completedAt)}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text style={styles.emptyText}>Aucun résultat trouvé.</Text>
      )}
    </ScrollView>
  );
};
