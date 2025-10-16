import React from 'react';
import { Card, Text, Chip } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Course } from '../../../../types';
import { styles } from '../styles';

type CourseCardProps = {
  course: Course;
  onPress: () => void;
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const { theme } = useTheme();

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}
      onPress={onPress}
    >
      {course.imageUrl && (
        <Card.Cover source={{ uri: course.imageUrl }} style={styles.cover} />
      )}
      <Card.Content style={styles.cardContent}>
        <Chip style={styles.chip} compact>
          {course.category}
        </Chip>
        <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onCardBackground }]}>
          {course.title}
        </Text>
        <Text variant="bodyMedium" numberOfLines={2} style={[styles.description, { color: theme.colors.onCardBackground }]}>
          {course.description}
        </Text>
      </Card.Content>
    </Card>
  );
};
