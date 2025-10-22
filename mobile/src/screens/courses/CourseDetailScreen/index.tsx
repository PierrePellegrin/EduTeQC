import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CourseContent, TestsList } from './components';
import { styles } from './styles';
import { useSettings } from '../../../contexts/SettingsContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { courseId: string } }, 'params'>;
};

export const CourseDetailScreen = ({ navigation, route }: Props) => {
  const { courseId } = route.params;
  // Convertir courseId en string au cas où il serait passé comme number
  const courseIdString = String(courseId);
  const { showImages } = useSettings();

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', courseIdString],
    queryFn: () => coursesApi.getById(courseIdString),
  });

  const course = data?.course;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Erreur lors du chargement du cours</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cours introuvable</Text>
      </View>
    );
  }

  // Image par défaut si pas d'imageUrl
  const defaultImage = 'https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=' + encodeURIComponent(course.category);
  const imageSource = course.imageUrl || defaultImage;

  return (
    <ScrollView style={styles.container}>
      {showImages && (
        <Card.Cover source={{ uri: imageSource }} style={styles.cover} />
      )}

      <CourseContent course={course} />

      <TestsList
        tests={course.tests}
        onNavigateToTest={(testId) => navigation.navigate('TestDetail', { testId })}
      />
    </ScrollView>
  );
};
