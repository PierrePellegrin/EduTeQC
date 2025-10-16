import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { styles } from './styles';
import { usePackageMutations } from './consts';
import { PackagesSection } from './components';

export const PackagesListScreen = () => {
  const queryClient = useQueryClient();

  // Packages disponibles
  const { data: packages, isLoading } = useQuery({
    queryKey: ['clientPackages'],
    queryFn: adminApi.getAllPackages,
  });

  // Packages achetés
  const { data: userPackages } = useQuery({
    queryKey: ['userPackages'],
    queryFn: adminApi.getUserPackages,
  });

  // Achat package
  const { buyMutation } = usePackageMutations(queryClient);

  if (isLoading) {
    return <Text>Chargement...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <PackagesSection
        title="Packages disponibles"
        packages={packages?.packages || []}
        userPackages={userPackages}
        onBuy={(packageId) => buyMutation.mutate(packageId)}
      />

      <PackagesSection
        title="Mes packages achetés"
        packages={userPackages || []}
        isPurchasedSection
      />
    </ScrollView>
  );
};
