import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { coursesApi, adminApi } from '../../../services/api';
import { Course } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourseCard, EmptyState } from './components';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const CoursesListScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = React.useState('');

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

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <EmptyState message="Erreur lors du chargement des cours" />;
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
};
