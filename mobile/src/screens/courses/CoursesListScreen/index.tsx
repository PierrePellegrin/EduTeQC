import React, { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Searchbar, SegmentedButtons, List, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { coursesApi, adminApi } from '../../../services/api';
import { Course } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourseCard, EmptyState } from './components';
import { styles } from './styles';
import { useTheme } from '../../../contexts/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type GroupBy = 'none' | 'category' | 'package';

export const CoursesListScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const { theme } = useTheme();

  // Récupère les packages achetés
  const { data: userPackages, isLoading: loadingPackages } = useQuery({
    queryKey: ['userPackages'],
    queryFn: adminApi.getUserPackages,
  });

  // Récupère tous les cours
  const { data, isLoading, error } = useQuery<{ courses?: Course[] }>({
    queryKey: ['courses'],
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

  // Filtre par recherche
  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

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
            const key = up.package.name || 'Sans package';
            if (!groups[key]) groups[key] = [];
            // Éviter les doublons
            if (!groups[key].find(c => c.id === course.id)) {
              groups[key].push(course);
            }
          });
        } else {
          const key = 'Sans package';
          if (!groups[key]) groups[key] = [];
          groups[key].push(course);
        }
      });
    }

    return groups;
  }, [filteredCourses, groupBy, userPackages]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const renderCourseCard = (course: Course) => (
    <CourseCard
      key={course.id}
      course={course}
      onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
    />
  );

  if (error) {
    return <EmptyState message="Erreur lors du chargement des cours" />;
  }

  if (isLoading || loadingPackages) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <SegmentedButtons
          value={groupBy}
          onValueChange={(value) => setGroupBy(value as GroupBy)}
          buttons={[
            { value: 'none', label: 'Tous', icon: 'view-list' },
            { value: 'category', label: 'Par matière', icon: 'folder' },
            { value: 'package', label: 'Par package', icon: 'package-variant' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView style={styles.scrollContent}>
        {filteredCourses.length === 0 ? (
          <EmptyState />
        ) : groupBy === 'none' ? (
          <View>
            {filteredCourses.map(renderCourseCard)}
          </View>
        ) : (
          <View>
            {Object.entries(groupedCourses).map(([groupKey, groupCourses]) => (
              <List.Accordion
                key={groupKey}
                title={groupKey}
                left={props => <List.Icon {...props} icon={groupBy === 'category' ? 'folder' : 'package-variant'} />}
                expanded={expandedGroups[groupKey] || false}
                onPress={() => toggleGroup(groupKey)}
                style={styles.accordion}
              >
                {groupCourses.map(renderCourseCard)}
              </List.Accordion>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
