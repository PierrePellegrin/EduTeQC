import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Chip, Divider, List } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

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

      <View style={styles.content}>
        <Chip style={styles.chip}>{course.category}</Chip>

        <Text variant="headlineMedium" style={styles.title}>
          {course.title}
        </Text>

        <Text variant="bodyLarge" style={styles.description}>
          {course.description}
        </Text>

        <Divider style={styles.divider} />

        <Text variant="titleLarge" style={styles.sectionTitle}>
          Contenu du cours
        </Text>

        <Card style={styles.contentCard}>
          <Card.Content>
            <Text variant="bodyMedium">{course.content}</Text>
          </Card.Content>
        </Card>

        {course.tests && course.tests.length > 0 && (
          <>
            <Divider style={styles.divider} />

            <Text variant="titleLarge" style={styles.sectionTitle}>
              Tests disponibles
            </Text>

            {course.tests.map((test) => (
              <Card
                key={test.id}
                style={styles.testCard}
                onPress={() => navigation.navigate('TestDetail', { testId: test.id })}
              >
                <Card.Content>
                  <View style={styles.testHeader}>
                    <Text variant="titleMedium" style={styles.testTitle}>
                      {test.title}
                    </Text>
                    <Chip compact>{test.duration} min</Chip>
                  </View>
                  <Text variant="bodyMedium" style={styles.testDescription}>
                    {test.description}
                  </Text>
                  <View style={styles.testFooter}>
                    <Text variant="bodySmall">
                      Score minimum: {test.passingScore}%
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    height: 250,
  },
  content: {
    padding: 16,
  },
  chip: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  title: {
    marginBottom: 12,
    fontWeight: '600',
  },
  description: {
    marginBottom: 16,
    opacity: 0.8,
  },
  divider: {
    marginVertical: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  contentCard: {
    marginBottom: 16,
    elevation: 1,
  },
  testCard: {
    marginBottom: 12,
    elevation: 2,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testTitle: {
    flex: 1,
    marginRight: 8,
    fontWeight: '500',
  },
  testDescription: {
    opacity: 0.7,
    marginBottom: 12,
  },
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
