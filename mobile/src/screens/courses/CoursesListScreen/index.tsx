import React, { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { View, FlatList } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { coursesApi, adminApi } from '../../../services/api';
import { Course } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MemoizedSegmentedButtons, LoadingScreen } from '../../../components';
import { CourseCard, EmptyState, AccordionGroup, FilterMenu, CourseFilterState } from './components';
import { styles } from './styles';
import { useTheme } from '../../../contexts/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'category' | 'package';

// Memoized course card to prevent unnecessary re-renders
const MemoizedCourseCard = React.memo(CourseCard, (prev, next) => 
  prev.course.id === next.course.id && 
  prev.course.title === next.course.title &&
  prev.course.category === next.course.category
);

export const CoursesListScreen = ({ navigation }: Props) => {
  const [filters, setFilters] = useState<CourseFilterState>({
    search: '',
    category: null,
    packageId: null,
  });
  const deferredSearchQuery = useDeferredValue(filters.search); // React 18 optimization
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  // Single useTheme() call at parent level
  const { theme } = useTheme();
  const themeColors = useMemo(() => ({
    cardBackground: theme.colors.cardBackground,
    onCardBackground: theme.colors.onCardBackground,
    primary: theme.colors.primary,
  }), [theme]);

  // Récupère les packages achetés
  const { data: userPackages, isLoading: loadingPackages } = useQuery({
    queryKey: ['userPackages', 'v2'],
    queryFn: adminApi.getUserPackages,
  });

  // Récupère tous les cours
  const { data, isLoading, error } = useQuery<{ courses?: Course[] }>({
    queryKey: ['courses', 'v2'],
    queryFn: coursesApi.getAll,
  });

  // Filtre les cours selon les packages achetés
  let courses: Course[] = Array.isArray(data?.courses) ? data.courses! : [];
  if (userPackages && Array.isArray(userPackages) && userPackages.length > 0) {
    const allowedCourseIds = userPackages.flatMap((up: any) => up.package.courses.map((c: any) => c.course.id));
    courses = courses.filter((course) => allowedCourseIds.includes(course.id));
  } else {
    courses = [];
  }

  // Extract unique categories and packages
  const categories = useMemo(() => {
    const cats = new Set<string>();
    courses.forEach((course) => {
      if (course.category) cats.add(course.category);
    });
    return Array.from(cats).sort();
  }, [courses]);

  const packages = useMemo(() => {
    if (!userPackages) return [];
    return userPackages.map((up: any) => ({
      id: up.packageId,
      name: up.package.name,
    }));
  }, [userPackages]);

  // Filtre par recherche, catégorie et package
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Filtre par recherche
    if (deferredSearchQuery) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(deferredSearchQuery.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (filters.category) {
      filtered = filtered.filter((course) => course.category === filters.category);
    }

    // Filtre par package
    if (filters.packageId) {
      const packageCourseIds = userPackages
        ?.find((up: any) => up.packageId === filters.packageId)
        ?.package.courses.map((c: any) => c.course.id) || [];
      filtered = filtered.filter((course) => packageCourseIds.includes(course.id));
    }

    return filtered;
  }, [courses, deferredSearchQuery, filters.category, filters.packageId, userPackages]);

  // Regroupement
  const groupedCourses = useMemo(() => {
    if (groupBy === 'none') {
      return { 'all': filteredCourses };
    }

    const groups: Record<string, Course[]> = {};

    if (groupBy === 'category') {
      filteredCourses.forEach((course) => {
        const key = course.category || 'Sans catégorie';
        if (!groups[key]) groups[key] = [];
        groups[key].push(course);
      });
    } else if (groupBy === 'package') {
      filteredCourses.forEach((course) => {
        // Trouver les packages associés à ce cours
        const relatedPackages = userPackages?.filter((up: any) =>
          up.package.courses.some((c: any) => c.course.id === course.id)
        );
        
        if (relatedPackages && relatedPackages.length > 0) {
          relatedPackages.forEach((up: any) => {
            const key = up.package.name || 'Sans forfait';
            if (!groups[key]) groups[key] = [];
            // Éviter les doublons
            if (!groups[key].find(c => c.id === course.id)) {
              groups[key].push(course);
            }
          });
        } else {
          const key = 'Sans forfait';
          if (!groups[key]) groups[key] = [];
          groups[key].push(course);
        }
      });
    }

    return groups;
  }, [filteredCourses, groupBy, userPackages]);

  // Memoized callbacks
  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  }, []);

  const handleCoursePress = useCallback((courseId: number) => {
    navigation.navigate('CourseDetail', { courseId });
  }, [navigation]);

  // FlatList renderItem for virtualization
  const renderCourseItem = useCallback(({ item }: { item: Course }) => (
    <MemoizedCourseCard
        course={item}
        onPress={() => handleCoursePress(Number(item.id))}
      theme={themeColors}
    />
  ), [handleCoursePress, themeColors]);

  const keyExtractor = useCallback((item: Course) => item.id.toString(), []);

  // Optimized getItemLayout for instant scrolling
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: 100, // Approximate height of course card
    offset: 100 * index,
    index,
  }), []);

  // Prepare data for FlatList (groups or flat list)
  const flatListData = useMemo(() => {
    if (groupBy === 'none') {
      return filteredCourses;
    }
    // For grouped view, we'll use a different structure
    return Object.entries(groupedCourses).map(([key, courses]) => ({
      type: 'group' as const,
      key,
      courses,
    }));
  }, [groupBy, filteredCourses, groupedCourses]);

  if (error) {
    return <EmptyState message="Erreur lors du chargement des cours" />;
  }

  if (isLoading || loadingPackages) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <FilterMenu
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        packages={packages}
      />

      {filteredCourses.length > 0 && (
        <View style={styles.header}>
          <MemoizedSegmentedButtons
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as GroupBy)}
            buttons={[
              { value: 'none', label: 'Tous', icon: 'view-list' },
              { value: 'category', label: 'Par matière', icon: 'folder' },
              { value: 'package', label: 'Par forfait', icon: 'package-variant' },
            ]}
          />
        </View>
      )}

      {filteredCourses.length === 0 ? (
        <EmptyState />
      ) : groupBy === 'none' ? (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={5}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          contentContainerStyle={styles.scrollContent}
        />
      ) : (
        <FlatList
          data={flatListData}
          keyExtractor={(item: any) => item.key}
          renderItem={({ item }: any) => (
            <AccordionGroup
              title={item.key}
                count={item.courses.length}
              icon={groupBy === 'category' ? 'folder' : 'package-variant'}
              expanded={expandedGroups[item.key] === true}
              themeColors={themeColors}
              onToggle={() => toggleGroup(item.key)}
            >
              {item.courses.map((course: Course) => (
                <MemoizedCourseCard
                  key={course.id}
                  course={course}
                    onPress={() => handleCoursePress(Number(course.id))}
                  theme={themeColors}
                />
              ))}
            </AccordionGroup>
          )}
          windowSize={5}
          removeClippedSubviews={true}
          contentContainerStyle={styles.scrollContent}
        />
      )}
    </View>
  );
};
