// Constantes et handlers extraits de AdminCoursesScreen
import { Alert } from 'react-native';
import { adminApi } from '../../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCourseMutations(queryClient: any, resetForm: () => void, setShowCreateForm: (v: boolean) => void, setEditingCourse: (v: any) => void) {
  const createMutation = useMutation({
    mutationFn: adminApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setShowCreateForm(false);
      resetForm();
      Alert.alert('Succès', 'Cours créé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => adminApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setEditingCourse(null);
      resetForm();
      Alert.alert('Succès', 'Cours mis à jour avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      Alert.alert('Succès', 'Cours supprimé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) => 
      adminApi.updateCourse(id, { isPublished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la publication');
    },
  });

  return { createMutation, updateMutation, deleteMutation, togglePublishMutation };
}
