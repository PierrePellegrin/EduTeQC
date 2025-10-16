import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { styles } from './styles';
import { useTestMutations } from './consts';
import { TestHeader, QuestionCard } from './components';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { testId: string } }, 'params'>;
};

export const TestScreen = ({ navigation, route }: Props) => {
  const { testId } = route.params;
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['test', testId],
    queryFn: () => testsApi.getById(testId),
  });

  const { submitMutation } = useTestMutations(testId, (data) => {
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
      <TestHeader
        title={test.title}
        questionCount={test.questions.length}
        duration={test.duration}
        progress={progress}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {test.questions.map((question: any, index: number) => (
          <QuestionCard
            key={String(question.id)}
            question={question}
            index={index}
            selectedAnswers={answers[String(question.id)] || []}
            onOptionSelect={(optionId, isMultiple) =>
              handleOptionSelect(String(question.id), optionId, isMultiple)
            }
          />
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
