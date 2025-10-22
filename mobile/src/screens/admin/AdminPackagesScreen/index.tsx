import React, { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { View, FlatList, InteractionManager } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../contexts/ThemeContext';
import { MemoizedSegmentedButtons } from '../../../components';
import { PackageForm, PackagesList, EmptyState, AccordionGroup, FilterMenu, PackageAdminFilterState } from './components';
import { styles } from './styles';
import { usePackageMutations } from './consts';

// Types
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'type';

export const AdminPackagesScreen = ({ navigation }: Props) => {
  // Single useTheme() call at parent level
  const { theme } = useTheme();
  const themeColors = useMemo(() => ({
    cardBackground: theme.colors.cardBackground,
    onCardBackground: theme.colors.onCardBackground,
    logoutColor: theme.colors.logoutColor,
    primary: theme.colors.primary,
    outline: theme.colors.outline,
  }), [theme]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [filters, setFilters] = useState<PackageAdminFilterState>({
    search: '',
    category: null,
    cycle: null,
  });
  const deferredSearchQuery = useDeferredValue(filters.search);
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  // Initialize all groups as CLOSED for performance
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const { data: packages, isLoading } = useQuery({
    queryKey: ['adminPackages'],
    queryFn: adminApi.getAllPackages,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: courses } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: adminApi.getAllCourses,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
    });
    setSelectedCourses([]);
  }, []);

  const { createMutation, updateMutation, deleteMutation, toggleActiveMutation } = usePackageMutations(
    resetForm,
    setShowCreateForm,
    setEditingPackage
  );

  // Wrap mutations with InteractionManager to prevent UI blocking
  const handleToggleActive = useCallback((id: string, isActive: boolean, name: string) => {
    InteractionManager.runAfterInteractions(() => {
      toggleActiveMutation?.mutate({ id, data: { isActive: !isActive } });
    });
  }, [toggleActiveMutation]);

  const handleEdit = useCallback((pkg: any) => {
    setEditingPackage(pkg);
    setShowCreateForm(true);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      imageUrl: pkg.imageUrl || '',
    });
    setSelectedCourses(pkg.courses?.map((c: any) => c.course.id) || []);
  }, []);

  const handleDelete = useCallback((id: string, name: string) => {
    InteractionManager.runAfterInteractions(() => {
      deleteMutation?.mutate(id);
    });
  }, [deleteMutation]);

  const handleSubmit = useCallback(() => {
    if (!formData.name || !formData.description || !formData.price) {
      return;
    }
    if (selectedCourses.length === 0) {
      return;
    }
    
    const data = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl || undefined,
      courseIds: selectedCourses,
    };

    InteractionManager.runAfterInteractions(() => {
      if (editingPackage) {
        updateMutation?.mutate({ id: editingPackage.id, data });
      } else {
        createMutation?.mutate(data);
      }
    });
  }, [formData, selectedCourses, editingPackage, createMutation, updateMutation]);

  const toggleCourse = useCallback((courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  }, [selectedCourses]);

  const handleCancelForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingPackage(null);
    resetForm();
  }, [resetForm]);

  // Extraire catégories et cycles uniques depuis les cours des packages
  const { categories, cycles } = useMemo(() => {
    const catsSet = new Set<string>();
    const cyclesSet = new Set<string>();
    
    (packages?.packages || []).forEach((pkg: any) => {
      pkg.courses?.forEach((pc: any) => {
        if (pc.course?.category) {
          catsSet.add(pc.course.category);
        }
        if (pc.course?.cycle) {
          cyclesSet.add(pc.course.cycle);
        }
      });
    });
    
    return {
      categories: Array.from(catsSet).sort(),
      cycles: Array.from(cyclesSet).sort(),
    };
  }, [packages?.packages]);

  // Filter packages avancé
  const filteredPackages = useMemo(() => {
    let filtered = packages?.packages || [];
    
    // Filtre recherche
    if (deferredSearchQuery) {
      const query = deferredSearchQuery.toLowerCase();
      filtered = filtered.filter((pkg: any) =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.description?.toLowerCase().includes(query)
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
        pkg.courses?.some((pc: any) => pc.course?.cycle === filters.cycle)
      );
    }
    
    return filtered;
  }, [packages?.packages, deferredSearchQuery, filters.category, filters.cycle]);

  // Group packages
  const groupedPackages = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', title: 'Tous', data: filteredPackages }];
    }

    const groups: Record<string, any[]> = {};

    if (groupBy === 'type') {
      filteredPackages.forEach((pkg: any) => {
        let key = 'Autre';
        const name = pkg.name.toLowerCase();
        
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
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  }, []);

  // Eliminate course duplicates by ID
  const uniqueCourses = useMemo(() => 
    courses?.courses?.reduce((acc: any[], course: any) => {
      if (!acc.find(c => c.id === course.id)) {
        acc.push(course);
      }
      return acc;
    }, []) || []
  , [courses?.courses]);

  // FlatList render functions
  const renderPackageItem = useCallback(({ item }: { item: any }) => (
    <PackagesList
      packages={[item]}
      themeColors={themeColors}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={handleToggleActive}
    />
  ), [themeColors, handleEdit, handleDelete, handleToggleActive]);

  const renderGroupItem = useCallback(({ item }: { item: { key: string; title: string; data: any[] } }) => {
    if (groupBy === 'none') {
      // Flat list for "Tous" mode
      return null; // Will use FlatList directly
    }

    const icon = 'shape';
    // Groups are CLOSED by default for performance
    const isExpanded = expandedGroups[item.key] === true;

    return (
      <AccordionGroup
        title={item.title}
        count={item.data.length}
        icon={icon}
        expanded={isExpanded}
        themeColors={themeColors}
        onToggle={() => toggleGroup(item.key)}
      >
        <PackagesList
          packages={item.data}
          themeColors={themeColors}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </AccordionGroup>
    );
  }, [groupBy, expandedGroups, themeColors, toggleGroup, handleEdit, handleDelete, handleToggleActive]);

  const keyExtractor = useCallback((item: any, index: number) => {
    return item.id || item.key || index.toString();
  }, []);

  // Optimized getItemLayout for FlatList - enables instant scroll to any position
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: 100, // Approximate item height
    offset: 100 * index,
    index,
  }), []);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="titleLarge">Chargement des packages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterMenu
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        cycles={cycles}
      />

      {!showCreateForm && filteredPackages.length > 0 && (
        <View style={styles.header}>
          <MemoizedSegmentedButtons
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as GroupBy)}
            buttons={[
              { value: 'none', label: 'Tous', icon: 'view-list' },
              { value: 'type', label: 'Type', icon: 'shape' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
      )}

      {showCreateForm && (
        <PackageForm
          formData={formData}
          selectedCourses={selectedCourses}
          availableCourses={uniqueCourses}
          isEditing={!!editingPackage}
          isLoading={(createMutation?.isPending || false) || (updateMutation?.isPending || false)}
          onFormChange={setFormData}
          onToggleCourse={toggleCourse}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {!showCreateForm && filteredPackages.length > 0 && groupBy === 'none' && (
        <FlatList
          data={filteredPackages}
          renderItem={renderPackageItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={5}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          initialNumToRender={8}
          contentContainerStyle={styles.content}
        />
      )}

      {!showCreateForm && filteredPackages.length > 0 && groupBy !== 'none' && (
        <FlatList
          data={groupedPackages}
          renderItem={renderGroupItem}
          keyExtractor={keyExtractor}
          windowSize={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          initialNumToRender={4}
          contentContainerStyle={styles.content}
        />
      )}

      {!showCreateForm && !filteredPackages.length && (
        <EmptyState hasSearchQuery={!!deferredSearchQuery} />
      )}

      {!showCreateForm && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowCreateForm(true)}
        />
      )}
    </View>
  );
};
