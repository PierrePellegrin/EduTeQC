import React, { useMemo, useState, useCallback, useDeferredValue } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Searchbar, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { adminApi } from '../../../services/api';
import { styles } from './styles';
import { AccordionGroup, PackageCard } from './components';
import { useTheme } from '../../../contexts/ThemeContext';
import { MemoizedSegmentedButtons } from '../../../components';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'type';

export const PackagesListScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Récupérer les packages achetés
  const { data: userPackages, isLoading } = useQuery({
    queryKey: ['userPackages', 'v2'],
    queryFn: adminApi.getUserPackages,
  });

  // On travaille avec un tableau de packages simples
  const purchasedPackages = useMemo(() => {
    return (userPackages || []).map((up: any) => up.package).filter(Boolean);
  }, [userPackages]);

  // Filtre (useDeferredValue)
  const filteredPackages = useMemo(() => {
    if (!deferredSearchQuery) return purchasedPackages;
    const q = deferredSearchQuery.toLowerCase();
    return purchasedPackages.filter((pkg: any) =>
      pkg.name.toLowerCase().includes(q) || pkg.description?.toLowerCase().includes(q)
    );
  }, [purchasedPackages, deferredSearchQuery]);

  // Grouping (même logique que AdminPackagesScreen)
  const groupedPackages = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', title: 'Tous', data: filteredPackages }];
    }

    const groups: Record<string, any[]> = {};
    if (groupBy === 'type') {
      filteredPackages.forEach((pkg: any) => {
        let key = 'Autre';
        const name = (pkg.name || '').toLowerCase();

        if (name.includes('primaire') || name.includes('collège') || name.includes('lycée')) {
          if (name.includes('français') || name.includes('mathématiques') || name.includes('histoire')) {
            key = 'Par cycle et matière';
          } else {
            key = 'Par cycle';
          }
        } else if (name.includes('cp') || name.includes('ce1') || name.includes('ce2') ||
                   name.includes('cm1') || name.includes('cm2') || name.includes('6ème') ||
                   name.includes('5ème') || name.includes('4ème') || name.includes('3ème') ||
                   name.includes('2nd') || name.includes('1ère') || name.includes('terminale')) {
          key = 'Par niveau';
        } else if (name.includes('français') || name.includes('mathématiques') || name.includes('histoire')) {
          key = 'Par matière';
        }

        if (!groups[key]) groups[key] = [];
        groups[key].push(pkg);
      });
    }

    return Object.entries(groups).map(([key, data]) => ({ key, title: key, data }));
  }, [filteredPackages, groupBy]);

  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  }, []);

  const renderPackageItem = useCallback(({ item }: { item: any }) => (
    <PackageCard
      package={item}
      isPurchased={true}
      showBuyButton={false}
      onCoursesPress={() => navigation.navigate('PackageDetail', { packageId: item.id })}
    />
  ), [navigation]);

  const renderGroupItem = useCallback(({ item }: { item: { key: string; title: string; data: any[] } }) => {
    if (groupBy === 'none') return null;
    const isExpanded = expandedGroups[item.key] === true;
    return (
      <AccordionGroup
        title={item.title}
        icon={'shape'}
        expanded={isExpanded}
        count={item.data.length}
        themeColors={{
          cardBackground: theme.colors.cardBackground,
          onCardBackground: theme.colors.onCardBackground,
          primary: theme.colors.primary,
        }}
        onToggle={() => toggleGroup(item.key)}
      >
        {item.data.map((pkg: any) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            isPurchased={true}
            showBuyButton={false}
            onCoursesPress={() => navigation.navigate('PackageDetail', { packageId: pkg.id })}
          />
        ))}
      </AccordionGroup>
    );
  }, [expandedGroups, groupBy, navigation, toggleGroup]);

  if (isLoading) {
    return (
      <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="titleLarge">Chargement des forfaits...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Rechercher"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: 8 }}
        />
        <MemoizedSegmentedButtons
          value={groupBy}
          onValueChange={(value) => setGroupBy(value as GroupBy)}
          buttons={[
            { value: 'none', label: 'Tous', icon: 'view-list' },
            { value: 'type', label: 'Type', icon: 'shape' },
          ]}
        />
      </View>

      {filteredPackages.length > 0 && groupBy === 'none' && (
        <FlatList
          data={filteredPackages}
          renderItem={renderPackageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          windowSize={5}
          removeClippedSubviews
          initialNumToRender={8}
        />
      )}

      {filteredPackages.length > 0 && groupBy !== 'none' && (
        <FlatList
          data={groupedPackages}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.content}
          windowSize={5}
          removeClippedSubviews
          initialNumToRender={4}
        />
      )}

      {filteredPackages.length === 0 && (
        <View style={[styles.content, { paddingTop: 32 }]}>
          <Text style={{ textAlign: 'center', opacity: 0.6 }}>Aucun forfait acheté.</Text>
        </View>
      )}

      <FAB
        icon="cart"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => navigation.navigate('PackagesShop')}
      />
    </View>
  );
};
