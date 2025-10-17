import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, List } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { adminApi } from '../../../services/api';
import { styles } from './styles';
import { usePackageMutations } from './consts';
import { PackagesSection } from './components';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const PackagesListScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    available: true,
    purchased: true,
  });

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

  // Filtrer les packages disponibles pour retirer ceux déjà achetés
  const availablePackages = (packages?.packages || []).filter((pkg: any) => {
    return !userPackages?.some((up: any) => up.packageId === pkg.id);
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return <Text>Chargement...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <List.Accordion
        title="Forfaits disponibles"
        left={props => <List.Icon {...props} icon="cart" />}
        expanded={expandedSections['available'] || false}
        onPress={() => toggleSection('available')}
        style={styles.accordion}
      >
        <PackagesSection
          packages={availablePackages}
          userPackages={userPackages}
          onBuy={(packageId) => buyMutation.mutate(packageId)}
          onCoursesPress={(packageId) => navigation.navigate('PackageDetail', { packageId })}
        />
      </List.Accordion>

      <List.Accordion
        title="Mes forfaits achetés"
        left={props => <List.Icon {...props} icon="package-variant-closed" />}
        expanded={expandedSections['purchased'] || false}
        onPress={() => toggleSection('purchased')}
        style={styles.accordion}
      >
        <PackagesSection
          packages={userPackages || []}
          isPurchasedSection
          onCoursesPress={(packageId) => navigation.navigate('PackageDetail', { packageId })}
        />
      </List.Accordion>
    </ScrollView>
  );
};
