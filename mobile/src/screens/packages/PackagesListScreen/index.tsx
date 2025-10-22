import React, { useMemo, useState, useCallback, useDeferredValue } from 'react';
import { View, FlatList } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { adminApi } from '../../../services/api';
import { styles } from './styles';
import { AccordionGroup, PackageCard, FilterMenu, PackageFilterState } from './components';
import { useTheme } from '../../../contexts/ThemeContext';
import { MemoizedSegmentedButtons, CustomSearchbar } from '../../../components';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'type';

export const PackagesListScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState<PackageFilterState>({
    search: '',
    category: null,
    cycle: null,
  });
  const deferredSearchQuery = useDeferredValue(filters.search);
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

  // Extraire catégories et cycles uniques
  const categories = useMemo(() => {
    const cats = new Set<string>();
    purchasedPackages.forEach((pkg: any) => {
      pkg.courses?.forEach((pc: any) => {
        if (pc.course?.category) cats.add(pc.course.category);
      });
    });
    return Array.from(cats).sort();
  }, [purchasedPackages]);

  const cycles = useMemo(() => {
    const cyc = new Set<string>();
    purchasedPackages.forEach((pkg: any) => {
      pkg.courses?.forEach((pc: any) => {
        if (pc.course?.niveau?.cycle?.name) cyc.add(pc.course.niveau.cycle.name);
      });
    });
    return Array.from(cyc).sort();
  }, [purchasedPackages]);

  // Filtre avancé
  const filteredPackages = useMemo(() => {
    let filtered = purchasedPackages;
    // Filtre recherche
    if (deferredSearchQuery) {
      const q = deferredSearchQuery.toLowerCase();
      filtered = filtered.filter((pkg: any) =>
        pkg.name.toLowerCase().includes(q) || pkg.description?.toLowerCase().includes(q)
      );
    }
    // Filtre catégorie
    if (filters.category) {
      filtered = filtered.filter((pkg: any) =>
        pkg.courses?.some((pc: any) => pc.course?.category === filters.category)
      );
    }
    // Filtre cycle
    if (filters.cycle) {
      filtered = filtered.filter((pkg: any) =>
        pkg.courses?.some((pc: any) => pc.course?.niveau?.cycle?.name === filters.cycle)
      );
    }
    return filtered;
  }, [purchasedPackages, deferredSearchQuery, filters.category, filters.cycle]);

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
      <FilterMenu
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        cycles={cycles}
      />

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
