import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, Card, Chip, Divider, List } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../../../contexts/ThemeContext';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { courseId: string } }, 'params'>;
};

export const CourseDetailScreen = ({ navigation, route }: Props) => {
  const { courseId } = route.params;
  const { theme } = useTheme();

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

        <Card style={[styles.contentCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onCardBackground }}>
              {course.content}
            </Text>
          </Card.Content>
        </Card>

        {course.tests && course.tests.length > 0 && (
          <>
            <Divider style={styles.divider} />

            <Text variant="titleLarge" style={styles.sectionTitle}>
              Tests disponibles
            </Text>

            {course.tests.map((test: any) => (
              <Card
                key={test.id}
                style={[styles.testCard, { backgroundColor: theme.colors.cardBackground }]}
                onPress={() => navigation.navigate('TestDetail', { testId: test.id })}
              >
                <Card.Content>
                  <View style={styles.testHeader}>
                    <Text variant="titleMedium" style={[styles.testTitle, { color: theme.colors.onCardBackground }]}>
                      {test.title}
                    </Text>
                    <Chip compact>{test.duration} min</Chip>
                  </View>
                  <Text variant="bodyMedium" style={[styles.testDescription, { color: theme.colors.onCardBackground }]}>
                    {test.description}
                  </Text>
                  <View style={styles.testFooter}>
                    <Text variant="bodySmall" style={{ color: theme.colors.onCardBackground }}>
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
