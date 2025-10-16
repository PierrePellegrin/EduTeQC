import { Alert } from 'react-native';
import { adminApi } from '../../../services/api';
import { useMutation, QueryClient } from '@tanstack/react-query';

export function usePackageMutations(
  queryClient: QueryClient,
  resetForm: () => void,
  setShowCreateForm: (show: boolean) => void,
  setEditingPackage: (pkg: any) => void
) {
  const createMutation = useMutation({
    mutationFn: adminApi.createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
      setShowCreateForm(false);
      resetForm();
      Alert.alert('Succès', 'Package créé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
      setEditingPackage(null);
      setShowCreateForm(false);
      resetForm();
      Alert.alert('Succès', 'Package mis à jour avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
      Alert.alert('Succès', 'Package supprimé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      adminApi.updatePackage(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPackages'] });
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors du changement d\'état');
    },
  });

  return { createMutation, updateMutation, deleteMutation, toggleActiveMutation };
}
