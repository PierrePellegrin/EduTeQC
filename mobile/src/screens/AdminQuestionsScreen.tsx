import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, TextInput, FAB, IconButton, Chip, RadioButton, Checkbox, Divider } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { testId: string; testTitle: string } }, 'params'>;
};

export const AdminQuestionsScreen = ({ navigation, route }: Props) => {
  const { testId, testTitle } = route.params;
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    text: '',
    type: 'SINGLE' as 'SINGLE' | 'MULTIPLE',
    points: '1',
    order: '1',
  });

  const [options, setOptions] = useState<Array<{ text: string; isCorrect: boolean }>>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  const { data: test, isLoading } = useQuery({
    queryKey: ['adminTest', testId],
    queryFn: () => adminApi.getAllTests().then((res: any) => 
      res.tests.find((t: any) => t.id === testId)
    ),
  });

  const resetForm = () => {
    setFormData({
      text: '',
      type: 'SINGLE',
      points: '1',
      order: '1',
    });
    setOptions([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
  };

  // Import mutations from extracted hook
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useQuestionMutations } = require('./adminQuestionsScreen.consts');
  const { createMutation, updateMutation, deleteMutation } = useQuestionMutations(queryClient, testId, resetForm, setShowCreateForm, setEditingQuestion);

  const handleSubmit = () => {
    const validOptions = options.filter(opt => opt.text.trim() !== '');
    const minOptions = formData.type === 'SINGLE' ? 1 : 2;
    if (validOptions.length < minOptions) {
      Alert.alert(
        'Erreur',
        `Veuillez ajouter au moins ${minOptions} option${minOptions > 1 ? 's' : ''}`
      );
      return;
    }

    const hasCorrectAnswer = validOptions.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      Alert.alert('Erreur', 'Veuillez marquer au moins une réponse correcte');
      return;
    }

    if (formData.type === 'SINGLE') {
      const correctCount = validOptions.filter(opt => opt.isCorrect).length;
      if (correctCount !== 1) {
        Alert.alert('Erreur', "Pour un choix unique, marquez exactement une réponse correcte");
        return;
      }
    }

    const data = {
      question: formData.text,
      type: formData.type === 'SINGLE' ? 'SINGLE_CHOICE' : 'MULTIPLE_CHOICE',
      testId: testId,
      points: parseInt(formData.points, 10),
      order: parseInt(formData.order, 10),
      options: validOptions.map((opt, idx) => ({ ...opt, order: idx })),
    };

    if (editingQuestion) {
      updateMutation.mutate({ id: editingQuestion.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (question: any) => {
    setEditingQuestion(question);
    setFormData({
      text: question.question,
      type: question.type === 'SINGLE_CHOICE' ? 'SINGLE' : 'MULTIPLE',
      points: question.points.toString(),
      order: question.order.toString(),
    });
    setOptions(question.options?.length > 0 ? question.options : [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setShowCreateForm(true);
  };

  const handleDelete = (id: string, text: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer cette question ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
      ]
    );
  };

  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    const minOptions = formData.type === 'SINGLE' ? 1 : 2;
    if (options.length > minOptions) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      Alert.alert(
        'Info',
        `Vous devez conserver au moins ${minOptions} option${minOptions > 1 ? 's' : ''}`
      );
    }
  };

  const updateOption = (index: number, field: 'text' | 'isCorrect', value: any) => {
    const newOptions = [...options];
    if (field === 'isCorrect' && formData.type === 'SINGLE') {
      // Pour choix simple, décocher les autres
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index ? value : false;
      });
    } else {
      if (field === 'text') {
        newOptions[index].text = value;
      } else {
        newOptions[index].isCorrect = value;
      }
    }
    setOptions(newOptions);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <View style={styles.headerText}>
            <Text variant="headlineMedium" style={styles.title}>
              Questions du test
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {testTitle}
            </Text>
          </View>
        </View>

        {showCreateForm && (
         <Card style={[styles.formCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.formTitle}>
                {editingQuestion ? 'Modifier la question' : 'Créer une nouvelle question'}
              </Text>

              <TextInput
                label="Question"
                value={formData.text}
                onChangeText={(text) => setFormData({ ...formData, text })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />

              <Text variant="labelLarge" style={styles.label}>Type de question</Text>
              <RadioButton.Group
                onValueChange={(value) => {
                  // Normalize when switching to SINGLE: keep only the first correct option
                  const newType = value as 'SINGLE' | 'MULTIPLE';
                  setFormData({ ...formData, type: newType });
                  if (newType === 'SINGLE') {
                    setOptions((prev) => {
                      const firstCorrectIdx = prev.findIndex((o) => o.isCorrect);
                      return prev.map((o, idx) => ({
                        ...o,
                        isCorrect: firstCorrectIdx !== -1 ? idx === firstCorrectIdx : o.isCorrect,
                      }));
                    });
                  }
                }}
                value={formData.type}
              >
                <View style={styles.radioRow}>
                  <RadioButton.Item label="Choix unique" value="SINGLE" />
                  <RadioButton.Item label="Choix multiple" value="MULTIPLE" />
                </View>
              </RadioButton.Group>

              <View style={styles.row}>
                <TextInput
                  label="Points"
                  value={formData.points}
                  onChangeText={(text) => setFormData({ ...formData, points: text })}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.halfInput}
                />
                <TextInput
                  label="Ordre"
                  value={formData.order}
                  onChangeText={(text) => setFormData({ ...formData, order: text })}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.halfInput}
                />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.optionsHeader}>
                <Text variant="titleMedium">Options de réponse</Text>
                <Button icon="plus" mode="outlined" onPress={addOption} compact>
                  Ajouter
                </Button>
              </View>

              {options.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <View style={styles.optionInput}>
                    <TextInput
                      label={`Option ${index + 1}`}
                      value={option.text}
                      onChangeText={(text) => updateOption(index, 'text', text)}
                      mode="outlined"
                      style={styles.input}
                    />
                    <View style={styles.optionControls}>
                      {formData.type === 'SINGLE' ? (
                        <RadioButton
                          value={index.toString()}
                          status={option.isCorrect ? 'checked' : 'unchecked'}
                          onPress={() => updateOption(index, 'isCorrect', true)}
                        />
                      ) : (
                        <Checkbox
                          status={option.isCorrect ? 'checked' : 'unchecked'}
                          onPress={() => updateOption(index, 'isCorrect', !option.isCorrect)}
                        />
                      )}
                      <Text variant="bodySmall">Correcte</Text>
                      {options.length > 2 && (
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => removeOption(index)}
                        />
                      )}
                    </View>
                  </View>
                </View>
              ))}

              <View style={styles.formActions}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setShowCreateForm(false);
                    setEditingQuestion(null);
                    resetForm();
                  }}
                  style={styles.actionButton}
                >
                  Annuler
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={createMutation.isPending || updateMutation.isPending}
                  style={styles.actionButton}
                >
                  {editingQuestion ? 'Mettre à jour' : 'Créer'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.questionsList}>
          {test?.questions?.map((question: any, index: number) => (
              <Card key={question.id} style={[styles.questionCard, { backgroundColor: theme.colors.cardBackground }]}>
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
                      <Chip icon="format-list-bulleted" compact>
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
                      onPress={() => handleEdit(question)}
                    />
                    <IconButton
                      icon="delete"
                      mode="contained-tonal"
                      iconColor={theme.colors.logoutColor}
                      onPress={() => handleDelete(question.id, question.question)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {!test?.questions?.length && !showCreateForm && (
         <Card style={[styles.emptyCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                Aucune question créée. Cliquez sur le bouton + pour commencer.
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {!showCreateForm && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowCreateForm(true)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
  },
  radioRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionRow: {
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
  },
  optionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  questionsList: {
    gap: 12,
  },
  questionCard: {
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionInfo: {
    flex: 1,
  },
  questionText: {
    marginTop: 8,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  chip: {
    marginLeft: 4,
  },
  optionsLabel: {
    marginTop: 8,
    marginBottom: 4,
    opacity: 0.7,
  },
  optionItem: {
    paddingLeft: 8,
    paddingVertical: 2,
  },
  questionActions: {
    flexDirection: 'row',
    gap: 4,
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
