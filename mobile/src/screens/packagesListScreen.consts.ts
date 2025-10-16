import { QueryClient, useMutation } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Alert } from 'react-native';

export const usePackageMutations = (queryClient: QueryClient) => {
  const buyMutation = useMutation({
    mutationFn: adminApi.buyPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPackages'] });
      Alert.alert('Succès', 'Package acheté avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de l\'achat');
    },
  });

  return { buyMutation };
};
