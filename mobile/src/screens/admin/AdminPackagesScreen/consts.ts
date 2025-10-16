import { adminApi } from '../../../services/api';
import { useCrudMutations } from '../../../hooks/useCrudMutations';

export function usePackageMutations(
  resetForm: () => void,
  setShowCreateForm: (show: boolean) => void,
  setEditingPackage: (pkg: any) => void
) {
  const { createMutation, updateMutation, deleteMutation, toggleMutation } = useCrudMutations({
    queryKeys: ['adminPackages'],
    api: {
      create: adminApi.createPackage,
      update: adminApi.updatePackage,
      delete: adminApi.deletePackage,
      toggle: adminApi.updatePackage,
    },
    messages: {
      createSuccess: 'Package créé avec succès',
      updateSuccess: 'Package mis à jour avec succès',
      deleteSuccess: 'Package supprimé avec succès',
    },
    callbacks: {
      onCreateSuccess: () => {
        setShowCreateForm(false);
        resetForm();
      },
      onUpdateSuccess: () => {
        setEditingPackage(null);
        setShowCreateForm(false);
        resetForm();
      },
    },
  });

  return { 
    createMutation, 
    updateMutation, 
    deleteMutation, 
    toggleActiveMutation: toggleMutation 
  };
}
