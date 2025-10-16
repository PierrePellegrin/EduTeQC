import React from 'react';
import { View } from 'react-native';
import { Card, Text, Button, IconButton, Chip } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type TestCardProps = {
  test: {
    id: string;
    title: string;
    description?: string;
    duration: number;
    passingScore: number;
    isPublished: boolean;
    imageUrl?: string;
    course?: {
      title: string;
    };
    questions?: any[];
  };
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onNavigateToQuestions: () => void;
};

export const TestCard: React.FC<TestCardProps> = ({
  test,
  onEdit,
  onDelete,
  onTogglePublish,
  onNavigateToQuestions,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.testCard, { backgroundColor: theme.colors.cardBackground }]}> 
      <Card.Cover source={{ uri: test.imageUrl || 'https://via.placeholder.com/800x400?text=Test' }} />
      <Card.Content>
        <View style={styles.testHeader}>
          <View style={styles.testInfo}>
            <View style={styles.titleRow}>
              <Text variant="titleLarge" style={styles.testTitleText}>{test.title}</Text>
            </View>
            <Text variant="bodyMedium" style={styles.testMeta}>
              Durée: {test.duration} min • Score min: {test.passingScore}%
            </Text>
            <View style={styles.chipContainer}>
              <Chip icon="book" compact style={styles.chip}>
                {test.course?.title || 'Cours non trouvé'}
              </Chip>
              <Chip icon="help-circle" compact style={styles.chip}>
                {test.questions?.length || 0} {test.questions?.length === 1 ? 'question' : 'questions'}
              </Chip>
            </View>
            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                icon="format-list-checks"
                onPress={onNavigateToQuestions}
                style={styles.questionsButton}
                compact
              >
                Questions
              </Button>
              <Button
                mode={test.isPublished ? 'outlined' : 'contained'}
                icon={test.isPublished ? 'eye-off' : 'eye'}
                onPress={onTogglePublish}
                style={styles.publishButton}
                compact
              >
                {test.isPublished ? 'Dépublier' : 'Publier'}
              </Button>
            </View>
          </View>
          <View style={styles.testActions}>
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
