import React from 'react';
import { View } from 'react-native';
import { Text, Chip, Divider, Card } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type CourseContentProps = {
  course: {
    category: string;
    title: string;
    description?: string;
    content?: string;
  };
};

export const CourseContent: React.FC<CourseContentProps> = ({ course }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.content}>
      <Chip style={styles.chip}>{course.category}</Chip>

      <Text variant="headlineMedium" style={styles.title}>
        {course.title}
      </Text>

      {course.description && (
        <Text variant="bodyLarge" style={styles.description}>
          {course.description}
        </Text>
      )}

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
    </View>
  );
};
