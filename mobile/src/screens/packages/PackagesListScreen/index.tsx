import React, { useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, IconButton, Chip } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { useTheme } from '../../../contexts/ThemeContext';
import { styles } from './styles';
import { usePackageMutations } from './consts';

export const PackagesListScreen = () => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();

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
      <Text variant="titleLarge" style={styles.sectionTitle}>Packages disponibles</Text>
      {packages?.packages?.map((pkg: any) => (
        <Card key={pkg.id} style={[styles.packageCard, { backgroundColor: theme.colors.cardBackground }]}> 
          <Card.Content>
            <Text variant="titleMedium" style={styles.packageTitle}>{pkg.name}</Text>
            <Text style={styles.packageDesc}>{pkg.description}</Text>
            <View style={styles.chipContainer}>
              <Chip icon="currency-eur" compact style={styles.chip}>{pkg.price.toFixed(2)} €</Chip>
              <Chip icon="book-multiple" compact style={styles.chip}>{pkg.courses?.length || 0} cours</Chip>
            </View>
            <Button
              mode="contained"
              onPress={() => buyMutation.mutate(pkg.id)}
              disabled={userPackages?.some((up: any) => up.packageId === pkg.id)}
              style={styles.buyButton}
            >
              {userPackages?.some((up: any) => up.packageId === pkg.id) ? 'Déjà acheté' : 'Acheter'}
            </Button>
          </Card.Content>
        </Card>
      ))}

      <Text variant="titleLarge" style={styles.sectionTitle}>Mes packages achetés</Text>
      {userPackages?.length === 0 && <Text style={styles.emptyText}>Aucun package acheté.</Text>}
      {userPackages?.map((up: any) => (
        <Card key={up.id} style={[styles.packageCard, { backgroundColor: theme.colors.cardBackground }]}> 
          <Card.Content>
            <Text variant="titleMedium" style={styles.packageTitle}>{up.package.name}</Text>
            <Text style={styles.packageDesc}>{up.package.description}</Text>
            <View style={styles.chipContainer}>
              <Chip icon="currency-eur" compact style={styles.chip}>{up.package.price.toFixed(2)} €</Chip>
              <Chip icon="book-multiple" compact style={styles.chip}>{up.package.courses?.length || 0} cours</Chip>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};
