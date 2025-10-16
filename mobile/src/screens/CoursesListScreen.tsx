import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Chip, FAB, Searchbar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../services/api';
import { Course } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const CoursesListScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { theme } = useTheme();

  // Récupère les packages achetés
  const { data: userPackages, isLoading: loadingPackages } = useQuery({
    queryKey: ['userPackages'],
    queryFn: require('../services/api').adminApi.getUserPackages,
  });

  // Récupère tous les cours
  const { data, isLoading, error } = useQuery<{ courses?: Course[] }>({
    queryKey: ['courses'],
    queryFn: require('../services/api').coursesApi.getAll,
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

  const renderCourse = ({ item }: { item: Course }) => (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
    >
      {item.imageUrl && (
        <Card.Cover source={{ uri: item.imageUrl }} style={styles.cover} />
      )}
      <Card.Content style={styles.cardContent}>
        <Chip style={styles.chip} compact>
          {item.category}
        </Chip>
        <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onCardBackground }]}>
          {item.title}
        </Text>
        <Text variant="bodyMedium" numberOfLines={2} style={[styles.description, { color: theme.colors.onCardBackground }]}>
          {item.description}
        </Text>
      </Card.Content>
    </Card>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Erreur lors du chargement des cours</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher un cours..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>Aucun cours disponible</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cover: {
    height: 180,
  },
  cardContent: {
    paddingTop: 16,
  },
  chip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
    fontWeight: '600',
  },
  description: {
    opacity: 0.7,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
