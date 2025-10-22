import React from 'react';
import { Card, Text, Chip } from 'react-native-paper';
import { Course } from '../../../../types';
import { styles } from '../styles';
import { useSettings } from '../../../../contexts/SettingsContext';

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
  const { showImages } = useSettings();

  // Image par défaut si pas d'imageUrl
  const defaultImage = 'https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=' + encodeURIComponent(course.category);
  const imageSource = course.imageUrl || defaultImage;

  return (
    <Card
      style={[styles.card, { backgroundColor: cardBg }]}
      onPress={onPress}
    >
      {showImages && (
        <Card.Cover source={{ uri: imageSource }} style={styles.cover} />
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
