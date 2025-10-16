import { Alert } from 'react-native';
import { adminApi } from '../../../services/api';
import { useMutation, QueryClient } from '@tanstack/react-query';

export function useTestMutations(
  queryClient: QueryClient,
  resetForm: () => void,
  setShowCreateForm: (show: boolean) => void,
  setEditingTest: (test: any) => void
) {
  const createMutation = useMutation({
    mutationFn: adminApi.createTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      setShowCreateForm(false);
      resetForm();
      Alert.alert('Succès', 'Test créé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateTest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      setEditingTest(null);
      resetForm();
      Alert.alert('Succès', 'Test mis à jour avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      Alert.alert('Succès', 'Test supprimé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) => 
      adminApi.updateTest(id, { isPublished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la publication');
    },
  });

  return { createMutation, updateMutation, deleteMutation, togglePublishMutation };
}
