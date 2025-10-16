import { Alert } from 'react-native';
import { adminApi } from '../../../services/api';
import { useMutation, QueryClient } from '@tanstack/react-query';

export function useQuestionMutations(
  queryClient: QueryClient,
  testId: string,
  resetForm: () => void,
  setShowCreateForm: (show: boolean) => void,
  setEditingQuestion: (question: any) => void
) {
  const createMutation = useMutation({
    mutationFn: adminApi.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTest', testId] });
      setShowCreateForm(false);
      resetForm();
      Alert.alert('Succès', 'Question créée avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTest', testId] });
      setEditingQuestion(null);
      resetForm();
      Alert.alert('Succès', 'Question mise à jour avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTest', testId] });
      Alert.alert('Succès', 'Question supprimée avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
