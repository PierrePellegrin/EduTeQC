import React, { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, ActivityIndicator, List, Card } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { useTheme } from '../../../contexts/ThemeContext';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { packageId: string } }, 'params'>;
};

export const PackageDetailScreen = ({ navigation, route }: Props) => {
  const { packageId } = route.params;
  const { theme } = useTheme();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Récupérer les détails du package
  const { data: packageData, isLoading } = useQuery({
    queryKey: ['package', packageId],
    queryFn: async () => {
      const packages = await adminApi.getAllPackages();
      return packages.packages.find((p: any) => p.id === packageId);
    },
  });

  // Grouper les cours par catégorie
  const coursesByCategory = useMemo(() => {
    if (!packageData?.courses) return {};

    const groups: Record<string, any[]> = {};
    packageData.courses.forEach((pc: any) => {
      const course = pc.course;
      const category = course.category || 'Sans catégorie';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(course);
    });

    return groups;
  }, [packageData]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!packageData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Package non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {packageData.name}
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          {packageData.description}
        </Text>
        <Text variant="titleMedium" style={styles.coursesCount}>
          {packageData.courses?.length || 0} cours disponibles
        </Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        {Object.entries(coursesByCategory).map(([category, courses]) => (
          <List.Accordion
            key={category}
            title={category}
            description={`${courses.length} cours`}
            left={props => <List.Icon {...props} icon="folder" />}
            expanded={expandedCategories[category] || false}
            onPress={() => toggleCategory(category)}
            style={styles.accordion}
          >
            {courses.map((course: any) => (
              <Card
                key={course.id}
                style={[styles.courseCard, { backgroundColor: theme.colors.cardBackground }]}
                onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
              >
                {course.imageUrl && (
                  <Card.Cover source={{ uri: course.imageUrl }} style={styles.cover} />
                )}
                <Card.Content>
                  <Text variant="titleMedium" style={styles.courseTitle}>
                    {course.title}
                  </Text>
                  <Text variant="bodySmall" numberOfLines={2} style={styles.courseDescription}>
                    {course.description}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </List.Accordion>
        ))}
      </ScrollView>
    </View>
  );
};
