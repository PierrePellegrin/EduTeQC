import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { QuestionForm, QuestionsList, EmptyState, Header } from './components';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { testId: string; testTitle: string } }, 'params'>;
};

export const AdminQuestionsScreen = ({ navigation, route }: Props) => {
  const { testId, testTitle } = route.params;
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  
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

  // Use refactored CRUD mutations hook
  const { useQuestionMutations } = require('./consts');
  const { createMutation, updateMutation, deleteMutation } = useQuestionMutations(testId, resetForm, setShowCreateForm, setEditingQuestion);

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

  const handleTypeChange = (newType: 'SINGLE' | 'MULTIPLE') => {
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
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingQuestion(null);
    resetForm();
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
        <Header testTitle={testTitle} onBack={() => navigation.goBack()} />

        {showCreateForm && (
          <QuestionForm
            formData={formData}
            options={options}
            isEditing={!!editingQuestion}
            isLoading={createMutation.isPending || updateMutation.isPending}
            onFormChange={setFormData}
            onTypeChange={handleTypeChange}
            onAddOption={addOption}
            onRemoveOption={removeOption}
            onUpdateOption={updateOption}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {test?.questions && test.questions.length > 0 && (
          <QuestionsList
            questions={test.questions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {!test?.questions?.length && !showCreateForm && <EmptyState />}
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

