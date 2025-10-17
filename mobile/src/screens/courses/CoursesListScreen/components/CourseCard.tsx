import React from 'react';
import { Card, Text, Chip } from 'react-native-paper';
import { Course } from '../../../../types';
import { styles } from '../styles';

type CourseCardProps = {
  course: Course;
  onPress: () => void;
  theme?: {
    cardBackground: string;
    onCardBackground: string;
    primary: string;
  };
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, theme }) => {
  // Fallback to default colors if theme not provided
  const cardBg = theme?.cardBackground || '#FFFFFF';
  const textColor = theme?.onCardBackground || '#000000';

  return (
    <Card
      style={[styles.card, { backgroundColor: cardBg }]}
      onPress={onPress}
    >
      {course.imageUrl && (
        <Card.Cover source={{ uri: course.imageUrl }} style={styles.cover} />
      )}
      <Card.Content style={styles.cardContent}>
        <Chip style={styles.chip} compact>
          {course.category}
        </Chip>
        <Text variant="titleLarge" style={[styles.title, { color: textColor }]}>
          {course.title}
        </Text>
        <Text variant="bodyMedium" numberOfLines={2} style={[styles.description, { color: textColor }]}>
          {course.description}
        </Text>
      </Card.Content>
    </Card>
  );
};
