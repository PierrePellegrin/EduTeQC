import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CourseContent, TestsList } from './components';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { courseId: string } }, 'params'>;
};

export const CourseDetailScreen = ({ navigation, route }: Props) => {
  const { courseId } = route.params;

  const { data, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesApi.getById(courseId),
  });

  const course = data?.course;

  if (isLoading || !course) {
    return (
      <View style={styles.centerContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {course.imageUrl && (
        <Card.Cover source={{ uri: course.imageUrl }} style={styles.cover} />
      )}

      <CourseContent course={course} />

      <TestsList
        tests={course.tests}
        onNavigateToTest={(testId) => navigation.navigate('TestDetail', { testId })}
      />
    </ScrollView>
  );
};
