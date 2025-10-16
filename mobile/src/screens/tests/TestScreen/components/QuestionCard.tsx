import React from 'react';
import { View } from 'react-native';
import { Card, Text, RadioButton, Checkbox } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type QuestionCardProps = {
  question: {
    id: string;
    question: string;
    type: string;
    options: Array<{
      id: string;
      text: string;
    }>;
  };
  index: number;
  selectedAnswers: string[];
  onOptionSelect: (optionId: string, isMultiple: boolean) => void;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  selectedAnswers,
  onOptionSelect,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.questionCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.questionNumber, { color: theme.colors.onCardBackground }]}>
          Question {index + 1}
        </Text>
        <Text variant="bodyLarge" style={[styles.questionText, { color: theme.colors.onCardBackground }]}>
          {question.question}
        </Text>

        {question.type === 'SINGLE_CHOICE' ? (
          <RadioButton.Group
            onValueChange={(value) => onOptionSelect(value, false)}
            value={selectedAnswers[0] || ''}
          >
            {question.options.map((option) => (
              <View key={option.id} style={styles.optionRow}>
                <RadioButton value={option.id} />
                <Text
                  variant="bodyMedium"
                  style={[styles.optionText, { color: theme.colors.onCardBackground }]}
                  onPress={() => onOptionSelect(option.id, false)}
                >
                  {option.text}
                </Text>
              </View>
            ))}
          </RadioButton.Group>
        ) : (
          <View>
            {question.options.map((option) => (
              <View key={option.id} style={styles.optionRow}>
                <Checkbox
                  status={selectedAnswers.includes(option.id) ? 'checked' : 'unchecked'}
                  onPress={() => onOptionSelect(option.id, true)}
                />
                <Text
                  variant="bodyMedium"
                  style={[styles.optionText, { color: theme.colors.onCardBackground }]}
                  onPress={() => onOptionSelect(option.id, true)}
                >
                  {option.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};
