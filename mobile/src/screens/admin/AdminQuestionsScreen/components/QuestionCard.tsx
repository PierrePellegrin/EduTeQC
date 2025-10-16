import React from 'react';
import { View } from 'react-native';
import { Card, Text, IconButton, Chip } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type QuestionCardProps = {
  question: {
    id: string;
    question: string;
    type: string;
    points: number;
    order: number;
    options?: any[];
  };
  index: number;
  onEdit: () => void;
  onDelete: () => void;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.questionCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <View style={styles.questionHeader}>
          <View style={styles.questionInfo}>
            <Text variant="titleMedium">
              Question {index + 1}
            </Text>
            <Text variant="bodyLarge" style={styles.questionText}>
              {question.question}
            </Text>
            <View style={styles.chipContainer}>
              <Chip icon="format-list-bulleted" compact style={styles.chip}>
                {question.type === 'SINGLE_CHOICE' ? 'Choix unique' : 'Choix multiple'}
              </Chip>
              <Chip icon="star" compact style={styles.chip}>
                {question.points} pt{question.points > 1 ? 's' : ''}
              </Chip>
              <Chip icon="sort-numeric-ascending" compact style={styles.chip}>
                Ordre: {question.order}
              </Chip>
            </View>
            
            <Text variant="labelMedium" style={styles.optionsLabel}>
              Options ({question.options?.length || 0}):
            </Text>
            {question.options?.map((opt: any, optIndex: number) => (
              <View key={opt.id} style={styles.optionItem}>
                <Text variant="bodyMedium">
                  {optIndex + 1}. {opt.text}
                  {opt.isCorrect && ' ✓'}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.questionActions}>
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
