import React from 'react';
import { View } from 'react-native';
import { Card, Text, Button, IconButton, Chip } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type CourseCardProps = {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    isPublished: boolean;
    _count?: {
      tests: number;
    };
  };
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.courseCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <View style={styles.courseHeader}>
          <View style={styles.courseInfo}>
            <View style={styles.titleRow}>
              <Text variant="titleLarge" style={[styles.courseTitleText, { color: theme.colors.onCardBackground }]}>
                {course.title}
              </Text>
            </View>
            <Text variant="bodyMedium" style={[styles.courseMeta, { color: theme.colors.onCardBackground }]}>
              {course.description}
            </Text>
            <View style={styles.chipContainer}>
              <Chip icon="tag" compact style={styles.chip}>
                {course.category}
              </Chip>
              {course._count?.tests && course._count.tests > 0 && (
                <Chip icon="file-document" compact style={styles.chip}>
                  {course._count.tests} test{course._count.tests > 1 ? 's' : ''}
                </Chip>
              )}
            </View>
            <Button
              mode={course.isPublished ? 'outlined' : 'contained'}
              icon={course.isPublished ? 'eye-off' : 'eye'}
              onPress={onTogglePublish}
              style={styles.publishButton}
              compact
            >
              {course.isPublished ? 'Dépublier' : 'Publier'}
            </Button>
          </View>
          <View style={styles.courseActions}>
            <IconButton
              icon="pencil"
              mode="contained-tonal"
              onPress={onEdit}
            />
            <IconButton
              icon="delete"
              mode="contained-tonal"
              iconColor={theme.colors.logoutColor}
              onPress={onDelete}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};
