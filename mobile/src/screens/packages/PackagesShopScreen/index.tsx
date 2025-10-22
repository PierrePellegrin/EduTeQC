import React, { useMemo, useState, useCallback, useDeferredValue } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, cyclesApi } from '../../../services/api';
import { usePackageMutations } from '../PackagesListScreen/consts';
import { AccordionGroup, PackageCard } from '../PackagesListScreen/components';
import { styles } from '../PackagesListScreen/styles';
import { MemoizedSegmentedButtons } from '../../../components';
import { useTheme } from '../../../contexts/ThemeContext';
import { FilterMenu, FilterState } from './components';

 type Props = {
   navigation: NativeStackNavigationProp<any>;
 };
 
 type GroupBy = 'none' | 'type';
 
 export const PackagesShopScreen = ({ navigation }: Props) => {
   const { theme } = useTheme();
   const queryClient = useQueryClient();
   const [filters, setFilters] = useState<FilterState>({
     search: '',
     cycleId: null,
     category: null,
     niveauId: null,
   });
   const deferredSearchQuery = useDeferredValue(filters.search);
   const [groupBy, setGroupBy] = useState<GroupBy>('none');
   const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
 
   const { data: packages, isLoading } = useQuery({
     queryKey: ['clientPackages', 'v2'],
     queryFn: adminApi.getAllPackages,
   });
 
   const { data: userPackages } = useQuery({
     queryKey: ['userPackages', 'v2'],
     queryFn: adminApi.getUserPackages,
   });

   const { data: cyclesData } = useQuery({
     queryKey: ['cycles'],
     queryFn: cyclesApi.getAllCycles,
   });

   const { data: niveauxData } = useQuery({
     queryKey: ['niveaux'],
     queryFn: cyclesApi.getAllNiveaux,
   });
 
   const { buyMutation } = usePackageMutations(queryClient);

   const cycles = cyclesData?.cycles || [];
   const niveaux = niveauxData?.niveaux || [];
 
   const availablePackages = useMemo(() => {
     const all = packages?.packages || [];
     return all.filter((pkg: any) => !userPackages?.some((up: any) => up.packageId === pkg.id));
   }, [packages?.packages, userPackages]);

   // Extract unique categories from packages
   const categories = useMemo(() => {
     const cats = new Set<string>();
     availablePackages.forEach((pkg: any) => {
       pkg.courses?.forEach((pc: any) => {
         if (pc.course?.category) {
           cats.add(pc.course.category);
         }
       });
     });
     return Array.from(cats).sort();
   }, [availablePackages]);
 
   const filteredPackages = useMemo(() => {
     let filtered = availablePackages;

     // Search filter
     if (deferredSearchQuery) {
       const q = deferredSearchQuery.toLowerCase();
       filtered = filtered.filter((pkg: any) =>
         pkg.name.toLowerCase().includes(q) || pkg.description?.toLowerCase().includes(q)
       );
     }

     // Category filter
     if (filters.category) {
       filtered = filtered.filter((pkg: any) =>
         pkg.courses?.some((pc: any) => pc.course?.category === filters.category)
       );
     }

     // Niveau filter (year/grade)
     if (filters.niveauId) {
       filtered = filtered.filter((pkg: any) =>
         pkg.courses?.some((pc: any) => pc.course?.niveauId === filters.niveauId)
       );
     }

     // Cycle filter (if niveau not selected)
     if (filters.cycleId && !filters.niveauId) {
       const cycleNiveauxIds = niveaux
         .filter((n: any) => n.cycleId === filters.cycleId)
         .map((n: any) => n.id);
       
       filtered = filtered.filter((pkg: any) =>
         pkg.courses?.some((pc: any) => cycleNiveauxIds.includes(pc.course?.niveauId))
       );
     }

     return filtered;
   }, [availablePackages, deferredSearchQuery, filters, niveaux]);
 
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
       showBuyButton
       onBuy={() => buyMutation.mutate(item.id)}
       onCoursesPress={() => navigation.navigate('PackageDetail', { packageId: item.id })}
     />
   ), [buyMutation, navigation]);
 
   const renderGroupItem = useCallback(({ item }: { item: { key: string; title: string; data: any[] } }) => {
     if (groupBy === 'none') return null;
     const isExpanded = expandedGroups[item.key] === true;
     return (
       <AccordionGroup
         title={item.title}
         icon={'shape'}
         expanded={isExpanded}
         count={item.data.length}
         onToggle={() => toggleGroup(item.key)}
         themeColors={{
           cardBackground: theme.colors.cardBackground,
           onCardBackground: theme.colors.onCardBackground,
           primary: theme.colors.primary,
         }}
       >
         {item.data.map((pkg: any) => (
           <PackageCard
             key={pkg.id}
             package={pkg}
             showBuyButton
             onBuy={() => buyMutation.mutate(pkg.id)}
             onCoursesPress={() => navigation.navigate('PackageDetail', { packageId: pkg.id })}
           />
         ))}
       </AccordionGroup>
     );
   }, [expandedGroups, groupBy, buyMutation, navigation, toggleGroup]);
 
   return (
     <View style={{ flex: 1 }}>
       <FilterMenu
         filters={filters}
         onFiltersChange={setFilters}
         cycles={cycles}
         niveaux={niveaux}
         categories={categories}
         filteredPackagesCount={filteredPackages.length}
       />

       {filteredPackages.length > 0 && (
         <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
           <MemoizedSegmentedButtons
             value={groupBy}
             onValueChange={(value) => setGroupBy(value as GroupBy)}
             buttons={[
               { value: 'none', label: 'Tous', icon: 'view-list' },
               { value: 'type', label: 'Type', icon: 'shape' },
             ]}
           />
         </View>
       )}
 
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
           <Text style={{ textAlign: 'center', opacity: 0.6 }}>Aucun forfait disponible.</Text>
         </View>
       )}
     </View>
   );
 };
 
 export default PackagesShopScreen;
