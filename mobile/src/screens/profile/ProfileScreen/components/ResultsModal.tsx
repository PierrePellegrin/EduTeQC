import React from 'react';
import { Modal, Portal, Text, Button, ActivityIndicator } from 'react-native-paper';
import { View, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../../../../services/api';

interface ResultsModalProps {
  visible: boolean;
  onClose: () => void;
  user: { id: string };
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ visible, onClose, user }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userResults', user?.id],
    queryFn: async () => {
      const response = await testsApi.getAllResultsForUser();
      return response?.results || [];
    },
    enabled: visible && !!user?.id,
  });

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{ backgroundColor: 'white', margin: 24, borderRadius: 12, padding: 16 }}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>Mes résultats</Text>
        {isLoading && <ActivityIndicator />}
        {error && <Text>Erreur lors du chargement des résultats</Text>}
        <ScrollView style={{ maxHeight: 400 }}>
          {data && data.length > 0 ? (
            data.map((result: any, idx: number) => (
              <View key={result.id || idx} style={{ marginBottom: 16 }}>
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
        <Button mode="contained" onPress={onClose} style={{ marginTop: 16 }}>Fermer</Button>
      </Modal>
    </Portal>
  );
};
