import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Button,
  Card,
  RadioButton,
  Checkbox,
  Surface,
  ProgressBar,
} from 'react-native-paper';
import { useQuery, useMutation } from '@tanstack/react-query';
import { testsApi } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { testId: string } }, 'params'>;
};

export const TestScreen = ({ navigation, route }: Props) => {
  const { testId } = route.params;
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { theme } = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ['test', testId],
    queryFn: () => testsApi.getById(testId),
  });

  const submitMutation = useMutation({
    mutationFn: (answers: Record<string, string[]>) =>
      testsApi.submit(testId, answers),
    onSuccess: (data) => {
      const result = data.result;
      Alert.alert(
        result.passed ? 'Félicitations! 🎉' : 'Test terminé',
        `Score: ${result.score.toFixed(1)}%\n${
          result.passed
            ? 'Vous avez réussi le test!'
            : 'Continuez vos efforts!'
        }`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    },
  });

  const test = data?.test;

  const handleOptionSelect = (questionId: string, optionId: string, isMultiple: boolean) => {
    setAnswers((prev) => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter((id) => id !== optionId)
          : [...currentAnswers, optionId];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleSubmit = () => {
    const totalQuestions = test?.questions.length || 0;
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      Alert.alert(
        'Questions non répondues',
        `Vous avez répondu à ${answeredQuestions}/${totalQuestions} questions. Voulez-vous continuer?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Soumettre',
            onPress: () => submitMutation.mutate(answers),
          },
        ]
      );
    } else {
      submitMutation.mutate(answers);
    }
  };

  if (isLoading || !test) {
    return (
      <View style={styles.centerContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const progress = Object.keys(answers).length / test.questions.length;

  return (
    <View style={styles.container}>
      <Surface style={[styles.header, { backgroundColor: theme.colors.transparent }]} elevation={2}>
        <Text variant="titleLarge">{test.title}</Text>
        <Text variant="bodyMedium" style={styles.headerInfo}>
          {test.questions.length} questions • {test.duration} minutes
        </Text>
        <ProgressBar progress={progress} style={styles.progress} />
      </Surface>

      <ScrollView contentContainerStyle={styles.content}>
        {test.questions.map((question: { id: React.Key | null | undefined; question: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; type: string; options: any[]; }, index: number) => (
          <Card key={String(question.id)} style={[styles.questionCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.questionNumber, { color: theme.colors.onCardBackground }]}>
                Question {index + 1}
              </Text>
              <Text variant="bodyLarge" style={[styles.questionText, { color: theme.colors.onCardBackground }]}>
                {question.question}
              </Text>

              {question.type === 'SINGLE_CHOICE' ? (
                <RadioButton.Group
                  onValueChange={(value) =>
                    handleOptionSelect(String(question.id), value, false)
                  }
                  value={answers[String(question.id)]?.[0] || ''}
                >
                  {question.options.map((option: { id: React.Key | null | undefined; text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                    <View key={String(option.id)} style={styles.optionRow}>
                      <RadioButton value={String(option.id)} />
                      <Text
                        variant="bodyMedium"
                        style={[styles.optionText, { color: theme.colors.onCardBackground }]}
                        onPress={() =>
                          handleOptionSelect(String(question.id), String(option.id), false)
                        }
                      >
                        {option.text}
                      </Text>
                    </View>
                  ))}
                </RadioButton.Group>
              ) : (
                <View>
                  {question.options.map((option: { id: any; text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                    <View key={String(option.id)} style={styles.optionRow}>
                      <Checkbox
                        status={
                          answers[String(question.id)]?.includes(String(option.id))
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() =>
                          handleOptionSelect(String(question.id), String(option.id), true)
                        }
                      />
                      <Text
                        variant="bodyMedium"
                        style={[styles.optionText, { color: theme.colors.onCardBackground }]}
                        onPress={() =>
                          handleOptionSelect(String(question.id), String(option.id), true)
                        }
                      >
                        {option.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        ))}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitMutation.isPending}
          disabled={submitMutation.isPending}
          style={styles.submitButton}
        >
          Soumettre le test
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerInfo: {
    marginTop: 4,
    opacity: 0.7,
  },
  progress: {
    marginTop: 12,
    height: 6,
    borderRadius: 3,
  },
  content: {
    padding: 16,
  },
  questionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  questionNumber: {
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  optionText: {
    flex: 1,
    marginLeft: 8,
  },
  submitButton: {
    marginVertical: 16,
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
