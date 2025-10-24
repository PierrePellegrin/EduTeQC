import React from 'react';
import { View } from 'react-native';
import { Card, Text, Chip, ProgressBar } from 'react-native-paper';
import { Course } from '../../../../types';
import { styles } from '../styles';
import { useSettings } from '../../../../contexts/SettingsContext';

type CourseCardProps = {
  course: Course;
  onPress: () => void;
  progress?: number; // Pourcentage de progression (0-100)
  theme?: {
    cardBackground: string;
    onCardBackground: string;
    primary: string;
  };
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, progress, theme }) => {
  const cardBg = theme?.cardBackground || '#FFFFFF';
  const textColor = theme?.onCardBackground || '#000000';
  const primaryColor = theme?.primary || '#4A90E2';
  const { showImages } = useSettings();

  const defaultImage = 'https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=' + encodeURIComponent(course.category);
  const imageSource = course.imageUrl || defaultImage;

  const hasProgress = progress !== undefined && progress > 0;

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
        
        {hasProgress && (
          <View style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text variant="bodySmall" style={{ color: textColor, opacity: 0.7 }}>
                Progression
              </Text>
              <Text variant="bodySmall" style={{ color: primaryColor, fontWeight: 'bold' }}>
                {Math.round(progress)}%
              </Text>
            </View>
            <ProgressBar
              progress={progress / 100}
              color={primaryColor}
              style={{ height: 6, borderRadius: 3 }}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};
