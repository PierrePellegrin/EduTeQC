import { adminApi } from '../../../services/api';
import { useCrudMutations } from '../../../hooks/useCrudMutations';

export function useTestMutations(
  resetForm: () => void,
  setShowCreateForm: (show: boolean) => void,
  setEditingTest: (test: any) => void
) {
  const { createMutation, updateMutation, deleteMutation, toggleMutation } = useCrudMutations({
    queryKeys: ['adminTests'],
    api: {
      create: adminApi.createTest,
      update: adminApi.updateTest,
      delete: adminApi.deleteTest,
      toggle: adminApi.updateTest,
    },
    messages: {
      createSuccess: 'Test créé avec succès',
      updateSuccess: 'Test mis à jour avec succès',
      deleteSuccess: 'Test supprimé avec succès',
    },
    callbacks: {
      onCreateSuccess: () => {
        setShowCreateForm(false);
        resetForm();
      },
      onUpdateSuccess: () => {
        setEditingTest(null);
        resetForm();
      },
    },
  });

  return { 
    createMutation, 
    updateMutation, 
    deleteMutation, 
    togglePublishMutation: toggleMutation 
  };
}
