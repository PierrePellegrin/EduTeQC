import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../../services/api';
import { styles } from './ProfileScreen/styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

export const ResultsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['userResults', user?.id],
    queryFn: async () => {
      const response = await testsApi.getAllResultsForUser();
      return response?.results || [];
    },
    enabled: !!user?.id,
  });

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Mes résultats</Text>
      {isLoading && <ActivityIndicator />}
      {error && <Text>Erreur lors du chargement des résultats</Text>}
      <ScrollView style={{ flex: 1 }}>
        {data && data.length > 0 ? (
          data.map((result: any, idx: number) => (
            <View key={result.id || idx} style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <Text>Test : {result.test?.title || 'Inconnu'}</Text>
              <Text>Score : {result.score?.toFixed(1)}%</Text>
              <Text>Réussi : {result.passed ? 'Oui' : 'Non'}</Text>
              <Text>Date : {result.completedAt ? new Date(result.completedAt).toLocaleString() : '-'}</Text>
            </View>
          ))
        ) : (
          <Text>Aucun résultat trouvé.</Text>
        )}
      </ScrollView>
      <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>Retour</Button>
    </View>
  );
};
